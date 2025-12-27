class Rowman {   
    public oarDirection: number = 0
    
    private _controller: controller.Controller = null
    private _sprite: Sprite = null
    private _boat: Sprite = null
    private _arrow: Sprite = null
    private _targetEnemy: EnemyBoat = null
    
    constructor({ controller, boat }: { controller: controller.Controller, boat: Sprite }) {
        this._controller = controller
        this._boat = boat
        this._sprite = sprites.create(assets.image`oarStraight`)
        this._sprite.z = 51

        this._controller.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () { this._shootArrow() })
    }

    public onUpdate({ activeEnemy }: { activeEnemy: EnemyBoat }) {
        if (!this._controller) return
        this._targetEnemy = activeEnemy

        // Make sure the oar stays attached :)
        if (this._controller.playerIndex === 1) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2) - 3, this._boat.y)
        } else if (this._controller.playerIndex === 2) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2) + 3, this._boat.y)
        } else if (this._controller.playerIndex === 3) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2) - 3, this._boat.y + 8)
        } else if (this._controller.playerIndex === 4) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2) + 3, this._boat.y + 8)
        }

        if (this._controller.dy() < 0 && this.oarDirection >= 0) {
            // UP:
            this.oarDirection = -1
            this._sprite.setImage(assets.image`oarUp`)
            // And flip if we are an odd player (right side)
            if (this._controller.playerIndex % 2 === 0) {
                this._sprite.image.flipX()
            }
        } else if (this._controller.dy() > 0 && this.oarDirection <= 0) {
            // Down:
            this.oarDirection = 1
            this._sprite.setImage(assets.image`oarDown`)
            if (this._controller.playerIndex % 2 === 0) {
                this._sprite.image.flipX()
            }
        } else if (this._controller.dy() === 0 && this.oarDirection !== 0) {
            this.oarDirection = 0
            this._sprite.setImage(assets.image`oarStraight`)
        }

        // Arrow destroy!
        if (this._arrow && this._arrow.overlapsWith(this._targetEnemy.enemySprite)) {
            sprites.destroy(this._arrow)
            this._targetEnemy.hit({ damage: 1 })
        }
    }

    public destroy() {
        if (this._sprite) {
            sprites.destroy(this._sprite)
            this._sprite = null
        }
        
        if (this._arrow) {
            sprites.destroy(this._arrow)
            this._arrow = null
        }
    }

    private _shootArrow() {
        if (!this._sprite || 
            !this._targetEnemy || 
            !this._targetEnemy.enemySprite || 
            this._arrow) {
                return
            }

        // Check to see if there are any enemies on your side
        const isLeftSide = this._controller.playerIndex % 2 === 1
        this._arrow = sprites.create(assets.image`arrowLeft`)
        this._arrow.setPosition(this._boat.x, this._boat.y)
        this._arrow.setFlag(SpriteFlag.AutoDestroy, true)
        this._arrow.z = 51
        this._arrow.onDestroyed(() => {
            this._arrow = null
        })

        if (isLeftSide && this._targetEnemy.enemySprite.x <= this._boat.x) {
            // Fire arrow at the enemy!    
            this._arrow.follow(this._targetEnemy.enemySprite, 40)
        } else if (!isLeftSide && this._targetEnemy.enemySprite.x >= this._boat.x) {
            // Shoot right
            this._arrow.image.flipX()
            this._arrow.follow(this._targetEnemy.enemySprite, 40)
        } else if (isLeftSide) {
            this._arrow.vx = -40
        } else if (!isLeftSide) {
            this._arrow.vx = 40
        }
    }
}
