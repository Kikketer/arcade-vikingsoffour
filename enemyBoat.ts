class EnemyBoat {
    public enemySprite: Sprite = null
    private _followSprite: Sprite = null
    private _health: number = 3
    private _nextShotTime: number = 0
    private _arrow: Sprite = null

    constructor({ followTarget, firstShot }: { followTarget: Sprite, firstShot?: number }) {
        this._followSprite = followTarget
        // When creating a new enemy boat, pick a random side to spawn on
        this.enemySprite = sprites.create(assets.image`Enemy Ship Left`)
        this.enemySprite.z = 50
        this._nextShotTime = game.runtime() + firstShot ? firstShot : Utils.random(3000, 5000)
        // Spawn the sprite off screen
        const spawnSide = Utils.random(1, 2)
        switch (spawnSide) {
            case 0:
                // Top (not used today...)
                this.enemySprite.setPosition(
                        Utils.random(0, 160) +
                        (this._followSprite.x - 80),
                    this._followSprite.y - 60
                )
                break
            case 1:
                // Left
                this.enemySprite.image.flipX()
                this.enemySprite.setPosition(
                    this._followSprite.x - 80,
                        Utils.random(0, 70) +
                        (this._followSprite.y - 60)
                )
                break
            case 2:
                // Right
                this.enemySprite.setPosition(
                    this._followSprite.x + 80,
                        Utils.random(0, 70) +
                        (this._followSprite.y - 60)
                )
                break
        }

        this.enemySprite.follow(this._followSprite, 5)
    }

    public onUpdate() {
        if (!this.enemySprite) return
        
        if (
            Utils.getDistanceBetweenSprites({
                spriteA: this.enemySprite,
                spriteB: this._followSprite
            }) < 30
        ) {
            // Stop following (at least stop moving closer)
            this.enemySprite.follow(this._followSprite, 0)
        } else {
            this.enemySprite.follow(this._followSprite, 5)
        }

        // And shoot!
        if (!this._arrow && this._nextShotTime < game.runtime()) {
            this._nextShotTime = game.runtime() + Utils.random(2000, 4000)
            this._arrow = sprites.create(assets.image`arrowLeft`, SpriteKind.EnemyArrow)
            this._arrow.onDestroyed(() => this._arrow = null)
            
            if (this.enemySprite.x < this._followSprite.x) {
                this._arrow.image.flipX()
            }
            
            this._arrow.setPosition(this.enemySprite.x, this.enemySprite.y)
            this._arrow.setFlag(SpriteFlag.AutoDestroy, true)
            this._arrow.follow(this._followSprite, 100)
        }
    }

    public destroy() {
        if (this.enemySprite) {
            sprites.destroy(this.enemySprite)
            this.enemySprite = null
        }

        if (this._arrow) {
            sprites.destroy(this._arrow)
            this._arrow = null
        }
    }

    public hit({ damage }: { damage: number }) {
        this._health -= damage
        if (this._health <= 0) {
            this.enemySprite.startEffect(effects.fire, 500)
            setTimeout(() => {
                this.destroy()
            }, 400)
        }
    }
}
