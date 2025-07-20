import api from "../api";

export const getUserInfoService = async (): Promise<{ id: string, username: string }> => {
    try {
        const response = await api.get<{ id: string, username: string }>("/user/user_info", { withCredentials: true });

        return response.data;
    } catch {
        return { id: "", username: "" };
    }
};

export const deleteUserService = async (): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };
    try {
        await api.delete("/user", { withCredentials: true });
        result.success = true;
    } catch {
        result.message = "Käyttäjän poistamisessa esiintyi virhe.";
    }

    return result;
};