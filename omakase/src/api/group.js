import axios from 'axios';

export async function getGroups() {
  const url = 'http://localhost:8080/user/groups';
  const res = await axios.get(url, { withCredentials: true });
  return res.data.groups;
}

export async function getGroupInfo(id) {
  const url = `http://localhost:8080/group/${id}`;
  const res = await axios.get(url, { withCredentials: true });
  return res.data;
}
