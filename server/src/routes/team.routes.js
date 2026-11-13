// routes/team.js
import { Router } from 'express';
import * as teamMemberController from '../controllers/team.controller.js';
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js';

const router = Router();

router.get('/team', teamMemberController.getAllTeamMembers);
router.post('/team', verifyTokenAdmin, teamMemberController.createTeamMember);
router.put('/team/:id', verifyTokenAdmin, teamMemberController.updateTeamMember);
router.delete('/team/:id', verifyTokenAdmin, teamMemberController.deleteTeamMember);

export default router;
