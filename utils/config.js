export const getConfig = () => {
    const getTokenFromLocalStorage = localStorage.getItem("profo-auth-token")
        ? JSON.parse(localStorage.getItem("profo-auth-token"))
        : "";


    return {
        header: {
            Authorization: `Bearer ${getTokenFromLocalStorage}`,
            Accept: "application/json",
        },
    };
};