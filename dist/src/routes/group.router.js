"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = __importDefault(require("../controllers/group.controller"));
const router = (0, express_1.Router)();
router.post('/', group_controller_1.default.createGroup); //그룹 생성
router.get('/', group_controller_1.default.getGroups); //그룹 조회
router.get('/:id', group_controller_1.default.getGroupById); //그룹 조회
router.put('/:id', group_controller_1.default.updateGroup); //그룹 수정
router.delete('/:id', group_controller_1.default.deleteGroup); //그룹 삭제
router.post('/:id/verify-password', group_controller_1.default.verifyGroupPassword); //비공개 그룹 접근 확인
router.post('/:id/like', group_controller_1.default.likeGroup); //그룹 공감
router.get('/:id/is-public', group_controller_1.default.checkGroupIsPublic); //그룹 공개 여부 확인
exports.default = router;
