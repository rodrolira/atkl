// src/app/api/team.js
import axios from './axios';

export const createTeamMemberRequest = async (teamMember) => {
  return await axios.post('/team', teamMember);
};

export const getTeamMemberRequest = async (id) => {
  return await axios.get(`/team/${id}`);
};

export const getTeamMembersRequest = async () => {
  return await axios.get('/team');
};

export const updateTeamMemberRequest = async (id, teamMember) => {
  return await axios.put(`/team/${id}`, teamMember);
};

export const deleteTeamMemberRequest = async (id) => {
  return await axios.delete(`/team/${id}`);
};

export const getRolesRequest = () => axios.get('/roles');
