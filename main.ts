const ocean = new Ocean()
// let mySprite = sprites.create(assets.image`enemyBoat`, SpriteKind.Player)
// mySprite.setVelocity(50, 50)
game.onUpdate(function () {
    ocean.onUpdate()
})
