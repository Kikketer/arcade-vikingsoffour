class EnemyBoat {
    public enemySprite: Sprite = null
    private _followSprite: Sprite = null

    constructor({ followTarget }: { followTarget: Sprite }) {
        this._followSprite = followTarget
        // When creating a new enemy boat, pick a random side to spawn on
        this.enemySprite = sprites.create(assets.image`enemyBoat`)
        this.enemySprite.follow(this._followSprite, 5)
    }

    public onUpdate() {
        // if (Utils.getDistanceBetweenSprites({ spriteA: this.enemySprite, spriteB: this._followSprite}) < 20) {
        //     console.log("I'm Close!!!!")
        // }
    }

    public destroy() {}
}
