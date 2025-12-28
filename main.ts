namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
const scenePage: string = 'tutorial'
let ocean: Ocean = null
let tutorial: Tutorial = null
function onFinishOcean (win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
game.gameOver(win)
}

game.onUpdate(function () {
    ocean.onUpdate()
})

switch (scenePage) {
    case 'tutorial':
        tutorial = new Tutorial()
        break;
    case 'game':
        ocean = new Ocean({ onComplete: onFinishOcean })
        break;
    default:
        break
}
