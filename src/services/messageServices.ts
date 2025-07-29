import api from "../api.ts";
import { validateChatId, validateMessage, validateMessageId } from "../utils/validation/messageValidation.ts";

interface Message {
    id: string;
    value: string;
    timestamp: string;
    chatId: string;
    messageCreator: { id: string, username: string }
}

export const getChatMessagesService = async (chatId: string): Promise<Message[] | []> => {
    try {
        const response = await api.get<Message[]>(
            "/message",
            { params: { chatId }, withCredentials: true }
        );

        return response.data;
    } catch {
        return [];
    }
};

export const createMessageService = async (chatId: string, message: string): Promise<{ success: boolean, message: string }> => {

    const result = { success: false, message: "" };
    try {
        if (!message) { return result; }

        if (!validateChatId(chatId) ||
            !validateMessage(message)) {
            result.message = "Viestin lähetyksessä esiintyi virhe.";
            return result;
        }
        //check what response comes from backend and correct the type
        const response = await api.post<string>("/message",
            {
                message,
                chatId
            },
            {
                withCredentials: true
            }
        );
        //is response.data an object???
        result.success = true;
        result.message = response.data;
    } catch {
        result.message = "Viestin lähetyksessä esiintyi virhe.";
    }

    return result;
};

export const deleteAllUserMessagesFromChatService = async (chatId: string): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };

    try {
        if (!validateChatId(chatId)) {
            result.message = "Viestien poistamisessa esiintyi virhe.";
            return result;
        }

        await api.delete<string>("/message/all_from_user", {
            data: {
                chatId
            },
            withCredentials: true
        });
        result.success = true;
    } catch {
        result.message = "Viestien poistamisessa esiintyi virhe.";
    }

    return result;
};

export const deleteUserMessageService = async (messageId: string): Promise<{ success: boolean, message: string }> => {
    const result = { success: false, message: "" };

    try {
        if (!validateMessageId(messageId)) {
            result.message = "Viestin poistamisesssa esiintyi virhe.";
            return result;
        }

        await api.delete("/message", {
            data: {
                messageId
            },
            withCredentials: true
        });
        result.success = true;
    } catch {
        result.message = "Viestin poistamisessa esiintyi virhe.";
    }

    return result;
};