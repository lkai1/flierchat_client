import React, { useEffect, useState, useMemo } from "react";
import { getUserInfoService } from "../services/userServices.ts";
import { UserInfoContext } from "./UserInfoContext.ts";

const UserInfoProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {

    const [userInfoState, setUserInfoState] = useState<{ id: string, username: string }>({ id: "", username: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserInfoService()
            .then((userInfo) => {
                setUserInfoState(userInfo);
                setLoading(false);
            }).catch(() => { return null; });
    }, []);

    const clearUserInfo = (): void => {
        setUserInfoState({ id: "", username: "" });
        setLoading(true);
    };

    const valuesToProvide = useMemo(
        () => {
            return {
                userInfoState,
                userInfoLoading: loading,
                clearUserInfo
            };
        },
        [userInfoState, loading],
    );

    return (
        <UserInfoContext.Provider value={valuesToProvide}>
            {children}
        </UserInfoContext.Provider>
    );
};

export default UserInfoProvider;