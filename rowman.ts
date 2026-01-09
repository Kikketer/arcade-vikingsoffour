class Rowman {   
    public oarDirection: number = 0
    static loadIncrementTime: number = 400
    
    private _controller: controller.Controller = null
    private _sprite: Sprite = null
    private _boat: Sprite = null
    private _arrow: Sprite = null
    private _targetEnemy: EnemyBoat = null
    private _loadSprite: Sprite = null
    private _loadStartTime: number = 0
    public loadingStage: number = 0
    private _isLeftRowman: boolean = false
    private _isShooter: boolean = false
    // Increase load interval every X (and not before)
    // 100ms slop so you can be slightly off
    private _arrowLoadInterval: number = 400
    public canShoot: boolean = false
    private _onShootArrow: () => void
    private _arrowLoadSprite: Sprite = null
    
    constructor({ controller, boat, onShootArrow }: { 
            controller: controller.Controller, 
            boat: Sprite, 
            onShootArrow: () => void 
        }) {
        this._controller = controller
        this._boat = boat
        this._onShootArrow = onShootArrow
        this._sprite = sprites.create(assets.image`oarStraight`)
        this._sprite.z = 51

        this._loadSprite = sprites.create(assets.image`fillEmpty`)
        this._loadSprite.z = 100

        this._arrowLoadSprite = sprites.create(img`.`)
        this._arrowLoadSprite.z = 100

        // Odd rowmen are on the left
        this._isLeftRowman = controller.playerIndex % 2 === 1

        this._controller.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () { 
            if (this.canShoot) {
                this._shootArrow()
            } else if (!this._isShooter) {
                this._loadArrow()
            } else {
                console.log('You do nothing...')
            }
        })
    }

    public onUpdate({ activeEnemy }: { activeEnemy: EnemyBoat }) {
        if (!this._controller) return
        this._targetEnemy = activeEnemy

        // Enemy on the left, left players only launch arrows not load
        if ((this._isLeftRowman && this._targetEnemy && this._targetEnemy.enemySprite && this._targetEnemy.enemySprite.x < this._boat.x) ||
            (!this._isLeftRowman && this._targetEnemy && this._targetEnemy.enemySprite && this._targetEnemy.enemySprite.x > this._boat.x)) {
            this._isShooter = true
            sprites.destroy(this._arrowLoadSprite)
            this._arrowLoadSprite = sprites.create(img`.`)
            this._loadSprite.setImage(assets.image`noShoot`)
            
            if (this.canShoot) {
                this._loadSprite.setImage(assets.image`canShoot`)
            }
        } else {
            // Decrease if beyond the load start time
            if (game.runtime() > this._loadStartTime + this._arrowLoadInterval) {
                this.loadingStage = this.loadingStage - 1
                if (this.loadingStage < 0) this.loadingStage = 0
            }
            
            // Loading display
            if (this.loadingStage === 0) {
                this._loadSprite.setImage(assets.image`fillEmpty`)
            } else if (this.loadingStage === 1) {
                this._loadSprite.setImage(assets.image`fillMid`)
            } else if (this.loadingStage === 2) {
                this._loadSprite.setImage(assets.image`fillAlmost`)
            } else if (this.loadingStage === 3) {
                this._loadSprite.setImage(assets.image`fillFull`)
            }
        }

        // Make sure the oar stays attached :)
        if (this._controller.playerIndex === 1) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2), this._boat.y - 4)
            this._loadSprite.setPosition(scene.cameraProperty(CameraProperty.Left) + 10, scene.cameraProperty(CameraProperty.Top) + 8)
            this._arrowLoadSprite.setPosition(scene.cameraProperty(CameraProperty.Left) + 10, scene.cameraProperty(CameraProperty.Top) + 16)
            // TEMP:
            // this.loadingStage = 3
        } else if (this._controller.playerIndex === 2) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2), this._boat.y - 4)
            this._loadSprite.setPosition(scene.cameraProperty(CameraProperty.Right) - 10, scene.cameraProperty(CameraProperty.Top) + 8)
            this._arrowLoadSprite.setPosition(scene.cameraProperty(CameraProperty.Right) - 10, scene.cameraProperty(CameraProperty.Top) + 16)
        } else if (this._controller.playerIndex === 3) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2), this._boat.y + 6)
            this._loadSprite.setPosition(scene.cameraProperty(CameraProperty.Left) + 10, scene.cameraProperty(CameraProperty.Bottom) - 8)
            this._arrowLoadSprite.setPosition(scene.cameraProperty(CameraProperty.Left) + 10, scene.cameraProperty(CameraProperty.Bottom) - 16)
        } else if (this._controller.playerIndex === 4) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2), this._boat.y + 6)
            this._loadSprite.setPosition(scene.cameraProperty(CameraProperty.Right) - 10, scene.cameraProperty(CameraProperty.Bottom) - 8)
            this._arrowLoadSprite.setPosition(scene.cameraProperty(CameraProperty.Right) - 10, scene.cameraProperty(CameraProperty.Bottom) - 16)
        }

        // Oar move
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

        if (this._arrowLoadSprite) {
            sprites.destroy(this._arrowLoadSprite)
            this._arrowLoadSprite = null
        }

        if (this._loadSprite) {
            sprites.destroy(this._loadSprite)
            this._loadSprite = null
        }

        this._controller.onButtonEvent(
            ControllerButton.B,
            ControllerButtonEvent.Pressed,
            () => {}
        )
    }

    public resetArrow() {
        this._loadStartTime = 0
        this.loadingStage = 0
        this.canShoot = false
    }

    private _loadArrow() {
        console.log(`loading arrow at: ${this._loadStartTime} - ${this.loadingStage}`)
        if (this._loadStartTime === 0) {
            // Start loading the arrow for the other side
            this.loadingStage = 1
            this._loadStartTime = game.runtime() + this._arrowLoadInterval
            animation.runImageAnimation(this._arrowLoadSprite, assets.animation`Dots`, this._arrowLoadInterval / 3, false)
        } else {
            // If you push too fast it'll reset!
            if (game.runtime() < this._loadStartTime) {
                console.log('Too fast!')
                this.loadingStage = 0
                this._loadStartTime = 0
                return
            }
            // If you push too late, you fail as well
            if (game.runtime() > this._loadStartTime + this._arrowLoadInterval) {
                console.log('Too late!')
                this.loadingStage = 0
                this._loadStartTime = 0
                return
            }

            animation.runImageAnimation(this._arrowLoadSprite, assets.animation`Dots`, this._arrowLoadInterval / 3, false)

            this.loadingStage = this.loadingStage + 1
            this._loadStartTime = game.runtime() + this._arrowLoadInterval
            if (this.loadingStage > 3) {
                this.loadingStage = 3
            }
        }
    }

    private _shootArrow() {
        if (!this._isShooter ||
            !this._sprite ||
            !this._targetEnemy || 
            !this._targetEnemy.enemySprite || 
            this._arrow) {
                return
            }

        // Check to see if there are any enemies on your side
        this._arrow = sprites.create(assets.image`arrowLeft`)
        this._arrow.setPosition(this._boat.x, this._boat.y)
        this._arrow.setFlag(SpriteFlag.AutoDestroy, true)
        this._arrow.z = 51
        this._arrow.onDestroyed(() => {
            this._arrow = null
        })
        // Set the right art (flipping carries over so it's hard to know if we should flip or not based on previous)
        if (this._isLeftRowman) {
            this._arrow.setImage(assets.image`arrowLeft`)
        } else {
            this._arrow.setImage(assets.image`arrowRight`)
        }

        if (this._isShooter) {
            // Fire arrow at the enemy!    
            this._arrow.follow(this._targetEnemy.enemySprite, 40)
        } else if (this._isLeftRowman) {
            // Or just fling an arrow
            // This isn't really used now since you load if you are not on the side of the enemy
            // Keeping for future
            this._arrow.vx = -40
        } else {
            this._arrow.vx = 40
        }

        this._onShootArrow()
    }
}
