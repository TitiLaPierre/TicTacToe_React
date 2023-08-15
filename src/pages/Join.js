import React from "react";
import { Navigate, useParams } from "react-router-dom";

export default function Join(props) {

    const { gameId } = useParams();
    console.log(gameId)

    React.useEffect(() => {
        props.setSessionData(old => {
            return { ...old, privateGameId: gameId }
        });
    // eslint-disable-next-line
    }, []);
    return <Navigate to="/" replace />
}