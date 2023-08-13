import React from "react"

import Slot from "./components/Slot"

const colors = ["var(--blue)", "var(--red)"]

export default function Game(props) {

  const [gameState, setGameState] = React.useState({ grid: Array(9).fill(null) })

  React.useEffect(() => {
    if (!props.socket)
      return
    props.socket.send(JSON.stringify({ type: "re_sync" }))
    const eventMessage = async function(e) {
      const data = await JSON.parse(e.data)
      if (data.type === "sync") {
        setGameState(data.state)
      }
    }  
    props.socket.addEventListener("message", eventMessage)
    return () => {
      props.socket.removeEventListener("message", eventMessage)
    }
  }, [props])

  function handleClick(i) {
    if (!props.socket)
      return
    if (gameState.currentPlayer !== gameState.playerId)
      return
    if (gameState.grid[i] !== null)
      return
    if (gameState.status !== "playing")
      return
    props.socket.send(JSON.stringify({ type: "play", slot: i }))
  }

  const tag = gameState.currentPlayer === gameState.playerId ? "toi" : "ton adversaire"
  const winTag = gameState.currentPlayer === gameState.playerId ? "toi" : "ton adversaire"
  const playerColors = {
    [gameState.playerId]: colors[0],
    [gameState.playerId === 0 ? 1 : 0]: colors[1]
  }

  return (
    <div className="content">
      <header className="header">
        <h1 className="header--title">
          {
            gameState.status === "finished" ?
              "Partie terminée" :
              "Morpion multijoueur"
          }
        </h1>
        <p className="header--description">
          {
            gameState.status === "finished" ?
              (gameState.winner === null ?
              <>Match nul !</> :
              <>La gagnant est <span style={{ color: playerColors[gameState.winner] }}>{winTag}</span>.</>) :
            <>C'est <span style={{ color: playerColors[gameState.currentPlayer] }}>{tag}</span> qui joue.</>
          }
        </p>
      </header>
      <div className="grid">
        {gameState.grid.map((player, i) => <Slot handleClick={() => handleClick(i)} color={playerColors[player]} key={i} />)}
      </div>
      {
        gameState.status === "finished" &&
        <button className="header--button button__blue" onClick={() => props.setSessionData(old => { return { ...old, gameId: null } })}>Quitter la partie</button>
      }
    </div>
  )
}