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
const sequelize_1 = require("sequelize");
const group_model_1 = __importDefault(require("../models/group.model")); // Group 모델 import
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class GroupService {
    // ID로 특정 그룹 가져오기
    getGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.findByPk(id);
            if (!group) {
                throw new Error('그룹을 찾을 수 없습니다.');
            }
            return group;
        });
    }
    //그룹 생성
    createGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.create(data);
            return group;
        });
    }
    // 공개,비공개 그룹 따로 조회
    getGroups(isPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                isPublic
            };
            const groups = yield group_model_1.default.findAll({
                where: query,
                attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
            });
            return groups;
        });
    }
    /* 모든 그룹 조회
    async getGroups(isPublic?: boolean) {
      let query: any = {};
  
      if (isPublic !== undefined) {
        query.isPublic = isPublic;
      }
      
      const publicGroups = await Group.findAll({
          //공개그룹 조회
        where: { isPublic: true },
        attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
      });
  
      //비공개그룹 조회
      const privateGroups = await Group.findAll({
        where: { isPublic: false },
        attributes: ['id', 'name', 'isPublic', 'introduction', 'createdAt','postCount', 'likeCount'],
      });
  
      return { publicGroups, privateGroups };
    }
  */
    // 그룹 수정
    updateGroup(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            yield group.update(data);
            return group;
        });
    }
    // 그룹 삭제
    deleteGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            yield group.destroy();
            return { message: '그룹을 성공적으로 삭제했습니다.' };
        });
    }
    // 비밀번호 검증 메소드
    verifyGroupPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            const isMatch = yield bcryptjs_1.default.compare(password, group.passwordHash);
            return isMatch;
        });
    }
    // 공감 메소드
    incrementLikeCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            group.likeCount += 1;
            yield group.save();
            return group;
        });
    }
    // 그룹 공개 여부 확인
    checkIfGroupIsPublic(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            return { id: group.id, isPublic: group.isPublic };
        });
    }
    // 그룹명으로 그룹 검색
    getGroupsByName(isPublic, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                isPublic
            };
            // 그룹 이름으로 검색
            if (name) {
                query.name = {
                    [sequelize_1.Op.like]: `%${name}%`, // 부분 일치 검색, 대소문자 구분 x
                };
            }
            // 그룹을 조회
            const groups = yield group_model_1.default.findAll({
                where: query,
                attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
            });
            return groups;
        });
    }
}
exports.default = new GroupService();
