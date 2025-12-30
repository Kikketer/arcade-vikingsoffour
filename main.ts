namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
    export const Wave = SpriteKind.create()
}
function onFinishOcean (win: boolean) {
    ocean.destroy()
ocean = null
if (!(win)) {
        changeScene('gameOver')
    } else {
        changeScene('victory')
    }
}
function onFinishGameOver () {
    game.reset()
}
function onFinishTitle () {
    title.destroy()
changeScene('game')
title = null
}
let victory: Victory = null
let gameOver: GameOver = null
let title: Title = null
let ocean: Ocean = null
let _scenePage = "title"
let showTutorial = true
function changeScene(scenePage: 'title' | 'game' | 'gameOver' | 'victory') {
    _scenePage = scenePage
    switch (scenePage) {
        case 'title':
            title = new Title({ onComplete: onFinishTitle })
            break
        case 'game':
            ocean = new Ocean({ onComplete: onFinishOcean, showTutorial })
            break
        case 'gameOver':
            gameOver = new GameOver({ onComplete: onFinishGameOver })
            break
        case 'victory':
            victory = new Victory({ onComplete: onFinishGameOver })
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
    } else if (_scenePage == "gameOver" && gameOver) {
        gameOver.onUpdate()
    } else if (_scenePage == "victory" && victory) {
        victory.onUpdate()
    }
})
