class GameOver {
    private _onComplete: () => void = null

    constructor({ onComplete }: { onComplete: () => void }) {
        this._onComplete = onComplete
        
        music.play(music.createSong(assets.song`gameOver`), music.PlaybackMode.LoopingInBackground)
        
        controller.player1.onButtonEvent(
            ControllerButton.A,
            ControllerButtonEvent.Pressed,
            () => {
                this._onComplete()
            }
        )
    }

    public onUpdate() {}

    public destroy() {
        music.stopAllSounds()
    }
}
