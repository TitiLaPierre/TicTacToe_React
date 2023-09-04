import React from "react"
import { Navigate, Routes, Route } from 'react-router-dom'

import Lobby from "~/pages/Lobby"
import Game from "~/pages/Game"
import ConnectionLost from "~/pages/ConnectionLost"
import Join from "~/pages/Join"

import QueueManager from "./data/QueueManager"

import "~/css/container.css"

export default function App() {
    
    const [socket, setSocket] = React.useState(null)
    const [sessionData, setSessionData] = React.useState({
        publicPlayerCount: "?",
        connection: {
            status: false,
            reconnecting: false,
            retries: 0
        }
    })

    let socketPingInterval
    const socketOnOpen = (e) => {
        console.info("Websocket connection established!")
        setSessionData(old => {
            return { ...old, connection: { ...old.connection, status: true, reconnecting: false }, queueManager: new QueueManager(e.target) }
        })
        socketPingInterval = setInterval(() => {
            e.target.send(JSON.stringify({ type: "ping" }))
        }, 10000)
    }
    const socketOnClose = () => {
        console.info("Websocket connection closed!")
        setSessionData(old => {
            return { ...old, gameState: null, connection: { ...old.connection, status: false, reconnecting: false } }
        })
        if (socketPingInterval) clearInterval(socketPingInterval)
    }
    const socketOnMessage = async function(e) {
        const data = await JSON.parse(e.data)
        if (data.type === "public_player_count") {
            setSessionData(old => {
                return { ...old, publicPlayerCount: data.count }
            })
        } else if (data.type === "sync") {
            setSessionData(old => {
                return { ...old, gameState: data.state }
            })
        }
    }

    React.useEffect(() => {
        const socketUrl = process.env.NODE_ENV === "development" ? "ws://localhost:8080" : "wss://tictactoe.titilapierre.fr/services"
        const newSocket = new WebSocket(socketUrl)

        newSocket.addEventListener("open", socketOnOpen)
        newSocket.addEventListener("close", socketOnClose)
        newSocket.addEventListener("message", socketOnMessage)

        setSocket(newSocket)

        return () => { 
            newSocket.removeEventListener("open", socketOnOpen)
            newSocket.removeEventListener("close", socketOnClose)
            newSocket.removeEventListener("message", socketOnMessage)
            newSocket.close()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData.connection.retries])

    if (!socket)
        return <div className="blur"><h1>Connexion aux services</h1></div>

    let page
    if (!sessionData.connection.status && !sessionData.connection.reconnecting)
        page = { title: "Morpion • Connexion perdue", Element: ConnectionLost }
    else if (!sessionData.gameState || sessionData.gameState.status === "queue")
        page = { title: "Morpion • File d'attente", Element: Lobby }
    else
        page = { title: "Morpion • Partie en cours", Element: Game }
    document.title = page.title

    return (
        <Routes>
            <Route path="/" element={
                <>
                    {sessionData.connection.reconnecting && <div className="blur"><h1>Connexion aux services</h1></div>}
                    <page.Element socket={socket} sessionData={sessionData} setSessionData={setSessionData} key="content" />
                </>
            } />
            <Route path="/:gameId" element={<Join setSessionData={setSessionData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}