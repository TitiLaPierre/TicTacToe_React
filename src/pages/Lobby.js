import React from "react"

import Button from "~/components/Button"

import img_logo from "~/medias/logo.png"
import img_chevron from "~/medias/chevron.svg"
import img_copy from "~/medias/copy.svg"
import img_check from "~/medias/check.svg"
import img_stop from "~/medias/stop.svg"

export default function Lobby(props) {

    const [queueId, setQueueId] = React.useState(null)
    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        if (!props.socket)
            return
        const eventMessage = async function(e) {
            const data = await JSON.parse(e.data)
            if (data.type === "game_start") {
                props.setSessionData(old => {
                    return { ...old, queue: false, gameId: data.gameId }
                })
            } else if (data.type === "queue") {
                if (data.success) {
                    setQueueId(data.gameId)
                } else {
                    props.setSessionData(old => {
                        return { ...old, queue: false }
                    })
                }
            }
        }
        const eventOpen = function() {
            if (props.sessionData.privateGameId) {
                props.socket.send(JSON.stringify({ type: "join_queue", gameId: props.sessionData.privateGameId }))
                props.setSessionData(old => {
                    const newSessionData = { ...old, queue: "private" }
                    delete newSessionData.privateGameId
                    return newSessionData
                })
            }
        }
        props.socket.addEventListener("message", eventMessage)
        props.socket.addEventListener("open", eventOpen)
        return () => {
            props.socket.removeEventListener("message", eventMessage)
            props.socket.removeEventListener("open", eventOpen)
        }
    }, [props])

    function queueHandle(privacy) {
        if (!props.socket)
            return
        setQueueId(null)
        props.socket.send(JSON.stringify({ type: props.sessionData.queue ? "leave_queue" : "join_queue", queue: privacy }))
        props.setSessionData(old => {
            return { ...old, queue: old.queue ? false : privacy }
        })
    }

    const buttonsData = {
        // 
        //  Public Button 
        //
        public: {
            handlers: {
                onClick: () => queueHandle("public")
            },
            disabled: props.sessionData.queue && props.sessionData.queue !== "public",
            decoration: {
                color: "var(--green)",
                style: props.sessionData.queue === "public" ? "button__load" : "button__circle",
            },
            context: {
                title: "Partie publique",
                note: `(${props.sessionData.publicPlayerCount} joueur${props.sessionData.publicPlayerCount > 1 ? "s" : ""})`,
                description: props.sessionData.queue === "public" ? "En attente d'un adversaire..." : "Rejoindre une partie aléatoire"
            },
            action: {
                color: props.sessionData.queue === "public" ? "var(--blue)" : "var(--dark)",
                icon: props.sessionData.queue === "public" ? img_stop : img_chevron
            }
        // 
        //  Private Button
        //
        }, private: {
            handlers: {
                onClick: () => queueHandle("private")
            },
            disabled: props.sessionData.queue && props.sessionData.queue !== "private",
            decoration: {
                color: "var(--red)",
                style: props.sessionData.queue === "private" ? "button__load" : "button__circle",
            },
            context: {
                title: "Partie privée",
                description: props.sessionData.queue === "private" ? "En attente d'un adversaire..." : "Créer une partie et inviter un ami"
            },
            action: {
                color: props.sessionData.queue === "private" ? "var(--blue)" : "var(--dark)",
                icon: props.sessionData.queue === "private" ? img_stop : img_chevron
            }
        //
        //  Copy Button
        //
        }, copy: {
            handlers: {
                onClick: () => {
                    navigator.clipboard.writeText(`${window.location.origin}/${queueId}`)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                }
            },
            disabled: !queueId,
            context: {
                title: "Inviter un ami",
                description: copied ? "Lien copié !" : "Copier le lien d'invitation",
            },
            action: {
                color: queueId ? copied ? "var(--green)" : "var(--blue)" : "var(--dark)",
                icon: copied ? img_check : img_copy
            },
        }
    }

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