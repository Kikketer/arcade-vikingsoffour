class Victory {
    private _onComplete: () => void = null
    private _sprite: Sprite = null
    private _boatSprite: Sprite = null
    private _boatLead: Sprite = null
    private _animStep: number = 0
    private _nextAnimTime: number = 0
    private _shouldBounce: boolean = true

    constructor({ onComplete }: { onComplete: () => void }) {
        this._onComplete = onComplete
        
        controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, () => {
            this._onComplete()
        })
    }

    public onUpdate() {
        if (this._shouldBounce) {
            Utils.bounceSprite(this._boatSprite, this._boatLead)
        }

        if (this._animStep === 0 && this._nextAnimTime === 0) {
            this._animStep++
            this._nextAnimTime = game.runtime() + 4000
            this._sprite = sprites.create(img`.`)
            this._sprite.setPosition(0, 0)
            animation.runImageAnimation(this._sprite, assets.animation`The End`, 800, true)
        } else if (this._animStep === 1 && game.runtime() > this._nextAnimTime) {
            this._animStep++
            this._nextAnimTime = game.runtime() + 3500
            this._boatSprite = sprites.create(assets.image`BoatFront`)
            this._boatSprite.setPosition(180, 0)
            this._boatLead = sprites.create(img`.`)
            this._boatLead.setPosition(180, 0)
            this._boatLead.vx = -10
            this._boatLead.vy = 2
        } else if (this._animStep === 2 && game.runtime() > this._nextAnimTime) {
            this._shouldBounce = false
        }
    }

    public destroy() {
        if (this._sprite) {
            sprites.destroy(this._sprite)
            this._sprite = null
        }

        if (this._boatSprite) {
            sprites.destroy(this._boatSprite)
            this._boatSprite = null
        }

        if (this._boatLead) {
            sprites.destroy(this._boatLead)
            this._boatLead = null
        }
    }
}