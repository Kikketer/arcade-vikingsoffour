namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
function onFinishOcean (win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
    game.gameOver(win)
}
let activeEnemy = null
const ocean = new Ocean({ onComplete: onFinishOcean })
music.play(music.createSong(assets.song`Boat 0`), music.PlaybackMode.LoopingInBackground)

game.onUpdate(function () {
    ocean.onUpdate()
})
