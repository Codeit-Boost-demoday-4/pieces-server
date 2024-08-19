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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_service_1 = __importDefault(require("../services/group.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class GroupController {
    /**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               introduction:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               password:
 *                 type: string
 *             example:
 *               name: "New Group"
 *               imageUrl: "http://example.com/image.png"
 *               introduction: "This is a new group."
 *               isPublic: true
 *               password: "password123"
 *     responses:
 *       201:
 *         description: 등록 성공
 *       400:
 *         description: 잘못된 요청입니다
 */
    createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, imageUrl, introduction, isPublic, password } = req.body;
                // 비밀번호를 해시화하여 저장
                const saltRounds = 10;
                const passwordHash = yield bcryptjs_1.default.hash(password, saltRounds);
                const group = yield group_service_1.default.createGroup({
                    name,
                    imageUrl,
                    introduction,
                    isPublic,
                    passwordHash,
                });
                // 응답에서 passwordHash, createdAt, updatedAt을 제거한 후 반환
                const _a = group.get({ plain: true }), { passwordHash: _, createdAt, updatedAt } = _a, groupWithoutSensitiveInfo = __rest(_a, ["passwordHash", "createdAt", "updatedAt"]);
                res.status(201).json(groupWithoutSensitiveInfo);
            }
            catch (error) {
                res.status(400).json({ error: '잘못된 요청입니다' });
            }
        });
    }
    /**
     * @swagger
     * /api/groups:
     *   get:
     *     summary: Retrieve all groups
     *     description: Retrieve a list of all groups, including public and private groups.
     *     tags:
     *       - Groups
     *     responses:
     *       200:
     *         description: A list of groups
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                     description: The name of the group
     *                   imageUrl:
     *                     type: string
     *                     description: URL of the group's image
     *                   introduction:
     *                     type: string
     *                     description: Introduction to the group
     *                   isPublic:
     *                     type: boolean
     *                     description: Indicates if the group is public
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                     description: Creation timestamp of the group
     *       500:
     *         description: Server error
     */
    getGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groups = yield group_service_1.default.getGroups();
                res.status(200).json(groups);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve groups' });
            }
        });
    }
}
exports.default = new GroupController();
