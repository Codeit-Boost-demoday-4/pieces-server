import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/groups', GroupController.createGroup); //그룹 생성
router.get('/groups', GroupController.getGroups); //그룹 조회
router.get('/groups/:id', GroupController.getGroupById);
router.put('/groups/:id', GroupController.updateGroup); //그룹 수정
router.delete('/groups/:id', GroupController.deleteGroup); //그룹 삭제
router.post('/groups/:id/verify-password', GroupController.verifyGroupPassword); //그룹 생성

export default router;