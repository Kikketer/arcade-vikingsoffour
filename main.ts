namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
let scenePage: string = 'tutorial'
let ocean: Ocean = null
let tutorial: Tutorial = null

function onFinishOcean (win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
    game.gameOver(win)
}

function onFinishTutorial() {
    tutorial.destroy()
    scenePage = 'game'
}

game.onUpdate(function () {
    if (scenePage === 'game' && ocean) {
        ocean.onUpdate()
    } else if (scenePage === 'tutorial' && tutorial) {
        tutorial.onUpdate()
    }
})

switch (scenePage) {
    case 'tutorial':
        tutorial = new Tutorial({ onComplete: onFinishTutorial })
        break;
    case 'game':
        ocean = new Ocean({ onComplete: onFinishOcean })
        break;
    default:
        break
}
