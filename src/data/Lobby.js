import img_chevron from "~/medias/chevron.svg"
import img_copy from "~/medias/copy.svg"
import img_check from "~/medias/check.svg"
import img_stop from "~/medias/stop.svg"

export function getButtons(sessionData, copied, setCopied) {
    const buttons = []

    //
    // Public queue
    //
    buttons.push({
        handlers: {
            onClick: () => {
                if (sessionData.gameState)
                    sessionData.queueManager.leaveQueue()
                else
                    sessionData.queueManager.joinQueue("public")
            }
        },
        disabled: sessionData.gameState?.privacy === "private",
        decoration: {
            color: "var(--green)",
            style: sessionData.gameState?.privacy === "public" ? "button__load" : "button__circle",
        },
        context: {
            title: "Partie publique",
            note: `(${sessionData.publicPlayerCount} joueur${sessionData.publicPlayerCount > 1 ? "s" : ""})`,
            description: sessionData.gameState?.privacy === "public" ? "En attente d'un adversaire..." : "Rejoindre une partie aléatoire"
        },
        action: {
            color: sessionData.gameState?.privacy === "public" ? "var(--blue)" : "var(--dark)",
            icon: sessionData.gameState?.privacy === "public" ? img_stop : img_chevron
        }
    })

    //
    // Private queue
    //
    buttons.push({
        handlers: {
            onClick: () => {
                if (sessionData.gameState)
                    sessionData.queueManager.leaveQueue()
                else
                    sessionData.queueManager.joinQueue("private")
            }
        },
        disabled: sessionData.gameState?.privacy === "public",
        decoration: {
            color: "var(--red)",
            style: sessionData.gameState?.privacy === "private" ? "button__load" : "button__circle",
        },
        context: {
            title: "Partie privée",
            description: sessionData.gameState?.privacy === "private" ? "En attente d'un adversaire..." : "Créer une partie et inviter un ami"
        },
        action: {
            color: sessionData.gameState?.privacy === "private" ? "var(--blue)" : "var(--dark)",
            icon: sessionData.gameState?.privacy === "private" ? img_stop : img_chevron
        }
    })

    //
    // Copy link
    //
    buttons.push({
        handlers: {
            onClick: () => {
                navigator.clipboard.writeText(`${window.location.origin}/${sessionData.gameState.id}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        },
        disabled: sessionData.gameState ? false : true,
        context: {
            title: "Inviter un ami",
            description: copied ? "Lien copié !" : "Copier le lien d'invitation",
            note: sessionData.gameState && `(${sessionData.gameState.id})`
        },
        action: {
            color: sessionData.gameState ? copied ? "var(--green)" : "var(--blue)" : "var(--dark)",
            icon: copied ? img_check : img_copy
        }
    })

    return buttons
}