/**
 * This will spawn monsters/enemies and is the "level"
 * This will also be the "main hub" of the loop
 */
class Ocean {
    private _activeWaves: Sprite[] = []
    private _boat: Boat = null

    constructor() {
        scene.setBackgroundColor(11)
        this._boat = new Boat()
    }

    public onUpdate() {
        if (this._boat) {
            this._boat.onUpdate()
        }
    }
}