import TeamMember from "../models/teammember.model";

export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll();
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team members' });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, position, image_url, bio } = req.body;
    const newTeamMember = await TeamMember.create({ name, position, image_url, bio });
    res.status(201).json(newTeamMember);
  } catch (error) {
    res.status(500).json({ error: 'Error creating team member' });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, image_url, bio } = req.body;
    await TeamMember.update({ name, position, image_url, bio }, { where: { id } });
    const updatedTeamMember = await TeamMember.findByPk(id);
    res.json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ error: 'Error updating team member' });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await TeamMember.destroy({ where: { id } });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team member' });
  }
};
