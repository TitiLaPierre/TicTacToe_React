import React from "react"

export default function Lobby(props) {

  React.useEffect(() => {
    if (!props.socket)
      return
    const eventMessage = async function(e) {
      const data = await JSON.parse(e.data)
      if (data.type === "sync") {
        props.setSessionData(old => {
          return { ...old, queue: false, gameId: data.state.gameId }
        })
      }
    }
    props.socket.addEventListener("message", eventMessage)
    return () => {
      props.socket.removeEventListener("message", eventMessage)
    }
  }, [props])

  function queueHandle() {
    if (!props.socket)
      return
    props.socket.send(JSON.stringify({ type: props.sessionData.queue ? "leave_queue" : "join_queue" }))
    props.setSessionData(old => {
      return { ...old, queue: !old.queue }
    })
  }

  return (
    <div className="content">
      <header className="header">
        <h1 className="header--title">
          Morpion multijoueur
          <span className="header--sub">{props.sessionData.onlineCount} en ligne</span>
        </h1>
        <p className="header--description">
          Alignez 3 cases pour gagner !
        </p>
        <button className={`header--button ${props.sessionData.queue ? "button__red" : "button__blue"}`} onClick={queueHandle}>
          {props.sessionData.queue ? "Annuler la recherche" : "Rechercher une partie"}
        </button>
      </header>
    </div>
  )
}