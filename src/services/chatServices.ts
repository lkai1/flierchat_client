import axios from "axios";
import { validateChatId, validateChatName, validateChatParticipantId, validateUsername } from "../utils/validation/chatValidation.ts";

//check correct type
interface Chat {
    Chat: {
        id: string;
        chatName: string;
        chatParticipants: {
            id: string;
            username: string;
        }[];
        creatorId: string;
        isGroup: boolean | null;
        messages: {
            id: string;
            value: string;
            timestamp: string;
            chatId: string;
            messageCreator: { id: string, username: string };
        }[];
    }
}

export const getUserChatsService = async (): Promise<Chat[]> => {
    try {
        const response = await axios.get<Chat[]>("/api/chat", {
            withCredentials: true
        });
        return response.data;
    } catch {
        return [];
    }
};

export const createPrivateChatService = async (participantUsername: string): Promise<{ success: boolean, message: string, data: string }> => {
    const result = { success: false, message: "", data: "" };

    try {
        if (!validateUsername(participantUsername)) {
            result.message = "Tarkista oikeinkirjoitus.";
            return result;
        }

        const response = await axios.post<string>("/api/chat/private",
            { participantUsername },
            { withCredentials: true }
        );

        result.success = true;
        result.message = "Yksityiskeskustelun luonti onnistui.";
        result.data = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                result.message = "Tarkista oikeinkirjoitus.";
            } else if (error.response?.status === 403) {
                result.message = "Et voi luoda yksityiskeskustelua kyseisen käyttäjän kanssa. Onko teillä jo olemassa oleva yksityiskeskustelu?";
            } else if (error.response?.status === 404) {
                result.message = "Käyttäjää ei löytynyt.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        } else {
            result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
        }
    }

    return result;
};

export const createGroupChatService = async (chatName: string): Promise<{ success: boolean, message: string, data: string }> => {
    const result = { success: false, message: "", data: "" };

    try {
        if (!validateChatName(chatName)) {
            result.message = "Tarkista oikeinkirjoitus.";
            return result;
        }

        const response = await axios.post<string>("/api/chat/group",
            { chatName },
            { withCredentials: true }
        );
        result.success = true;
        result.message = "Ryhmäkeskustelun luonti onnistui.";
        result.data = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                result.message = "Tarkista oikeinkirjoitus.";
            } else if (error.response?.status === 403) {
                result.message = "Ryhmäkeskustelun nimi on jo varattu.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        } else {
            result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
        }
    }

    return result;
};

export const addGroupChatParticipantService = async (chatId: string, participantUsername: string): Promise<{ success: boolean, message: string, data: string }> => {
    const result = { success: false, message: "", data: "" };

    try {
        if (!validateUsername(participantUsername)) {
            result.message = "Onko käyttäjänimi oikeassa muodossa?";
            return result;
        }

        if (!validateChatId(chatId)) {
            result.message = "Chatin tunniste on epämuodostunut!";
            return result;
        }

        const response = await axios.post<string>("/api/chat/group/participant",
            { chatId, participantUsername },
            { withCredentials: true }
        );

        result.success = true;
        result.message = "Uusi käyttäjä lisätty keskusteluun.";
        result.data = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                result.message = "Et voi lisätä käyttäjää tähän keskusteluun!";
            } else if (error.response?.status === 404) {
                result.message = "Käyttäjiä tai chattia ei löytynyt. Onko joku näistä poistettu? Kokeile päivittää sivu.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        } else {
            result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
        }
    }

    return result;
};

export const removeChatParticipantService = async (chatId: string, participantId: string): Promise<{ success: boolean, message: string, data: { chatId: string, participantId: string } | object }> => {
    const result = { success: false, message: "", data: {} };

    try {
        if (!validateChatParticipantId(participantId)) {
            result.message = "Käyttäjän tunniste on epämuodostunut!";
            return result;
        }

        if (!validateChatId(chatId)) {
            result.message = "Keskustelun tunniste on epämuodostunut!";
            return result;
        }

        const response = await axios.delete<{ chatId: string, participantId: string }>("/api/chat/participant", {
            data: { chatId, participantId },
            withCredentials: true
        });
        result.success = true;
        result.data = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                result.message = "Keskustelun luojana voit poistua vain poistamalla keskustelun.";
            } else if (error.response?.status === 401) {
                result.message = "Vain keskustelun luoja voi poistaa muita käyttäjiä keskustelusta.";
            } else if (error.response?.status === 404) {
                result.message = "Käyttäjää tai chattia ei löytynyt. Onko joku näistä poistettu? Kokeile päivittää sivu.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        }
    }

    return result;
};

export const deleteChatService = async (chatId: string): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };

    try {
        if (!validateChatId(chatId)) {
            result.message = "Chatin tunniste on epämuodostunut!";
            return result;
        }

        await axios.delete<string>("/api/chat", {
            data: { chatId },
            withCredentials: true
        });

        result.success = true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                result.message = "Et voi poistaa chattia.";
            } else if (error.response?.status === 404) {
                result.message = "Käyttäjää tai chattia ei löytynyt. Onko joku näistä poistettu? Kokeile päivittää sivu.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        }
    }

    return result;
};

export const getUnreadMessagesAmountInChatService = async (chatId: string): Promise<{ success: boolean, message: string, data: number }> => {
    const result = { success: false, message: "", data: 0 };

    try {
        if (!validateChatId(chatId)) {
            result.message = "Chatin tunniste on epämuodostunut!";
            return result;
        }

        const response = await axios.get<number>("/api/chat/unread_messages", {
            params: { chatId },
            withCredentials: true
        });

        result.success = true;
        result.data = response.data;
    } catch {
        result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
    }

    return result;
};

export const updateUnreadMessagesAmountInChatService = async (chatId: string): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };

    try {
        if (!validateChatId(chatId)) {
            result.message = "Chatin tunniste on epämuodostunut!";
            return result;
        }

        await axios.patch("/api/chat/unread_messages",
            { chatId },
            { withCredentials: true }
        );

        result.success = true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                result.message = "Et ole chatin osallistuja. Kokeile päivittää sivu";
            } else if (error.response?.status === 404) {
                result.message = "Käyttäjää tai chattia ei löytynyt. Onko joku näistä poistettu? Kokeile päivittää sivu.";
            } else {
                result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
            }
        } else {
            result.message = "Jokin meni pieleen! Yritä myöhemmin uudelleen.";
        }
    }

    return result;
};
