import axios from "axios";

export const getUserInfoService = async (): Promise<{ id: string, username: string }> => {
    try {
        const response = await axios.get<{ id: string, username: string }>("/api/user/user_info", { withCredentials: true });

        return response.data;
    } catch {
        return { id: "", username: "" };
    }
};

export const deleteUserService = async (): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };
    try {
        await axios.delete("/api/user", { withCredentials: true });
        result.success = true;
    } catch {
        result.message = "Käyttäjän poistamisessa esiintyi virhe.";
    }

    return result;
};