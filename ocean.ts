/**
 * This will spawn monsters/enemies and is the "level"
 * This will also be the "main hub" of the loop
 */
class Ocean {
    private _boat: Boat = null
    // The last line we added waves to (so we don't repeat)
    private _lastWaveLine: number = 0
    private _activeEnemy: EnemyBoat = null
    private _nextEnemySpawn: number = 0
    private _shoreLine: number = -100
    private _onComplete: (win: boolean) => void = () => {}
    // 45 second game:
    private _tentacleAppear: number = 450000
    private _tentacles: Sprite[] = []
    private _showTutorial: boolean = false
    private _helpText: Sprite = null
    private _arrowSprite: Sprite = null
    private _arrowTarget: { x: number, y: number } = { x:0, y:0 }
    private _lastTutorialMark: number = 0
    private _activeTutorialStep: number = 0

    constructor({ onComplete, showTutorial }: { onComplete: (win: boolean) => void, showTutorial: boolean }) {
        scene.setBackgroundColor(13)
        this.createInitialWaves()
        this._onComplete = onComplete
        this._showTutorial = showTutorial
        this._boat = new Boat({ onDie: () => this._onComplete(false) })
        
        // Set the initial wave line to the active boat location
        // We only need to see it change to decide if waves should be added
        this._lastWaveLine = this._boat.boatSprite.y
        scene.cameraFollowSprite(this._boat.boatSprite)

        this._activeEnemy = new EnemyBoat({
            followTarget: this._boat.boatSprite,
            firstShot: 12000,
            onDestroy: () => {
                this._activeEnemy = null
            }
        })

        // Decide when the next enemy should spawn
        // This enemy won't appear until the other is dead
        this._nextEnemySpawn = game.runtime() + Utils.random(5000, 10000)
    }

    public destroy() {
        music.stopAllSounds()
        
        if (this._boat) {
            this._boat.destroy()
            // TODO Why is this causing a crash...
            // Something is accessing the boat after destroy()
            // this._boat = null
        }

        if (this._activeEnemy) {
            this._activeEnemy.destroy()
            this._activeEnemy = null
        }

        if (this._tentacles.length) {
            for (let i = 0; i < this._tentacles.length; i++) {
                sprites.destroy(this._tentacles[i])
            }
            this._tentacles = []
        }

        this._showTutorial = false
        this._lastTutorialMark = 0

        if (this._helpText) {
            sprites.destroy(this._helpText)
            this._helpText = null
        }

        if (this._arrowSprite) {
            sprites.destroy(this._arrowSprite)
            this._arrowSprite = null
        }

        sprites.destroyAllSpritesOfKind(SpriteKind.Wave)
    }

    // Used for initial draw of the Ocean
    // Future waves are added as we move forward
    private createInitialWaves() {
        for (let i = 0; i < 10; i++) {
            const spriteToCreate = sprites.create(assets.image`waves`, SpriteKind.Wave)
            // Place the wave in a random spot on the active screen
            const xPos = Utils.random(0, 160)
            const yPos = Utils.random(-60, 60)
            // Destroy when leaving the screen
            spriteToCreate.setFlag(SpriteFlag.AutoDestroy, true)
            spriteToCreate.setPosition(xPos, yPos)
            animation.runImageAnimation(
                spriteToCreate,
                assets.animation`waveAnimation`,
                500,
                true
            )
        }
    }

    // Adds some waves to the top of the screen as they move forward
    private addMoreWaves() {
        if (!this._boat || !this._boat.boatSprite) return
        // TODO determine what area is "new" on the screen
        // For now just spawn at the top
        const newWave = sprites.create(assets.image`waves`, SpriteKind.Wave)
        newWave.setFlag(SpriteFlag.AutoDestroy, true)
        newWave.setPosition(
            Math.floor(Math.random() * 160) + (this._boat.boatSprite.x - 80),
            this._boat.boatSprite.y - 60
        )
        newWave.z = 0
        animation.runImageAnimation(
            newWave,
            assets.animation`waveAnimation`,
            500,
            true
        )
    }

    public onUpdate() {
        if (!this._boat || !this._boat.boatSprite) return

        this._showHelpText()

        this._boat.onUpdate({
            activeEnemy: this._activeEnemy
        })
        // Add more waves if we have gone X pixels beyond last Check
        if (
            Math.abs(this._boat.boatSprite.y - this._lastWaveLine) >
            Utils.random(10, 15) && 
            this._boat.boatSprite.y > this._shoreLine
        ) {
            this._lastWaveLine = this._boat.boatSprite.y
            this.addMoreWaves()
        }

        // Check to see if we can see the shore
        if (this._boat.boatSprite.y < this._shoreLine) {
            const shore = image.create(160, 70)
            shore.fillRect(0, 0, 160, (this._boat.boatSprite.y - this._shoreLine) * -1, 9)
            scene.setBackgroundImage(shore)
        }

        // And check for end-game
        if (this._boat.boatSprite.y < this._shoreLine - 50) {
            this._onComplete(true)
        }

        if (this._activeEnemy) {
            this._activeEnemy.onUpdate()
        } else if (game.runtime() > this._nextEnemySpawn) {
            this._activeEnemy = new EnemyBoat({
                followTarget: this._boat.boatSprite,
                onDestroy: () => {
                    this._activeEnemy = null
                }
            })
            // Schedule next spawn
            this._nextEnemySpawn =
                game.runtime() + Utils.random(5000, 8000)
        }

        // Spawn tentacles
        if (game.runtime() > this._tentacleAppear && !this._tentacles.length) {
            for (let i = 0; i < 2; i++) {
                const tentacle = sprites.create(img`7`, SpriteKind.Enemy)
                tentacle.setPosition(this._boat.boatSprite.x - (i * 16), this._boat.boatSprite.y + 50 + (i * 5))
                tentacle.vy = -5
                animation.runImageAnimation(tentacle, assets.animation`totally a tentacle`, 200 + (i * 40), true)
                this._tentacles.push(tentacle)
            }
        } else if (game.runtime() > this._tentacleAppear + 10000) {
            // If tenticles are alive, we only have a limited time!
            this._onComplete(false)
        }
    }

    private _showHelpText() {
        if (!this._showTutorial) return

        if (this._lastTutorialMark === 0) {
            this._lastTutorialMark = game.runtime()
            return
        }

        // Bounce any helper sprites:
        Utils.bounceSprite(this._arrowSprite, this._arrowTarget)

        // Always clear after 3 seconds
        if (game.runtime() > this._lastTutorialMark + 3000) {
            sprites.destroy(this._helpText)
            sprites.destroy(this._arrowSprite)

            this._lastTutorialMark = game.runtime()
            this._activeTutorialStep++
            return
        }

        // Goal
        if (game.runtime() > this._lastTutorialMark + 500 && this._activeTutorialStep === 0) {
            // First show the text near the enemy boat
            this._helpText = textsprite.create("Get to shore!", 15, 1)
            this._helpText.z = 100
            this._helpText.setPosition(this._boat.boatSprite.x, this._boat.boatSprite.y + 16)

            this._arrowSprite = sprites.create(assets.image`arrowUp`)
            this._arrowSprite.z = 100
            this._arrowTarget = { x: scene.cameraProperty(CameraProperty.X), y: scene.cameraProperty(CameraProperty.Top) + 10 }

            this._lastTutorialMark = game.runtime()
            this._activeTutorialStep++
            return
        }

        // Row tutorial
        if (game.runtime() > this._lastTutorialMark + 1000 && this._activeTutorialStep === 2) {
            // First show the text near the enemy boat
            if (this._boat && this._boat.boatSprite) {
                this._helpText = textsprite.create("Push up and down in sync", 15, 1)
                this._helpText.z = 100
                this._helpText.setPosition(this._boat.boatSprite.x, this._boat.boatSprite.y + 16)

                this._lastTutorialMark = game.runtime()
            }
            this._activeTutorialStep++
            return
        }

        // Enemy tutorial:
        if (game.runtime() > this._lastTutorialMark + 1000 && this._activeTutorialStep === 4) {
            // First show the text near the enemy boat
            if (this._boat && this._boat.boatSprite && this._activeEnemy && this._activeEnemy.enemySprite) {
                this._helpText = textsprite.create("Enemies will attack you!", 15, 1)
                this._helpText.z = 100
                this._helpText.setPosition(this._boat.boatSprite.x, this._boat.boatSprite.y + 16)
                this._arrowSprite = sprites.create(assets.image`arrowUp`)
                this._arrowSprite.z = 100
                this._arrowTarget = this._activeEnemy.enemySprite

                this._lastTutorialMark = game.runtime()
            }
            this._activeTutorialStep++
            return
        }

        // Shoot tutorial
        if (game.runtime() > this._lastTutorialMark + 500 && this._activeTutorialStep === 6) {
            // First show the text near the enemy boat
            if (this._boat && this._boat.boatSprite && this._activeEnemy && this._activeEnemy.enemySprite) {
                this._helpText = textsprite.create("Tap \"B\" 3 times to arm", 15, 1)
                this._helpText.z = 100
                this._helpText.setPosition(this._boat.boatSprite.x, this._boat.boatSprite.y + 16)
                
                // Put the arrow below the loading bar
                this._arrowSprite = sprites.create(assets.image`arrowUp`)
                this._arrowSprite.z = 100
                if (this._activeEnemy.enemySprite.x < this._boat.boatSprite.x) {
                    // On left
                    this._arrowTarget = { x: scene.cameraProperty(CameraProperty.Right) - 10, y: scene.cameraProperty(CameraProperty.Top) + 10}
                } else {
                    this._arrowTarget = { x: scene.cameraProperty(CameraProperty.Left) + 10, y: scene.cameraProperty(CameraProperty.Top) + 10 }
                }

                this._lastTutorialMark = game.runtime()
            }
            this._activeTutorialStep++
            return
        }

        if (game.runtime() > this._lastTutorialMark + 500 && this._activeTutorialStep === 8) {
            // First show the text near the enemy boat
            if (this._boat && this._boat.boatSprite && this._activeEnemy && this._activeEnemy.enemySprite) {
                this._helpText = textsprite.create("When green SHOOT!", 15, 1)
                this._helpText.z = 100
                this._helpText.setPosition(this._boat.boatSprite.x, this._boat.boatSprite.y + 16)

                // Put the arrow below the loading bar
                this._arrowSprite = sprites.create(assets.image`arrowUp`)
                this._arrowSprite.z = 100
                if (this._activeEnemy.enemySprite.x < this._boat.boatSprite.x) {
                    // On left
                    this._arrowTarget = { x: scene.cameraProperty(CameraProperty.Left) + 10, y: scene.cameraProperty(CameraProperty.Top) + 10 }
                } else {
                    this._arrowTarget = { x: scene.cameraProperty(CameraProperty.Right) - 10, y: scene.cameraProperty(CameraProperty.Top) + 10 }
                }

                this._lastTutorialMark = game.runtime()
            }
            this._activeTutorialStep++
            return
        }
    }
}
