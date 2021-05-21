import * as queryString from 'query-string';

export function createLoginUrl() {
    const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_REDIRECT_URI } = process.env;
    const stringifiedParams = queryString.stringify({
        client_id: REACT_APP_GOOGLE_CLIENT_ID,
        redirect_uri: REACT_APP_REDIRECT_URI,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar'
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
}

export function parseCodeFromUrl(url) {
    const urlParams = queryString.parse(url);
    let error = false;
    let code;
    if (urlParams.error) {
        error = true;
    } else {
        code = urlParams.code;
    }
    return {
        error, code
    };
}
