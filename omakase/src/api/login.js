import axios from 'axios';

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
    const url = "http://localhost:8080/user/register";
    await axios.post(url, { id_token: data.id_token, refresh_token: data.refresh_token });
    return;
};