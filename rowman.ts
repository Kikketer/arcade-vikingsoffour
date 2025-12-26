class Rowman {   
    public oarDirection: number = 0
    
    private _controller: controller.Controller = null
    private _sprite: Sprite = null
    private _boat: Sprite = null
    
    constructor({ controller, boat }: { controller: controller.Controller, boat: Sprite }) {
        this._controller = controller
        this._boat = boat
        this._sprite = sprites.create(assets.image`oarStraight`)
        this._sprite.z = 51
    }

    public onUpdate() {
        if (!this._controller) return

        // Make sure the oar stays attached :)
        if (this._controller.playerIndex === 1) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2) - 3, this._boat.y)
        } else if (this._controller.playerIndex === 2) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2) + 3, this._boat.y)
        } else if (this._controller.playerIndex === 3) {
            this._sprite.setPosition(this._boat.x - (this._boat.width / 2) - 3, this._boat.y + 8)
        } else if (this._controller.playerIndex === 4) {
            this._sprite.setPosition(this._boat.x + (this._boat.width / 2) + 3, this._boat.y + 8)
        }

        if (this._controller.dy() < 0 && this.oarDirection >= 0) {
            console.log(`Is Up`)
            // UP:
            this.oarDirection = -1
            this._sprite.setImage(assets.image`oarUp`)
        } else if (this._controller.dy() > 0 && this.oarDirection <= 0) {
            // Down:
            this.oarDirection = 1
            this._sprite.setImage(assets.image`oarDown`)
        } else if (this._controller.dy() === 0 && this.oarDirection !== 0) {
            this.oarDirection = 0
            this._sprite.setImage(assets.image`oarStraight`)
        }
    }

    public destroy() {
        sprites.destroy(this._sprite)
        this._sprite = null
    }
}
