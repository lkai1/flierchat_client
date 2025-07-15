
export const setTabInfoNewMessages = (): void => {
    const element = document.getElementById("tab-info");
    if (element) {
        element.innerHTML = "(new messages) FLIERCHAT";
    }
};

export const setTabInfoNoNewMessages = (): void => {
    const element = document.getElementById("tab-info");
    if (element) {
        element.innerHTML = "FLIERCHAT";
    }
};