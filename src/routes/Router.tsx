import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import UserSettingsPage from "../pages/UserSettingsPage.js";
import AuthRoute from "./AuthRoute.tsx";
import NoAuthRoute from "./NoAuthRoute.tsx";
import UserInfoProvider from "../Contexts/UserInfoProvider.tsx";
import SelectedChatProvider from "../Contexts/SelectedChatProvider.tsx";
import SocketProvider from "../Contexts/SocketProvider.tsx";
import React from "react";

const Router = (): React.JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<NoAuthRoute><LoginPage /></NoAuthRoute>} />
                <Route path="/register" element={<NoAuthRoute><RegisterPage /></NoAuthRoute>} />
                <Route path="/main" element={
                    <AuthRoute >
                        <UserInfoProvider>
                            <SelectedChatProvider>
                                <SocketProvider>
                                    <MainPage />
                                </SocketProvider>
                            </SelectedChatProvider>
                        </UserInfoProvider>
                    </AuthRoute>
                } />
                <Route path="/user_settings" element={
                    <AuthRoute >
                        <UserInfoProvider>
                            <SocketProvider>
                                <UserSettingsPage />
                            </SocketProvider>
                        </UserInfoProvider>
                    </AuthRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;