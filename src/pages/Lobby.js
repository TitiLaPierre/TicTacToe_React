import React from "react"

import Button from "~/components/Button"
import { getButtons } from "~/data/Lobby"

import img_logo from "~/medias/logo.png"

export default function Lobby({ socket, sessionData, setSessionData }) {

    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        if (!sessionData.linkId)
            return
        socket.send(JSON.stringify({ type: "join_queue", gameId: sessionData.linkId }))
        setSessionData(old => {
            const newSessionData = { ...old }
            delete newSessionData.linkId
            return newSessionData
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData.linkId])

    function queueHandle(privacy) {
        const data = { type: sessionData.gameState ? "leave_queue" : "join_queue" }
        if (!sessionData.gameState) data.queue = privacy
        socket.send(JSON.stringify(data))
    }

    const buttonsData = getButtons(sessionData, queueHandle, copied, setCopied)

    return (
        <header className="container">
            <img className="logo" src={img_logo} alt="Logo" />
            <div className="title">
                <h1>Morpion</h1>
                <span className="subtitle">Par TitiLaPierre</span>
            </div>
            <div className="list">
                <Button {...buttonsData.public} />
                <Button {...buttonsData.private} />
                <Button {...buttonsData.copy} />
            </div>
        </header>
    )
}