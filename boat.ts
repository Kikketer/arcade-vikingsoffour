class Boat {
    public boatSprite: Sprite = null
    private _health = 3
    private _boatImage: Image = assets.image`boat`
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
    private _topLoaded: boolean = false
    private _bottomLoaded: boolean = false

    constructor({ onDie }: { onDie: () => void }) {
        this._health = 10
        this._onDie = onDie
        this.boatSprite = sprites.create(this._boatImage, SpriteKind.Player)
        this.boatSprite.setPosition(80, 100)
        this.boatSprite.z = 50

        // And create the rowmen:
        this._rowmen = [
            new Rowman({ controller: controller.player1, boat: this.boatSprite }),
            new Rowman({ controller: controller.player2, boat: this.boatSprite }),
            new Rowman({ controller: controller.player3, boat: this.boatSprite }),
            new Rowman({ controller: controller.player4, boat: this.boatSprite })
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

    private _loadArrow(loader: controller.Controller) {
        // Determine where the current active enemy is
        // If on the opposite side of the controller, mark as loaded
        if (!this._activeEnemy) return

        const enemyOnLeft = this._activeEnemy.enemySprite.x < this.boatSprite.x
        if (!enemyOnLeft && loader.playerIndex === 1) {
            this._topLoaded = true
        } else if (!enemyOnLeft && loader.playerIndex === 3) {
            this._bottomLoaded = true
        } else if (enemyOnLeft && loader.playerIndex === 2) {
            this._topLoaded = true
        } else if (enemyOnLeft && loader.playerIndex === 4) {
            this._bottomLoaded = true
        }
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
    }

    private _hit() {
        this._health -= 1

        if (this._health <= 0) {
            // Boat dead!
            this._onDie()
        }
    }

    public onUpdate({ activeEnemy }: { activeEnemy: EnemyBoat }) {
        this._activeEnemy = activeEnemy
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
    }
}
