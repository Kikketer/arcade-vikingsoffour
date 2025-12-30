namespace SpriteKind {
    export const EnemyArrow = SpriteKind.create()
}
function onFinishGameOver() {
    game.reset()
}

function onFinishOcean(win: boolean) {
    music.stopAllSounds()
    ocean.destroy()
    ocean = null

    if (!win) {
        changeScene('gameOver')
    } else {
        console.log('You WIN!')
    }
}
function onFinishTitle() {
    title.destroy()
    changeScene('game')
    title = null
}
let ocean: Ocean = null
let title: Title = null
let gameOver: GameOver = null
let _scenePage = 'title'
let showTutorial = true
function changeScene(scenePage: 'title' | 'game' | 'gameOver') {
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
        default:
            break
    }
}
changeScene('title')
game.onUpdate(function () {
    if (_scenePage == 'game' && ocean) {
        ocean.onUpdate()
    } else if (_scenePage == 'title' && title) {
        title.onUpdate()
    } else if (_scenePage == 'gameOver' && gameOver) {
        gameOver.onUpdate()
    }
})
