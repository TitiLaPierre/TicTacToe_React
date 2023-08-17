import Note from "~/components/Note"

import img_chevron from "~/medias/chevron.svg"

export function getButton(setSessionData) {
    return {
        handlers: {
            onClick: () => setSessionData(old => { return { ...old, gameState: null } })
        },
        context: {
            title: "Quitter la partie",
            description: "Pour rejoindre une autre partie"
        },
        action: {
            color: "var(--blue)",
            icon: img_chevron
        }
    }
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

    return <Note color={color}>{content}</Note>
}

export function getTimer(gameState) {
    const seconds = gameState.grid.filter(slot => slot !== null).length === 0 ? 120 : 30
    const time = Date.now() - gameState.lastUpdate
    const secondsLeft = Math.max(0, seconds - Math.floor(time / 1000))
    return `${secondsLeft < 10 ? "0" : ""}${secondsLeft}`
}