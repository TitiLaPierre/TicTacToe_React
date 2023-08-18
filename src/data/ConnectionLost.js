import img_check from "~/medias/check.svg"

export function getButtons(setSessionData) {
    const buttons = []

    // 
    // Reconnect
    // 
    buttons.push({
        handlers: {
            onClick: () => setSessionData(old => { return { ...old, connection: { ...old.connection, retries: old.retries+1, reconnecting: true } } })
        },
        context: {
            title: "Se reconnecter",
            description: "Essayer de se reconnecter au serveur"
        },
        action: {
            color: "var(--red)",
            icon: img_check
        }
    })
    return buttons
}