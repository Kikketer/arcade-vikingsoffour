class Boat {
    public boatSprite: Sprite = null
    private _health = 3
    // Half second per "beat"
    private _rythmRate: number = 1000
    // 1 = down, -1 = up
    private _currentRowDirection: number = -1
    // The last time the direction changed
    private _lastChangeMillis: number = game.runtime()
    private _shoutSprite: Sprite = null
    private _rowmen: Rowman[] = null
    private _onDie: () => void
    private _activeEnemy: EnemyBoat = null
    private _fires: Sprite[] = []
    // Current song is 8 seconds long, we manually loop it to stay in sync
    private _musicLength: number = 8000
    private _startMusicTime: number = 0
    private _isMusicPlaying: boolean = false

    constructor({ onDie }: { onDie: () => void }) {
        this._onDie = onDie
        this.boatSprite = sprites.create(assets.image`Boat`, SpriteKind.Player)
        this.boatSprite.setPosition(80, 0)
        this.boatSprite.z = 50

        animation.runImageAnimation(this.boatSprite, assets.animation`Wind`, 300, true)

        // And create the rowmen:
        this._rowmen = [
            new Rowman({ controller: controller.player1, boat: this.boatSprite, onShootArrow: () => this._resetShooter(controller.player1) }),
            new Rowman({ controller: controller.player2, boat: this.boatSprite, onShootArrow: () => this._resetShooter(controller.player2) }),
            new Rowman({ controller: controller.player3, boat: this.boatSprite, onShootArrow: () => this._resetShooter(controller.player3) }),
            new Rowman({ controller: controller.player4, boat: this.boatSprite, onShootArrow: () => this._resetShooter(controller.player4) })
        ]

        
        sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyArrow, (boat: Sprite, arrow: Sprite) => {
            scene.cameraShake(3)
            sprites.destroy(arrow)
            this._hit()
        })
    }

    public destroy() {
        for (let rowman of this._rowmen) {
            rowman.destroy()
        }
        sprites.destroy(this._shoutSprite)
        this._shoutSprite = null
        sprites.destroy(this.boatSprite)
        this.boatSprite = null

        for (let i = 0; i < this._fires.length; i++) {
            sprites.destroy(this._fires[i])
        }
        this._fires = []
    }

    // Get the player row factor
    // If they are not in compliance with the direction (-1 = up, 1 = down) return 0
    static getPlayerRowFactor(
        rowman: Rowman,
        direction: number
    ) {
        // Return -1 or 1 depending on the direction of the arrow
        // dy is somewhere around 2.xxxx so this just "normalizes" it
        // Up = -1, Down = 1
        if (rowman.oarDirection < 0) {
            if (direction < 0) return -1
            return 0
        } else if (rowman.oarDirection > 0) {
            if (direction > 0) return 1
            return 0
        }
        return 0
    }

    private _shoutDirection() {
        sprites.destroy(this._shoutSprite)

        let directionName = this._currentRowDirection > 0 ? 'Down!' : 'Up!'
        this._shoutSprite = textsprite.create(directionName)
        this._shoutSprite.setPosition(
            this.boatSprite.x + 10,
            this.boatSprite.y - 15
        )
        this._shoutSprite.z = 51
        // Start the music every 8 rounds, this helps stay in sync
        if (this._startMusicTime === 0 || game.runtime() - this._startMusicTime > this._musicLength) {
            music.play(music.createSong(assets.song`Boat 0`), music.PlaybackMode.InBackground)
            this._startMusicTime = game.runtime()
        }
    }

    private _hit() {
        this._health -= 1
        
        const fireSprite = sprites.create(img`.`)
        fireSprite.setPosition(this.boatSprite.x + Utils.random(-4, 4), this.boatSprite.y + Utils.random(-10, 10))
        fireSprite.z = 51
        animation.runImageAnimation(fireSprite, assets.animation`Fire`, 100, true)

        this._fires.push(fireSprite)

        if (this._health <= 0) {
            for (let i = 0; i < this._fires.length; i++) {
                sprites.destroy(this._fires[i])
            }

            this._fires = []
            // Boat dead!
            this._onDie()
        }
    }

    private _resetShooter(rowmanWhoShot: controller.Controller) {
        // Reset the rowmen loading on the opposite side
        if (rowmanWhoShot.playerIndex === 1 || rowmanWhoShot.playerIndex === 2) {
            this._rowmen[1].resetArrow()
            this._rowmen[0].resetArrow()
        } else if (rowmanWhoShot.playerIndex === 3 || rowmanWhoShot.playerIndex === 4) {
            this._rowmen[2].resetArrow()
            this._rowmen[3].resetArrow()
        }
        
    }

    public onUpdate({ activeEnemy }: { activeEnemy: EnemyBoat }) {
        this._activeEnemy = activeEnemy
        
        // Top can fire:
        if (this._rowmen[0].loadingStage === 3) {
            this._rowmen[1].canShoot = true
        }
        if (this._rowmen[1].loadingStage === 3) {
            this._rowmen[0].canShoot = true
        }
        // Bottom can fire:
        if (this._rowmen[2].loadingStage === 3) {
            this._rowmen[3].canShoot = true
        }
        if (this._rowmen[3].loadingStage === 3) {
            this._rowmen[2].canShoot = true
        }

        for (let i = 0; i < this._rowmen.length; i++) {
            this._rowmen[i].onUpdate({ activeEnemy })
        }

        if (game.runtime() - this._lastChangeMillis > this._rythmRate) {
            this._lastChangeMillis = game.runtime()
            // Change direction!
            this._currentRowDirection = this._currentRowDirection * -1
            // Shout the direction change
            this._shoutDirection()
        }

        // Check to make sure all players per side are complying to the paddle rythm
        // If any player on either side is out of alignment, turn that direction
        const leftSideFactor =
            Math.abs(
                Boat.getPlayerRowFactor(
                    this._rowmen[0],
                    this._currentRowDirection
                )
            ) +
            Math.abs(
                Boat.getPlayerRowFactor(
                    this._rowmen[2],
                    this._currentRowDirection
                )
            )
        const rightSideFactor = Math.abs(
            Boat.getPlayerRowFactor(
                this._rowmen[1],
                this._currentRowDirection
            )
        ) +
        Math.abs(
            Boat.getPlayerRowFactor(
                this._rowmen[3],
                this._currentRowDirection
            )
        )

        // Factors can be from -2 to 2
        // Compare the factors to determine if we turn left or right
        const resultingFactor = leftSideFactor - rightSideFactor
        this.boatSprite.vx = 2 * resultingFactor

        if (
            resultingFactor === 0 &&
            leftSideFactor > 0 &&
            rightSideFactor > 0 &&
            this.boatSprite.vy > -5
        ) {
            // Move forward if everyone is in sync!
            this.boatSprite.vy =
                this.boatSprite.vy - 0.2 * (leftSideFactor + rightSideFactor)
        } else if (this.boatSprite.vy < 0) {
            // Slow down if not in sync
            this.boatSprite.vy = this.boatSprite.vy + 0.2
        }

        // Move any fire sprites with the Boat
        for (let i = 0; i < this._fires.length; i++) {
            // Figure out where the fires IS compared to the center of the sprite
            this._fires[i].setVelocity(this.boatSprite.vx, this.boatSprite.vy)
        }
    }
}
