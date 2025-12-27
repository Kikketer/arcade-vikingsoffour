class EnemyBoat {
    public enemySprite: Sprite = null
    private _followSprite: Sprite = null
    private _health: number = 3

    constructor({ followTarget }: { followTarget: Sprite }) {
        this._followSprite = followTarget
        // When creating a new enemy boat, pick a random side to spawn on
        this.enemySprite = sprites.create(assets.image`enemyBoat`)
        this.enemySprite.z = 50
        // Spawn the sprite off screen
        const spawnSide = Math.floor(Math.random() * 3)
        switch (spawnSide) {
            case 0:
                // Top
                this.enemySprite.setPosition(
                    Math.floor(Math.random() * 160) +
                        (this._followSprite.x - 80),
                    this._followSprite.y - 60
                )
                break
            case 1:
                // Left
                this.enemySprite.setPosition(
                    this._followSprite.x - 80,
                    Math.floor(Math.random() * 120) +
                        (this._followSprite.y - 60)
                )
                break
            case 2:
                // Right
                this.enemySprite.setPosition(
                    this._followSprite.x + 80,
                    Math.floor(Math.random() * 120) +
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
    }

    public destroy() {
        sprites.destroy(this.enemySprite)
        this.enemySprite = null
    }

    public hit({ damage }: { damage: number }) {
        console.logValue('HIT!', this._health)
        this._health -= damage
        if (this._health <= 0) {
            this.enemySprite.startEffect(effects.fire, 500)
            setTimeout(() => {
                this.destroy()
            }, 400)
        }
    }
}
