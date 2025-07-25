import { verifyLoginService } from "../services/authServices.js";
import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

interface Props {
    children: React.JSX.Element;
};

const NoAuthRoute = ({ children }: Props): React.JSX.Element => {
    const [verifiedLogin, setVerifiedLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const result = await verifyLoginService();
            setVerifiedLogin(result.success);
        };
        void getData();
    }, []);

    if (verifiedLogin === null) { return <div>Loading...</div>; }

    return verifiedLogin
        ? <Navigate to="/main" />
        : children;
};

export default NoAuthRoute;