"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = __importDefault(require("../controllers/group.controller"));
const router = (0, express_1.Router)();
router.post('/groups', group_controller_1.default.createGroup); //그룹 생성
router.get('/groups', group_controller_1.default.getGroups); //그룹 조회
exports.default = router;
