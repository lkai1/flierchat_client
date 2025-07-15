
export const validateUsername = (username: string): boolean => {
    return Boolean(username
        && typeof username === "string"
        && username.match(/^[0-9a-zA-Z]{3,20}$/));
};

export const validateChatName = (chatName: string): boolean => {
    return Boolean(chatName
        && typeof chatName === "string"
        && chatName.length > 2 && chatName.length < 31);
};

export const validateChatId = (chatId: string): boolean => {
    return Boolean(chatId
        && typeof chatId === "string"
        && chatId.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
};

export const validateChatParticipantId = (participantId: string): boolean => {
    return Boolean(participantId
        && typeof participantId === "string"
        && participantId.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
};