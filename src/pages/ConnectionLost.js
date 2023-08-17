import React from "react"

import Button from "~/components/Button"
import { getButton } from "~/data/ConnectionLost"

import img_logo from "~/medias/logo.png"

export default function ConnectionLost({ setSessionData }) {

    const buttonData = getButton(setSessionData)
    
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