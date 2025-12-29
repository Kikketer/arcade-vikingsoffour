namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
function onFinishOcean (win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
game.gameOver(win)
    ocean = null
}
function onFinishTitle () {
    title.destroy()
changeScene('game')
title = null
}
let title: Title = null
let ocean: Ocean = null
let _scenePage = "title"
let showTutorial = true
function changeScene(scenePage: 'title' | 'game') {
    _scenePage = scenePage
    switch (scenePage) {
        case 'title':
            title = new Title({ onComplete: onFinishTitle })
            break
        case 'game':
            ocean = new Ocean({ onComplete: onFinishOcean, showTutorial })
            break
        default:
            break
    }
}
changeScene('title')
game.onUpdate(function () {
    if (_scenePage == "game" && ocean) {
        ocean.onUpdate()
    } else if (_scenePage == "title" && title) {
        title.onUpdate()
    }
})
