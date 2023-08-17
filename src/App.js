import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import Lobby from "~/pages/Lobby"
import Game from "~/pages/Game"
import ConnectionLost from "~/pages/ConnectionLost"
import Join from "~/pages/Join"

import "~/css/container.css"

export default function App() {
    
    const [socket, setSocket] = React.useState(null)
    const [sessionData, setSessionData] = React.useState({ queue: false, gameId: null, publicPlayerCount: "?" })
    const [connectionData, setConnectionData] = React.useState({ status: false, reconnecting: true, count: 0 })

    React.useEffect(() => {
        const host = process.env.REACT_APP_ENVIRONMENT === "local" ? "localhost:8080" : "ws.titilapierre.tech"
        const protocol = process.env.REACT_APP_ENVIRONMENT === "local" ? "ws://" : "wss://"
        const newSocket = new WebSocket(`${protocol}${host}`)

        let interval = null

        const eventOpen = () => {
            console.info("Websocket connection established!")
            setConnectionData(old => {
                return { ...old, status: true, reconnecting: false }
            })
            interval = setInterval(() => {
                newSocket.send(JSON.stringify({ type: "ping" }))
            }, 10000)
        }
        const eventClose = () => {
            console.info("Websocket connection closed!")
            setSessionData(old => {
                return { ...old, queue: false, gameId: null }
            })
            setConnectionData(old => {
                return { ...old, status: false, reconnecting: false }
            })
            if (interval) clearInterval(interval)
        }
        const eventMessage = async function(e) {
            const data = await JSON.parse(e.data)
            if (data.type === "public_player_count") {
                setSessionData(old => {
                    return { ...old, publicPlayerCount: data.count }
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
    // eslint-disable-next-line
    }, [connectionData.count])

    if (!socket)
        return <div className="blur"><h1>Connexion aux services</h1></div>

    const components = []

    if (connectionData.reconnecting)
        components.push(<div className="blur"><h1>Connexion aux services</h1></div>)
    
    if (!connectionData.status && !connectionData.reconnecting) {
        document.title = "Morpion • Connexion perdue"
        components.push(<ConnectionLost socket={socket} setConnectionData={setConnectionData} key="content" />)
    } else if (!sessionData.gameId) {
        document.title = "Morpion • File d'attente"
        components.push(<Lobby socket={socket} sessionData={sessionData} setSessionData={setSessionData} key="content" />)
    } else {
        document.title = "Morpion • Partie en cours"
        components.push(<Game socket={socket} sessionData={sessionData} setSessionData={setSessionData} key="content" />)
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: components,
        },
        {
            path: "/:gameId",
            element: <Join setSessionData={setSessionData} />,
        },
        {
            path: "*",
            element: <Navigate to="/" replace />,
        }
    ]);

    return (
        <RouterProvider router={router} />
    )
}