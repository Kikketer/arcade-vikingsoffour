const ocean = new Ocean()
music.play(music.createSong(assets.song`Boat 1`), music.PlaybackMode.LoopingInBackground)
// let mySprite = sprites.create(assets.image`enemyBoat`, SpriteKind.Player)
// mySprite.setVelocity(50, 50)
game.onUpdate(function () {
    ocean.onUpdate()
})
