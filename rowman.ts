class Rowman {
    public oarDirection: number = 0
    private _controller: controller.Controller = null
    
    constructor(controller: controller.Controller) {
        this._controller = controller
        console.log('Created rowman!')
    }

    public onUpdate() {}

    public destroy() {}
}
