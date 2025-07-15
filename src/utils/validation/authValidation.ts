export const validateUsername = (username: string): boolean => {
    return Boolean(username
        && typeof username === "string"
        && username.match(/^[0-9a-zA-Z]{3,20}$/));
};

export const validatePassword = (password: string): boolean => {
    return Boolean(password
        && typeof password === "string"
        && password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/));
};