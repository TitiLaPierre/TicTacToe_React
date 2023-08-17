import React from "react"

import Button from "~/components/Button"

import img_logo from "~/medias/logo.png"
import img_check from "~/medias/check.svg"

export default function ConnectionLost(props) {

    const buttonData = {
        handlers: {
            onClick: () => props.setConnectionData(old => { return { ...old, count: old.count+1, reconnecting: true } })
        },
        context: {
            title: "Se reconnecter",
            description: "Essayer de se reconnecter au serveur"
        },
        action: {
            color: "var(--red)",
            icon: img_check
        }
    }
    
    return (
        <header className="container">
            <img className="logo" src={img_logo} alt="Logo" />
            <h1 className="title">Connexion perdue</h1>
            <p className="description">
                Nous n'arrivons plus à contacter le serveur. Le problème vient peut-être de votre connexion internet.
            </p>
            <Button {...buttonData} />
        </header>
    )
}