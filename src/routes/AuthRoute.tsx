import { verifyLoginService } from "../services/authServices.ts";
import { Navigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../Contexts/SocketContext.ts";

const AuthRoute = ({ children }: { children: React.JSX.Element; }): React.JSX.Element => {
    const { socket } = useContext(SocketContext);
    const [verifiedLogin, setVerifiedLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const result = await verifyLoginService();
            if (!result.success) {
                await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            }
            setVerifiedLogin(result.success);
        };
        void getData();
    }, [socket]);
    console.log(verifiedLogin);

    if (verifiedLogin === null) { return <div>Loading...</div>; }

    return verifiedLogin
        ? children
        : <Navigate to="/login" />;
};

export default AuthRoute;