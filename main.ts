namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
function onFinishOcean (win: boolean) {
    ocean.destroy()
game.gameOver(win)
}
let activeEnemy = null
const ocean = new Ocean({ onComplete: onFinishOcean })
music.play(music.createSong(assets.song`Boat 0`), music.PlaybackMode.LoopingInBackground)
// let mySprite = sprites.create(assets.image`enemyBoat`, SpriteKind.Player)
// mySprite.setVelocity(50, 50)
game.onUpdate(function () {
    ocean.onUpdate()
})
