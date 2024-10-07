// src/app/api/team.js
import axios from './axios';

export const createTeamMemberRequest = async (teamMember) => {
  return await axios.post('/team_members', teamMember);
};

export const getTeamMemberRequest = async (id) => {
  return await axios.get(`/team_members/${id}`);
};

export const getTeamMembersRequest = async () => {
  return await axios.get('/team_members');
};
