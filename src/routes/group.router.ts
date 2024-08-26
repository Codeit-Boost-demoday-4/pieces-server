import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/', GroupController.createGroup); //그룹 생성
router.get('/', GroupController.getGroups); //그룹 조회
router.get('/search', GroupController.getGroupsByName);// 그룹명으로 그룹 검색
router.get('/:id', GroupController.getGroupById);//그룹 조회
router.put('/:id', GroupController.updateGroup); //그룹 수정
router.delete('/:id', GroupController.deleteGroup); //그룹 삭제
router.post('/:id/verify-password', GroupController.verifyGroupPassword); //비공개 그룹 접근 확인
router.post('/:id/like', GroupController.likeGroup); //그룹 공감
router.get('/:id/is-public', GroupController.checkGroupIsPublic);//그룹 공개 여부 확인

export default router;