class GameOver {
    private _onComplete: () => void = null
    private _sprite: Sprite = null
    private _pressSprite: Sprite = null
    private _animationStep: number = 0
    private _nextAnimationTime: number = 0

    constructor({ onComplete }: { onComplete: () => void }) {
        this._onComplete = onComplete
        scene.setBackgroundColor(0)
        
        music.play(music.createSong(assets.song`gameOver`), music.PlaybackMode.LoopingInBackground)
        this._sprite = sprites.create(img`.`)
        this._sprite.setPosition(10, 0)
        
        controller.player1.onButtonEvent(
            ControllerButton.A,
            ControllerButtonEvent.Pressed,
            () => {
                this._onComplete()
            }
        )
    }

    public onUpdate() {
        if (this._animationStep === 0 && this._nextAnimationTime === 0) {
            this._animationStep++
            this._nextAnimationTime = game.runtime() + assets.animation`GAME OVER`.length * 300
            animation.runImageAnimation(this._sprite, assets.animation`GAME OVER`, 300, false)
        } else if (this._animationStep === 1 && game.runtime() > this._nextAnimationTime) {
            this._animationStep++
            this._nextAnimationTime = game.runtime() + 2000
            sprites.destroy(this._sprite)
            scene.setBackgroundImage(assets.image`GameOver`)
        } else if (this._animationStep === 2 && game.runtime() > this._nextAnimationTime) {
            this._pressSprite = sprites.create(assets.image`Press A`)
            this._pressSprite.setPosition(80, 80)
        }
    }

    public destroy() {
        music.stopAllSounds()

        if (this._sprite) {
            sprites.destroy(this._sprite)
            this._sprite = null
        }

        if (this._pressSprite) {
            sprites.destroy(this._pressSprite)
            this._pressSprite = null
        }
    }
}
