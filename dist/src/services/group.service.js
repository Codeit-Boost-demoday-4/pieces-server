"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_model_1 = __importDefault(require("../models/group.model")); // Group 모델 import
class GroupService {
    //그룹 생성
    createGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.create(data);
            return group;
        });
    }
    // 그룹 조회
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const publicGroups = yield group_model_1.default.findAll({
                //공개그룹 조회
                where: { isPublic: true },
                attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
            });
            //비공개그룹 조회
            const privateGroups = yield group_model_1.default.findAll({
                where: { isPublic: false },
                attributes: ['id', 'name', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount'],
            });
            return { publicGroups, privateGroups };
        });
    }
}
exports.default = new GroupService();
