import requests from "../api";

const AuthServices = {
    customerLogin: async (body) => {
        console.log(body)
        return requests.post(`/login`, body);
    },
    customerLogout: async () => {
        return requests.get(`/logout`, );
    },
};

export default AuthServices;
