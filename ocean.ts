/**
 * This will spawn monsters/enemies and is the "level"
 * This will also be the "main hub" of the loop
 */
class Ocean {
    private _boat: Boat = null
    // The last line we added waves to (so we don't repeat)
    private _lastWaveLine: number = 0

    constructor() {
        scene.setBackgroundColor(11)
        this.createInitialWaves()
        this._boat = new Boat()
        // Set the initial wave line to the active boat location
        // We only need to see it change to decide if waves should be added
        this._lastWaveLine = this._boat.boatSprite.y
        scene.cameraFollowSprite(this._boat.boatSprite)
    }

    // Used for initial draw of the Ocean
    // Future waves are added as we move forward
    private createInitialWaves() {
        for (let i = 0; i < 10; i++) {
            const spriteToCreate = new Sprite(assets.image`waves`)
            // Place the wave in a random spot on the active screen
            const xPos = Math.floor(Math.random() * 160)
            const yPos = Math.floor(Math.random() * 120)
            // Destroy when leaving the screen
            spriteToCreate.setFlag(SpriteFlag.AutoDestroy, true)
            spriteToCreate.setPosition(xPos, yPos)
            animation.runImageAnimation(spriteToCreate, assets.animation`waveAnimation`, 500, true)
        }
    }

    // Adds some waves to the top of the screen as they move forward
    private addMoreWaves() {
        // TODO determine what area is "new" on the screen
        // For now just spawn at the top
        const newWave = new Sprite(assets.image`waves`)
        newWave.setFlag(SpriteFlag.AutoDestroy, true)
        newWave.setPosition(Math.floor(Math.random() * 160) + (this._boat.boatSprite.x - 80), this._boat.boatSprite.y - 60)
        newWave.z = 0
        animation.runImageAnimation(newWave, assets.animation`waveAnimation`, 500, true)
    }

    public onUpdate() {
        if (this._boat) {
            this._boat.onUpdate()
            // Add more waves if we have gone X pixels beyond last Check
            if (Math.abs(this._boat.boatSprite.y - this._lastWaveLine) > Math.floor(Math.random() * 5) + 10) {
                this._lastWaveLine = this._boat.boatSprite.y
                this.addMoreWaves()
            }
        }
    }
}