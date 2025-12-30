class Title {
    private _titleSprite: Sprite = null
    private _boatSprite: Sprite = null
    private _boatLead: Sprite = null
    private _pressSprite: Sprite = null
    private _introStep: number = 0
    private _nextIntroTime: number = 0

    constructor({ onComplete }: { onComplete: () => void }) {
        controller.player1.onButtonEvent(
            ControllerButton.A,
            ControllerButtonEvent.Pressed,
            () => {
                onComplete()
            }
        )
    }

    public onUpdate() {
        this._animateTitle()

        if (this._boatLead && this._boatSprite) {
            Utils.bounceSprite(this._boatSprite, this._boatLead, 3, 0.003)
            Utils.bounceSprite(this._pressSprite, { x: 40, y: 75 })

            if (this._boatLead.x < 150) {
                this._boatLead.vx = 0
                this._boatLead.vy = 0
            }
        }
    }

    public destroy() {
        scene.setBackgroundImage(img`.`)
        if (this._titleSprite) {
            sprites.destroy(this._titleSprite)
            this._titleSprite = null
        }
        if (this._boatSprite) {
            sprites.destroy(this._boatSprite)
            this._boatSprite = null
        }
        if (this._boatLead) {
            sprites.destroy(this._boatLead)
            this._boatLead = null
        }
        if (this._pressSprite) {
            sprites.destroy(this._pressSprite)
            this._pressSprite = null
        }
    }

    private _animateTitle() {
        if (this._introStep === 0 && this._nextIntroTime === 0) {
            this._introStep++
            this._nextIntroTime = game.runtime() + 700
            this._titleSprite = sprites.create(img`.`)
            this._titleSprite.setPosition(1, 1)
            animation.runImageAnimation(
                this._titleSprite,
                assets.animation`Scroll out`,
                50,
                false
            )
        } else if (this._introStep === 1 && game.runtime() > this._nextIntroTime) {
            this._introStep++
            this._nextIntroTime = game.runtime() + 400
            animation.runImageAnimation(
                this._titleSprite,
                assets.animation`Title Fade in`,
                100,
                false
            )
        } else if (this._introStep === 2 && game.runtime() > this._nextIntroTime) {
            this._introStep++
            this._nextIntroTime = game.runtime() + 1000
            sprites.destroy(this._titleSprite)
            scene.setBackgroundImage(assets.image`Title0`)
        } else if (this._introStep === 3 && game.runtime() > this._nextIntroTime) {
            this._introStep++
            this._nextIntroTime = game.runtime() + 2000
            this._boatSprite = sprites.create(assets.image`BoatFront`)
            this._boatLead = sprites.create(img`.`)
            this._boatLead.setPosition(180, 0)
            this._boatLead.vx += -10
            this._boatLead.vy += 4
        } else if (this._introStep === 4 && game.runtime() > this._nextIntroTime) {
            this._introStep++
            this._pressSprite = sprites.create(assets.image`Press A`)
        }
    }
}
