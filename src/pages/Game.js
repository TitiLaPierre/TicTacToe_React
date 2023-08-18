import React from "react"

import Slot from "~/components/Slot"
import Button from "~/components/Button"
import Notes from "~/components/Notes"
import { getButtons, getGameNote, getTimeLeft, getTimer } from "~/data/Game"

export default function Game({ socket, sessionData, setSessionData }) {

    const gameState = sessionData.gameState
    const [timeLeft, setTimeLeft] = React.useState(getTimeLeft(gameState))

    React.useEffect(() => {
        if (gameState.status === "playing") {
            const updateTimerInterval = setInterval(() => {
                setTimeLeft(getTimeLeft(gameState));
            }, timeLeft % 1000);

            return () => {
                clearInterval(updateTimerInterval);
            };
        }
    }, [timeLeft])

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

    const buttonsData = getButtons(sessionData, setSessionData)

    return (
        <>
        <header className="container">
            <div className="title">
                <h1>Morpion</h1>
                <span className="subtitle">Partie {gameState.privacy === "public" ? "Publique" : "Privée"}</span>
            </div>
            {
                gameState.status === "playing" ?
                <Notes
                    notes={[
                        getGameNote(gameState),
                        {
                            content: `**${getTimer(gameState)}**`,
                            color: "var(--white)"
                        }]}
                /> :
                <Notes notes={[getGameNote(gameState)]} />
            }
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
                <div className="list">
                    {buttonsData.map((button, index) => <Button key={index} {...button} />)}
                </div>
            </div>
        }
        </>
    )
}