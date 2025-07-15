

export const getTimestampStringFromISODateTime = (dateTime: string): string => {
    const date = new Date(dateTime);

    const hours = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
    const days = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate();
    const months = `${date.getMonth() + 1}`.length < 2 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);

    return `${days}.${months}.${date.getFullYear()} ${hours}:${minutes} `;
};