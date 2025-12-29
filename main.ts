namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
function onFinishTutorial() {
    menu.destroy()
    scenePage = 'game'
}
function onFinishOcean(win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
    game.gameOver(win)
}
let ocean: Ocean = null
let menu: Title = null
let scenePage = ''
scenePage = 'menu'
let showTutorial = true
switch (scenePage) {
    case 'menu':
        menu = new Title({ onComplete: onFinishTutorial })
        break
    case 'game':
        ocean = new Ocean({ onComplete: onFinishOcean, showTutorial })
        break
    default:
        break
}
game.onUpdate(function () {
    if (scenePage == 'game' && ocean) {
        ocean.onUpdate()
    } else if (scenePage == 'menu' && menu) {
        menu.onUpdate()
    }
})
