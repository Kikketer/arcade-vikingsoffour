class Title {
    constructor({ onComplete }: { onComplete: () => void }) {
        scene.setBackgroundImage(assets.image`Title`)

        controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, () => {
            onComplete()
        })
    }

    public onUpdate() {}

    public destroy() {
        scene.setBackgroundImage(img`.`)
    }
}
