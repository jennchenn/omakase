import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export async function getAccessTokenFromCode(code) {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            grant_type: 'authorization_code',
            code,
        },
    });
    cookies.set('token', data.id_token, { path: '/' });
    const url = "http://localhost:8080/user/register";
    await axios.post(url, { id_token: data.id_token, refresh_token: data.refresh_token });
    return;
};

export async function onSignIn(googleUser) {
    const url = "http://localhost:8080/user/login";
    const id_token = googleUser.getAuthResponse().id_token;
    cookies.set('token', id_token, { path: '/' });
    return axios.post(url, { id_token: id_token });
};