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
 *     summary: 그룹을 생성합니다.
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
 *         description: 등록 성공!
 *       400:
 *         description: 잘못된 요청입니다.
 */
    createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, imageUrl, introduction, isPublic, password } = req.body;
                // 비밀번호를 해시화하여 저장
                const saltRounds = 10;
                const passwordHash = yield bcryptjs_1.default.hash(password, saltRounds);
                const group = yield group_service_1.default.createGroup({
                    id,
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
       *     summary: 그룹을 조회합니다.
       *     description: 공개여부에 따라 그룹을 조회합니다.
       *     tags:
       *       - Groups
       *     parameters:
       *       - in: query
       *         name: isPublic
       *         schema:
       *           type: boolean
       *           default: true
       *         description: '그룹의 공개 여부 (true: 공개, false: 비공개)'
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
       *                   id:
       *                     type: integer
       *                   name:
       *                     type: string
       *                   imageUrl:
       *                     type: string
       *                   introduction:
       *                     type: string
       *                   isPublic:
       *                     type: boolean
       *                   createdAt:
       *                     type: string
       *                     format: date-time
       *       500:
       *         description: Server error
       */
    getGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPublic = req.query.isPublic === 'false' ? false : true; // 기본값은 true
                const groups = yield group_service_1.default.getGroups(isPublic);
                res.status(200).json(groups);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    getGroupById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const group = yield group_service_1.default.getGroupById(parseInt(id));
                res.status(200).json(group);
            }
            catch (error) {
                res.status(404).json({ error: '존재하지 않습니다.' });
            }
        });
    }
    /**
     * @swagger
     * /api/groups/{id}:
     *   put:
     *     summary: 그룹을 수정합니다.
     *     tags:
     *       - Groups
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: 수정할 그룹의 id
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
     *                 description: 비밀번호 확인
     *             example:
     *               name: "Updated Group"
     *               imageUrl: "http://example.com/newimage.png"
     *               introduction: "This is an updated group."
     *               isPublic: true
     *               password: "password123"
     *     responses:
     *       200:
     *         description: 업데이트 성공!
     *       400:
     *         description: 잘못된 요청입니다.
     *       403:
     *         description: 비밀번호가 틀렸습니다.
     *       404:
     *         description: 존재하지 않습니다.
     */
    updateGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, imageUrl, introduction, isPublic, password } = req.body;
                const group = yield group_service_1.default.getGroupById(parseInt(id));
                // 비밀번호 확인
                const isMatch = yield bcryptjs_1.default.compare(password, group.passwordHash);
                if (!isMatch) {
                    return res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
                }
                const updatedData = { name, imageUrl, introduction, isPublic };
                const updatedGroup = yield group_service_1.default.updateGroup(parseInt(id), updatedData);
                res.status(200).json(updatedGroup);
            }
            catch (error) {
                res.status(400).json({ error: '잘못된 요청입니다' });
            }
        });
    }
    /**
   * @swagger
   * /api/groups/{id}:
   *   delete:
   *     summary: 그룹을 삭제합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: 삭제할 그룹의 id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 비밀번호 확인
   *             example:
   *               password: "password123"
   *     responses:
   *       200:
   *         description: 삭제 성공!
   *       403:
   *         description: 비밀번호가 틀렸습니다.
   *       404:
   *         description: 그룹을 찾을 수 없습니다.
   *       400:
   *         description: 잘못된 요청입니다.
   *       500:
   *         description: 서버 오류
     */
    deleteGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { password } = req.body;
                const group = yield group_service_1.default.getGroupById(parseInt(id));
                // 비밀번호 확인
                const isMatch = yield bcryptjs_1.default.compare(password, group.passwordHash);
                if (!isMatch) {
                    return res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
                }
                yield group_service_1.default.deleteGroup(parseInt(id));
                res.status(200).json({ message: '그룹이 성공적으로 삭제되었습니다.' });
            }
            catch (error) {
                res.status(400).json({ error: '잘못된 요청입니다' });
            }
        });
    }
    /**
   * @swagger
   * /api/groups/{id}/verify-password:
   *   post:
   *     summary: 그룹 접근 시 비밀번호를 검증합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: 검증할 그룹의 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 그룹 비밀번호
   *             example:
   *               password: "password123"
   *     responses:
   *       200:
   *         description: 비밀번호가 확인되었습니다.
   *       403:
   *         description: 비밀번호가 틀렸습니다.
   *       404:
   *         description: 존재하지 않습니다.
   */
    verifyGroupPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { password } = req.body;
                const isValid = yield group_service_1.default.verifyGroupPassword(parseInt(id), password);
                if (isValid) {
                    res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
                }
                else {
                    res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
                }
            }
            catch (error) {
                res.status(404).json({ error: '존재하지 않습니다.' });
            }
        });
    }
    /**
     * @swagger
     * /api/groups/{id}/like:
     *   post:
     *     summary: 그룹의 likeCount를 1 증가시킵니다.
     *     tags:
     *       - Groups
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: like를 증가시킬 그룹의 ID
     *     responses:
     *       200:
     *         description: 그룹 공감하기 성공
     *       404:
     *         description: 존재하지 않습니다.
     */
    likeGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedGroup = yield group_service_1.default.incrementLikeCount(parseInt(id));
                res.status(200).json({ message: '그룹 공감하기 성공', likeCount: updatedGroup.likeCount });
            }
            catch (error) {
                res.status(404).json({ error: '존재하지 않습니다.' });
            }
        });
    }
    /**
     * @swagger
     * /api/groups/{id}/is-public:
     *   get:
     *     summary: 그룹의 공개 여부를 확인합니다.
     *     tags:
     *       - Groups
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: 공개 여부를 확인할 그룹의 ID
     *     responses:
     *       200:
     *         description: 그룹의 공개 여부를 반환합니다.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 isPublic:
     *                   type: boolean
     *       404:
     *         description: 존재하지 않습니다.
     */
    checkGroupIsPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const groupStatus = yield group_service_1.default.checkIfGroupIsPublic(parseInt(id));
                res.status(200).json(groupStatus);
            }
            catch (error) {
                res.status(404).json({ error: '존재하지 않습니다.' });
            }
        });
    }
    /**
     * @swagger
     * /api/groups/search:
     *   get:
     *     summary: 그룹을 조회합니다. 공개 여부와 이름으로 검색할 수 있습니다.
     *     tags:
     *       - Groups
     *     parameters:
     *       - in: query
     *         name: isPublic
     *         schema:
     *           type: boolean
     *           default: true
     *           description: '그룹의 공개 여부 (true: 공개, false: 비공개).'
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *           description: '검색할 그룹 이름'
     *     responses:
     *       200:
     *         description: 조회 성공
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   name:
     *                     type: string
     *                   imageUrl:
     *                     type: string
     *                   introduction:
     *                     type: string
     *                   isPublic:
     *                     type: boolean
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                   postCount:
     *                     type: integer
     *                   likeCount:
     *                     type: integer
     *                   badgeCount:
     *                     type: integer
     *       500:
     *         description: 서버 오류
     */
    getGroupsByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 쿼리 매개변수에서 isPublic과 name을 가져옵니다.
                const isPublic = req.query.isPublic === 'false' ? false : true; // 기본값은 true
                const name = req.query.name;
                // 입력된 쿼리 매개변수 로깅
                console.log(`Query Parameters - isPublic: ${isPublic}, name: ${name}`);
                // 그룹 조회 서비스 호출
                const groups = yield group_service_1.default.getGroupsByName(isPublic, name);
                // 조회된 그룹을 반환하기 전에 로깅
                console.log('Retrieved Groups: ', groups);
                // 조회된 그룹 반환
                res.status(200).json(groups);
            }
            catch (error) {
                // 서버 오류 처리
                res.status(500).json({ error: '서버 오류가 발생했습니다.' });
            }
        });
    }
}
exports.default = new GroupController();
