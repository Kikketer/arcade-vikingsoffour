namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
let scenePage: string = 'game'
let ocean: Ocean = null
let menu: Tutorial = null
let showTutorial: boolean = true

function onFinishOcean (win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
    game.gameOver(win)
}

function onFinishTutorial() {
    menu.destroy()
    scenePage = 'game'
}

game.onUpdate(function () {
    if (scenePage === 'game' && ocean) {
        ocean.onUpdate()
    } else if (scenePage === 'menu' && menu) {
        menu.onUpdate()
    }
})

switch (scenePage) {
    case 'menu':
        menu = new Tutorial({ onComplete: onFinishTutorial })
        break;
    case 'game':
        ocean = new Ocean({ onComplete: onFinishOcean, showTutorial })
        break;
    default:
        break
}
