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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ioredis_1 = require("ioredis");
var express = require('express');
var bodyParser = require('body-parser');
var redisClient = new ioredis_1["default"]({
    host: 'localhost',
    password: 'chelsea24'
});
var BOARD_NAME = 'BOARD';
function scorePlayerUpdate(userId, score) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redisClient.zadd(BOARD_NAME, 'INCR', score, userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getRange(_a) {
    var point1 = _a[0], point2 = _a[1];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, redisClient.geoadd('locations', point1.longitude, point1.latitude, point1.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, redisClient.geoadd('locations', point2.longitude, point2.latitude, point2.name)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, redisClient.geodist('locations', point1.name, point2.name, "km")];
            }
        });
    });
}
function getBoard() {
    return __awaiter(this, void 0, void 0, function () {
        var cachedLeaderboard, leaderboard, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redisClient.zrevrange(BOARD_NAME, 0, -1, 'WITHSCORES')];
                case 1:
                    cachedLeaderboard = _a.sent();
                    if (cachedLeaderboard.length <= 0) {
                        return [2 /*return*/, []];
                    }
                    leaderboard = [];
                    for (i = 0; i < cachedLeaderboard.length; i += 2) {
                        leaderboard.push({ playerId: cachedLeaderboard[i], score: parseInt(cachedLeaderboard[i + 1]) });
                    }
                    return [2 /*return*/, leaderboard];
            }
        });
    });
}
var app = express();
var port = 3000;
// parse application/json
app.use(bodyParser.json());
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, score, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, userId = _a.userId, score = _a.score;
                return [4 /*yield*/, scorePlayerUpdate(userId, score)];
            case 1:
                _d.sent();
                _c = (_b = res).send;
                return [4 /*yield*/, getBoard()];
            case 2:
                _c.apply(_b, [_d.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.post('/range', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, point1, point2, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log(req.body);
                _a = req.body, point1 = _a.point1, point2 = _a.point2;
                _c = (_b = res).send;
                return [4 /*yield*/, getRange([point1, point2])];
            case 1:
                _c.apply(_b, [_d.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
