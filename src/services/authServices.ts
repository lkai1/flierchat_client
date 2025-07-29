import { AxiosResponse, isAxiosError } from 'axios';
import { validateUsername, validatePassword } from '../utils/validation/authValidation.ts';
import { NavigateFunction } from 'react-router';
import api from '../api.ts';
import { Socket } from 'socket.io-client';

export const loginService = async (loginCreds: { username: string, password: string }): Promise<{
    success: boolean,
    message: string
}> => {
    const result = { success: false, message: "" };
    try {
        if (!validateUsername(loginCreds.username) ||
            !validatePassword(loginCreds.password)) {
            result.message = "Wrong username or password.";
            return result;
        }

        const response: AxiosResponse = await api.post("/auth/login", {
            username: loginCreds.username,
            password: loginCreds.password,
        }, {
            withCredentials: true
        });

        if (response.status === 200) {
            result.success = true;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 400) {
            result.message = "Wrong username or password.";
        } else {
            result.message = "Something went wrong. Try again later.";
        }
    }
    return result;
};

export const registerService = async (registerCreds: {
    username: string,
    password: string,
    password2: string
}): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };
    try {
        if (!validateUsername(registerCreds.username) ||
            !validatePassword(registerCreds.password) ||
            registerCreds.password !== registerCreds.password2) {
            result.message = "Tarkista tietojen oikeinkirjoitus.";
            return result;
        }

        const response: AxiosResponse = await api.post("/auth/register", {
            username: registerCreds.username,
            password: registerCreds.password,
            password2: registerCreds.password2
        });

        if (response.status === 201) {
            result.success = true;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                result.message = "Tarkista tietojen oikeinkirjoitus.";
            } else if (error.response?.status === 403) {
                result.message = "Käyttäjänimi on jo varattu.";
            }
        } else {
            result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
        }
    }
    return result;
};

export const logoutService = async (navigate: NavigateFunction, socket: Socket): Promise<{ success: boolean, message: string }> => {
    //removed navigate from here so fix where this function is used
    try {
        socket.disconnect();
        await api.post('/auth/logout', {}, { withCredentials: true });
        await navigate("/login");
        return { success: true, message: "" };
    } catch {
        return { success: false, message: "Logout failed. Try again later." };
    }
};

export const verifyLoginService = async (): Promise<{ success: boolean, message: string }> => {
    try {
        await api.get("/auth/verify_login", { withCredentials: true });
        return { success: true, message: "" };
    } catch {
        return { success: false, message: "Login verification failed." };
    }
};