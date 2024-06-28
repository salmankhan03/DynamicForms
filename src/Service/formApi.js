import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
    baseURL: `https://hamiltondinnerapp.intellidt.com`,
    timeout: 50000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(function (config) {
    let token;
    if (Cookies.get('userToken')) {
        token = JSON.parse(Cookies.get('userToken'));
    }

    let company;

    if (Cookies.get('company')) {
        company = Cookies.get('company');
    }

    return {
        ...config,
        headers: {
            authorization: token ? `Bearer ${token}` : null,
        },
    };
});

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {

        console.log('error---------------------', error.response && error.response.status === 401 || error.response.status === 500)

        if (error.response && error.response.status === 401 || error.response.status === 500) {
            Cookies.remove('userToken');
            localStorage.removeItem('persist:root');
            const navigate = useNavigate();
            navigate('/login');
        }

        return Promise.reject(error);
    }
);


const responseBody = (response) => response.data;

const request = {
    get: (url, body, headers) =>
        instance.get(url, body, headers).then(responseBody),

    post: (url, body) => instance.post(url, body).then(responseBody),

    put: (url, body, headers) =>
        instance.put(url, body, headers).then(responseBody),

    patch: (url, body) => instance.patch(url, body).then(responseBody),

    delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default request;
