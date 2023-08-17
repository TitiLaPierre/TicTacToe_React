import React from "react";
import { Navigate, useParams } from "react-router-dom";

export default function Join({ setSessionData }) {

    const { gameId } = useParams();

    React.useEffect(() => {
        setSessionData(old => {
            return { ...old, linkId: gameId }
        });
    });
    return <Navigate to="/" replace />
}