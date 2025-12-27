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

    constructor({ onComplete }: { onComplete: (win: boolean) => void }) {
        scene.setBackgroundColor(11)
        this.createInitialWaves()
        this._onComplete = onComplete
        this._boat = new Boat({ onDie: () => this._onComplete(false) })
        
        // Set the initial wave line to the active boat location
        // We only need to see it change to decide if waves should be added
        this._lastWaveLine = this._boat.boatSprite.y
        scene.cameraFollowSprite(this._boat.boatSprite)

        this._activeEnemy = new EnemyBoat({
            followTarget: this._boat.boatSprite
        })

        // Decide when the next enemy should spawn
        this._nextEnemySpawn =
            game.runtime() + Math.floor(Math.random() * 5000) + 5000
    }

    public destroy() {
        if (this._boat) {
            this._boat.destroy()
            this._boat = null
        }

        if (this._activeEnemy) {
            this._activeEnemy.destroy()
            this._activeEnemy = null
        }
    }

    // Used for initial draw of the Ocean
    // Future waves are added as we move forward
    private createInitialWaves() {
        for (let i = 0; i < 10; i++) {
            const spriteToCreate = new Sprite(assets.image`waves`)
            // Place the wave in a random spot on the active screen
            const xPos = Math.floor(Math.random() * 160)
            const yPos = Math.floor(Math.random() * 120)
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
        // TODO determine what area is "new" on the screen
        // For now just spawn at the top
        const newWave = new Sprite(assets.image`waves`)
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
        if (this._boat) {
            this._boat.onUpdate({
                activeEnemy: this._activeEnemy
            })
            // Add more waves if we have gone X pixels beyond last Check
            if (
                Math.abs(this._boat.boatSprite.y - this._lastWaveLine) >
                Math.floor(Math.random() * 5) + 10 && 
                this._boat.boatSprite.y > this._shoreLine
            ) {
                this._lastWaveLine = this._boat.boatSprite.y
                this.addMoreWaves()
            }

            // Check to see if we can see the shore
            if (this._boat.boatSprite.y < this._shoreLine) {
                const shore = image.create(160, 70)
                shore.fillRect(0, 0, 160, (this._boat.boatSprite.y - this._shoreLine) * -1, 15)
                scene.setBackgroundImage(shore)
            }

            // And check for end-game
            if (this._boat.boatSprite.y < this._shoreLine - 50) {
                this._onComplete(true)
            }
        }

        if (this._activeEnemy) {
            this._activeEnemy.onUpdate()
        } else if (game.runtime() > this._nextEnemySpawn && this._boat) {
            console.log(`The active enemy ${!!this._activeEnemy}`)
            this._activeEnemy = new EnemyBoat({
                followTarget: this._boat.boatSprite
            })
            // Schedule next spawn
            this._nextEnemySpawn =
                game.runtime() + Math.floor(Math.random() * 5000) + 5000
        }
    }
}
