class Victory {
    private _onComplete: () => void = null

    constructor({ onComplete }: { onComplete: () => void }) {
        // music.play(
        //     music.createSong(assets.song`victory`),
        //     music.PlaybackMode.LoopingInBackground
        // )
        this._onComplete = onComplete

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
