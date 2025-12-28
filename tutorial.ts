class Tutorial {
    private _onComplete: () => void = null

    constructor({ onComplete }: { onComplete: () => void } ) {
        console.log('Initialize tutorial')
        this._onComplete = onComplete
    }

    public onUpdate() {}

    public destroy() {
        console.log("Destroying...")
    }
}