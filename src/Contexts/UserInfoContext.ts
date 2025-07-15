/* eslint-disable no-empty-function */
import { createContext } from "react";

interface Context {
    userInfoState: { id: string, username: string };
    userInfoLoading: boolean;
    clearUserInfo(): void;
}

export const UserInfoContext = createContext<Context>({
    userInfoState: { id: "", username: "" },
    userInfoLoading: true,
    clearUserInfo: () => { }
});