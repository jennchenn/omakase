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

export async function createGroup(group) {
  const url = 'http://localhost:8080/group';
  const res = await axios.post(url, group, { withCredentials: true });
  return res;
}

export async function addMember(member) {
  const url = 'http://localhost:8080/group/newMember';
  const res = await axios.post(url, member, { withCredentials: true });
  return res;
}
