import React from "react"

import Lobby from "./pages/Lobby"
import Game from "./pages/Game"
import ConnectionLost from "./pages/ConnectionLost"

import Blur from "./components/Blur"

export default function App() {
  
  const [socket, setSocket] = React.useState(null)
  const [sessionData, setSessionData] = React.useState({ queue: false, gameId: null, onlineCount: null })
  const [connectionData, setConnectionData] = React.useState({ status: false, reconnecting: true, count: 0 })

  React.useEffect(() => {
    const host = process.env.REACT_APP_ENVIRONMENT === "local" ? "localhost:8080" : "ws.titilapierre.tech"
    const protocol = process.env.REACT_APP_ENVIRONMENT === "local" ? "ws://" : "wss://"
    const newSocket = new WebSocket(`${protocol}${host}`)

    const eventOpen = () => {
      console.info("Websocket connection established!")
      setConnectionData(old => {
        return { ...old, status: true, reconnecting: false }
      })
    }
    const eventClose = () => {
      console.info("Websocket connection closed!")
      setSessionData(old => {
        return { ...old, queue: false, gameId: null }
      })
      setConnectionData(old => {
        return { ...old, status: false, reconnecting: false }
      })
    }
    const eventMessage = async function(e) {
      const data = await JSON.parse(e.data)
      if (data.type === "online_count_update") {
        setSessionData(old => {
          return { ...old, onlineCount: data.count }
        })
      }
    }

    newSocket.addEventListener("open", eventOpen)
    newSocket.addEventListener("close", eventClose)
    newSocket.addEventListener("message", eventMessage)

    setSocket(newSocket)

    return () => { 
      newSocket.removeEventListener("open", eventOpen)
      newSocket.removeEventListener("close", eventClose)
      newSocket.removeEventListener("message", eventMessage)
      newSocket.close()
    }
  }, [connectionData.count])

  if (!socket)
    return <Blur />

  const components = []

  if (connectionData.reconnecting)
    components.push(<Blur key="blur" />)
  
  if (!connectionData.status && !connectionData.reconnecting) {
    document.title = "Connexion perdue"
    components.push(<ConnectionLost socket={socket} setConnectionData={setConnectionData} key="content" />)
  } else if (!sessionData.gameId) {
    document.title = "Morpion | File d'attente"
    components.push(<Lobby socket={socket} sessionData={sessionData} setSessionData={setSessionData} key="content" />)
  } else {
    document.title = "Morpion | Partie en cours"
    components.push(<Game socket={socket} sessionData={sessionData} setSessionData={setSessionData} key="content" />)
  }

  return <>
    {components}
  </>
}