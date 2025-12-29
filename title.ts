class Title {
    private _titleSprite: Sprite = null
    private _boatSprite: Sprite = null
    private _boatLead: Sprite = null

    constructor({ onComplete }: { onComplete: () => void }) {
        controller.player1.onButtonEvent(
            ControllerButton.B,
            ControllerButtonEvent.Pressed,
            () => {
                onComplete()
            }
        )

        this._animateTitle()
    }

    public onUpdate() {
        if (this._boatLead && this._boatSprite) {
            Utils.bounceSprite(this._boatSprite, this._boatLead, 3, 0.003)

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
    }

    private _animateTitle() {
        this._titleSprite = sprites.create(img`.`)
        this._titleSprite.setPosition(1, 1)
        animation.runImageAnimation(
            this._titleSprite,
            assets.animation`Scroll out`,
            50,
            false
        )
        pause(700)
        animation.runImageAnimation(
            this._titleSprite,
            assets.animation`Title Fade in`,
            100,
            false
        )
        pause(400)
        sprites.destroy(this._titleSprite)
        scene.setBackgroundImage(assets.image`Title`)
        pause(1000)
        this._boatSprite = sprites.create(assets.image`BoatFront`)
        this._boatLead = sprites.create(img`.`)
        this._boatLead.setPosition(180, -10)
        this._boatLead.vx += -10
        this._boatLead.vy += 4
    }
}
