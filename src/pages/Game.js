import React from "react"

import Slot from "~/components/Slot"
import Button from "~/components/Button"
import Note from "~/components/Note"
import { getButton, getGameNote, getTimer } from "~/data/Game"

export default function Game({ socket, sessionData, setSessionData }) {

    const gameState = sessionData.gameState
    const [timer, setTimer] = React.useState([getTimer(gameState), gameState.lastUpdate])

    React.useEffect(() => {
        if (gameState.status === "playing")
            setTimeout(() => {
                setTimer(() => {
                    return [getTimer(gameState), gameState.lastUpdate]    
                })
            }, 100)
    })

    const colors = ["var(--blue)", "var(--red)"]
    const opponentId = gameState.playerId === 0 ? 1 : 0
    const playerColors = {
        [gameState.playerId]: colors[0],
        [opponentId]: colors[1]
    }

    function handleClick(i) {
        if (gameState.currentPlayer !== gameState.playerId)
            return
        if (gameState.grid[i] !== null)
            return
        if (gameState.status !== "playing")
            return
        socket.send(JSON.stringify({ type: "play", slot: i }))
    }

    const buttonData = getButton(setSessionData)
    const winTag = getGameNote(gameState)

    return (
        <>
        <header className="container">
            <div className="title">
                <h1>Morpion</h1>
                <span className="subtitle">Partie {gameState.privacy === "public" ? "Publique" : "Privée"}</span>
            </div>
            {
                gameState.status === "playing" &&
                <Note
                    color={
                        gameState.currentPlayer === gameState.playerId &&
                        timer[0] <= 15 &&
                        timer[0] % 2 === 0 ?
                        "var(--red)" : "var(--white)"
                    }
                >
                    {`Temps restant : **${timer[0]}**`}
                </Note>
            }
            {winTag}
        </header>
        <div className="grid">
            {gameState.grid.map((player, i) => {
                return <Slot
                    key={i}
                    color={playerColors[player]}
                    disabled={player !== null || gameState.currentPlayer !== gameState.playerId}
                    handlers={{ onClick: () => handleClick(i) }}
                />
            })}
        </div>
        {
            gameState.status === "finished" &&
            <div className="container">
                <Button {...buttonData} />
            </div>
        }
        </>
    )
}