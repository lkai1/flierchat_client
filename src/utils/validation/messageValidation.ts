

export const validateChatId = (chatId: string): boolean => {
    return Boolean(chatId
        && typeof chatId === "string"
        && chatId.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
};

export const validateMessage = (message: string): boolean => {
    return Boolean(message
        && typeof message === "string");
};

export const validateMessageId = (messageId: string): boolean => {
    return Boolean(messageId
        && typeof messageId === "string"
        && messageId.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
};