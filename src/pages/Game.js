import React from "react"

import Slot from "~/components/Slot"

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

  const playerColors = {
    [gameState.playerId]: colors[0],
    [gameState.playerId === 0 ? 1 : 0]: colors[1]
  }

  const tag = gameState.currentPlayer === gameState.playerId ? "toi" : "ton adversaire"
  let winTag
  if (!gameState.status) {
    winTag = <>Chargement de la partie...</>
  } else if (gameState.status === "playing") {
    winTag = <>C'est à <span style={{ color: playerColors[gameState.currentPlayer] }}>{tag}</span> de jouer !</>
  } else {
    if (gameState.results.reason === "draw") {
      winTag = <>Aucun joueur ne remporte la partie !</>
    } else if (gameState.results.reason === "win") {
      winTag = <>Le gagnant est <span style={{ color: playerColors[gameState.results.winner] }}>{gameState.results.winner === gameState.playerId ? "toi" : "ton adversaire"}</span> !</>
    } else {
      winTag = <>Ton <span style={{ color: colors[1] }}>adversaire</span> a quitté la partie !</>
    }
  }
    

  return (
    <div className="content">
      <header className="header">
        <div className="header--title">
          <h1>Morpion</h1>
          <span className="header--subtitle">Partie {gameState.privacy === "public" ? "Publique" : "Privée"}</span>
        </div>
        <p className="header--action">
          {winTag}
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