class EnemyBoat {
    public enemySprite: Sprite = null

    constructor() {
        console.log('Creating enemy boat!')
        // When creating a new enemy boat, pick a random side to spawn on
        this.enemySprite = new Sprite(assets.image`enemyBoat`)
        // this.enemySprite.setPosition(
        //     Math.floor(Math.random() * (right - left)) + left,
        //     Math.floor(Math.random() * (bottom - top)) + top
        // )
        // this.enemySprite.setVelocity(0, 20)
        // console.logValue('Enemy moving....', this.enemySprite.vy)
        // this.enemySprite.follow(followTarget, 100)
    }

    public onUpdate() {}

    public destroy() {}
}
