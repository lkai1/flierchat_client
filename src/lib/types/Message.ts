export interface Message {
    id: string;
    value: string;
    timestamp: string;
    chatId: string;
    messageCreator: { id: string; username: string };
}

export interface UnreadMessageInChat {
    chatId: string;
    amount: number;
}