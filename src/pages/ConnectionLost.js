import React from "react"

import img_logo from "~/medias/logo.png"

export default function ConnectionLost(props) {

  function handleClick() {
    props.setConnectionData(old => {
      return { ...old, count: old.count+1, reconnecting: true }
    })
  }
    
  return (
    <div className="content">
      <header className="header">
        <img className="header--logo" src={img_logo} alt="Logo" />
        <h1 className="header--title">Connexion perdue</h1>
        <p className="header--description">
          Nous n'arrivons plus à contacter le serveur. Le problème vient peut-être de votre connexion internet.
        </p>
        <button className="header--button button__red" onClick={handleClick}>Se reconnecter</button>
      </header>
    </div>
  )
}