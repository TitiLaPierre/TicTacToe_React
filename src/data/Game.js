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
    const playerNames = {
        [gameState.playerId]: "toi",
        [opponentId]: "ton adversaire"
    }

    let content, color
    if (gameState.status === "playing") {
        content = `C'est à **${playerNames[gameState.currentPlayer]}** de jouer !`
        color = playerColors[gameState.currentPlayer]
    } else if (gameState.results.reason === "draw") {
        content = "Aucun joueur ne remporte la partie !"
    } else if (gameState.results.reason === "win") {
        content = `C'est **${playerNames[gameState.results.winner]}** qui remporte la partie !`
        color = playerColors[gameState.results.winner]
    } else {
        content = "Ton **adversaire** a quitté la partie !"
        color = playerColors[opponentId]
    }

    return <p className="note">
        {content.split("**").map((text, i) => {
            if (i % 2 === 0)
                return text
            return <span key={i} style={{ color }}>{text}</span>
        })}
    </p> 
}