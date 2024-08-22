import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/groups', GroupController.createGroup); //그룹 생성
router.get('/groups', GroupController.getGroups); //그룹 조회
router.get('/groups/:id', GroupController.getGroupById);
router.put('/groups/:id', GroupController.updateGroup); //그룹 수정
router.delete('/groups/:id', GroupController.deleteGroup); //그룹 삭제
router.post('/groups/:id/verify-password', GroupController.verifyGroupPassword); //비공개 그룹 접근 확인
router.post('/groups/:id/like', GroupController.likeGroup); //그룹 공감
router.get('/groups/:id/is-public', GroupController.checkGroupIsPublic);

export default router;