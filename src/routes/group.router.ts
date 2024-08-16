import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/groups', GroupController.createGroup); //그룹 생성
router.get('/groups', GroupController.getGroups); //그룹 조회

export default router;
