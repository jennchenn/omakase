import axios from 'axios';

export async function listCalendars() {
    const url = "http://localhost:8080/calendar/list";
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
};

export async function createGroupMeeting(meeting) {
    const url = "http://localhost:8080/calendar/groupMeeting";
    const res = await axios.post(url, meeting, { withCredentials: true });
    return res.data;
};
