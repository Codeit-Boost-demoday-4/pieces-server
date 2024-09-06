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
const group_model_1 = __importDefault(require("../models/group.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const badge_service_1 = __importDefault(require("./badge.service"));
class GroupService {
    constructor() {
        this.badgeService = new badge_service_1.default();
    }
    //ID로 특정 그룹 가져오기
    getGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.findByPk(id);
            if (!group) {
                throw new Error('그룹을 찾을 수 없습니다.');
            }
            //그룹 생성 후 1년 달성 조건 검사
            const groupAgeMet = yield this.badgeService.checkGroupAge(id);
            if (groupAgeMet) {
                yield this.badgeService.awardBadge(id, 3);
                //badgeCount 계산 및 저장
                yield group.calculateBadgeCount();
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
    getGroups(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, sortBy, keyword, isPublic } = params;
            const offset = (page - 1) * pageSize;
            //기본 정렬 기준
            let order;
            switch (sortBy) {
                case 'latest':
                    order = [['createdAt', 'DESC']];
                    break;
                case 'mostPosted':
                    order = [['postCount', 'DESC']];
                    break;
                case 'mostLiked':
                    order = [['likeCount', 'DESC']];
                    break;
                case 'mostBadge':
                    order = [['badgeCount', 'DESC']];
                    break;
                default:
                    order = [['createdAt', 'DESC']];
            }
            //검색 조건
            const searchCondition = keyword
                ? {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${keyword}%` } },
                    ],
                }
                : {};
            //쿼리 생성
            const query = {
                where: Object.assign(Object.assign({}, searchCondition), { isPublic }),
                order,
                limit: pageSize,
                offset,
            };
            //총 아이템 수 조회
            const totalItemCount = yield group_model_1.default.count({ where: Object.assign(Object.assign({}, searchCondition), { isPublic }) });
            //그룹 목록 조회
            const groups = yield group_model_1.default.findAll(Object.assign(Object.assign({}, query), { attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'] }));
            const totalPages = Math.ceil(totalItemCount / pageSize);
            return {
                currentPage: page,
                totalPages,
                totalItemCount,
                data: groups,
            };
        });
    }
    //그룹 수정
    updateGroup(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            yield group.update(data);
            return group;
        });
    }
    //그룹 삭제
    deleteGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            yield group.destroy();
            return { message: '그룹을 성공적으로 삭제했습니다.' };
        });
    }
    //비밀번호 검증 메소드
    verifyGroupPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            const isMatch = yield bcryptjs_1.default.compare(password, group.passwordHash);
            return isMatch;
        });
    }
    //공감 메소드
    incrementLikeCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            group.likeCount += 1;
            yield group.save();
            //공감 개수 조건을 검사
            const minLikesMet = yield this.badgeService.checkMinLikes(id);
            const badgeId = 4;
            //조건이 만족되면 뱃지를 부여
            if (minLikesMet) {
                yield this.badgeService.awardBadge(id, badgeId);
            }
            //badgeCount 계산 및 저장
            yield group.calculateBadgeCount();
            return group;
        });
    }
    //그룹 공개 여부 확인
    checkIfGroupIsPublic(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getGroupById(id);
            return { id: group.id, isPublic: group.isPublic };
        });
    }
}
exports.default = new GroupService();
