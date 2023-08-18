import img_chevron from "~/medias/chevron.svg"

export function getButtons(sessionData, setSessionData) {
    const buttons = []

    if (sessionData.gameState.privacy === "public") {
        //
        // Rejoin public queue
        //
        buttons.push({
            handlers: {
                onClick: () => {
                    sessionData.queueManager.joinQueue("public")
                    setSessionData(old => { return { ...old, gameState: null } })
                }
            },
            context: {
                title: "Rejouer une partie",
                description: "Rejoindre une partie aléatoire"
            },
            action: {
                color: "var(--blue)",
                icon: img_chevron
            }
        })
    }

    //
    // Leave
    //
    buttons.push({
        handlers: {
            onClick: () => setSessionData(old => { return { ...old, gameState: null } })
        },
        context: {
            title: "Quitter la partie",
            description: "Retourner au menu principal"
        },
        action: {
            color: "var(--red)",
            icon: img_chevron
        }
    })
    return buttons
}

export function getGameNote(gameState) {

    const colors = ["var(--blue)", "var(--red)"]
    const opponentId = gameState.playerId === 0 ? 1 : 0
    const playerColors = {
        [gameState.playerId]: colors[0],
        [opponentId]: colors[1]
    }

    let content, color
    if (gameState.status === "playing") {
        color = playerColors[gameState.currentPlayer]
        if (gameState.currentPlayer === gameState.playerId)
            content = `C'est à **ton tour** de jouer !`
        else
            content = `C'est à **ton adversaire** de jouer !`
    } else {
        color = playerColors[gameState.results.winner]
        if (gameState.results.reason === "draw") {
            content = "Aucun joueur ne remporte la partie !"
        } else if (gameState.results.reason === "win") {
            if (gameState.results.winner === gameState.playerId)
                content = `Félicitation, **tu** remportes la partie !`
            else
                content = `Dommage, **ton adversaire** remporte la partie !`
        } else if (gameState.results.reason === "time") {
            if (gameState.results.winner === gameState.playerId)
                content = `Temps écoulé ! **Tu** remportes la partie !`
            else
                content = `Temps écoulé ! **Ton adversaire** remporte la partie !`
        } else {
            if (gameState.results.winner === gameState.playerId)
                content = "Ton **adversaire** a quitté la partie !"
            else
                content = "**Tu** as quitté la partie !"
        }
    }
    return { content, color }
}

function timeDigits(time, digits=2) {
    let str = time.toString()
    while (str.length < digits)
        str = "0" + str
    return str
}

export function getTimeLeft(gameState) {
    const initialTime = gameState.grid.filter(slot => slot !== null).length === 0 ? 120_000 : 30_000
    return gameState.lastUpdate + initialTime - Date.now()
}

export function getTimer(gameState) {
    let secondsLeft = Math.floor(getTimeLeft(gameState) / 1000)
    const minutesLeft = Math.floor(secondsLeft / 60)
    secondsLeft -= minutesLeft*60
    if (secondsLeft < 0) return "00:00"
    return `${timeDigits(minutesLeft)}:${timeDigits(secondsLeft)}`
}