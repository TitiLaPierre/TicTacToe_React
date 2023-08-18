import React from "react"

import Button from "~/components/Button"
import { getButtons } from "~/data/Lobby"

import img_logo from "~/medias/logo.png"

export default function Lobby({ sessionData, setSessionData }) {

    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        if (!sessionData.linkId)
            return
        sessionData.queueManager.joinQueue("private", sessionData.linkId)
        setSessionData(old => {
            const newSessionData = { ...old }
            delete newSessionData.linkId
            return newSessionData
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData.linkId])

    const buttonsData = getButtons(sessionData, copied, setCopied)

    return (
        <header className="container">
            <img className="logo" src={img_logo} alt="Logo" />
            <div className="title">
                <h1>Morpion</h1>
                <span className="subtitle">Par TitiLaPierre</span>
            </div>
            <div className="list">
                {buttonsData.map((button, index) => <Button key={index} {...button} />)}
            </div>
        </header>
    )
}