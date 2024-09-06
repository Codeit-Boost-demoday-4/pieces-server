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
const groupBadge_model_1 = __importDefault(require("../models/groupBadge.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
class BadgeService {
    // 7일 연속 추억 등록
    checkConsecutivePosts(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const SEVEN_DAYS_AGO = new Date();
            SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);
            const postCount = yield post_model_1.default.count({
                where: {
                    groupId,
                    createdAt: {
                        [sequelize_1.Op.gte]: SEVEN_DAYS_AGO,
                    },
                },
            });
            return postCount >= 7;
        });
    }
    // 추억 수 20개 이상 등록
    checkMinPosts(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postCount = yield post_model_1.default.count({ where: { groupId } });
            return postCount >= 20;
        });
    }
    // 그룹 생성 후 1년 달성
    checkGroupAge(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.findByPk(groupId);
            if (!group)
                return false;
            const ONE_YEAR_AGO = new Date();
            ONE_YEAR_AGO.setFullYear(ONE_YEAR_AGO.getFullYear() - 1);
            return group.createdAt <= ONE_YEAR_AGO;
        });
    }
    // 그룹 공감 1만 개 이상 받기
    checkMinLikes(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.default.findByPk(groupId);
            if (!group)
                return false;
            return group.likeCount >= 10;
        });
    }
    // 추억 공감 1만 개 이상 받기
    checkMinPostLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId);
            if (!post)
                return false;
            return post.likeCount >= 15; // 예시로 10 개로 설정
        });
    }
    //뱃지 부여
    awardBadge(groupId, badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 현재 그룹에 부여된 뱃지 목록 가져오기
            const groupBadge = yield groupBadge_model_1.default.findOne({ where: { groupId, badgeId } });
            if (!groupBadge) {
                // 그룹에 뱃지가 없으면 새로 추가
                yield groupBadge_model_1.default.create({ groupId, badgeId });
                console.log(`뱃지 ID ${badgeId} 추가 완료`);
            }
        });
    }
}
exports.default = BadgeService;
