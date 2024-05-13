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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PapayaBySig = void 0;
var solidity_utils_1 = require("@1inch/solidity-utils");
var ethers_1 = require("ethers");
var permit_1 = require("../helpers/permit");
var papayaABI = require('../abi/Papaya.json');
var erc20PermitABI = require('../abi/ERC20Permit.json');
var PapayaBySig = /** @class */ (function () {
    function PapayaBySig(url, chainId, papayaAddress, tokenAddress, secretKey) {
        this.NonceType = {
            Account: 0n,
            Selector: 1n,
            Unique: 2n,
        };
        this.customProvider = new ethers_1.ethers.JsonRpcProvider(url);
        this.wallet = new ethers_1.ethers.Wallet(secretKey, this.customProvider);
        this.contract = new ethers_1.ethers.Contract(papayaAddress, papayaABI.abi, this.wallet);
        this.token = new ethers_1.ethers.Contract(tokenAddress, erc20PermitABI.abi, this.wallet);
        this.ChainId = chainId;
    }
    PapayaBySig.prototype.BySigDeposit = function (amount_1, deadline_1) {
        return __awaiter(this, arguments, void 0, function (amount, deadline, isPermit2) {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            if (isPermit2 === void 0) { isPermit2 = false; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('deposit', [amount, isPermit2])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.PermitAndDeposit = function (amount, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var permit, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = permit_1.createPermit;
                        _b = [this.wallet, this.token, '1', this.ChainId];
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(), amount, deadline]))
                        // const tokenAddress = await this.token.getAddress()
                        // await this.contract.connect(this.wallet).permitAndCall(
                        //     ethers.solidityPacked(
                        //         ['address', 'bytes'],
                        //         [await this.token.getAddress(), permit]
                        //     ),
                        //     this.contract.interface.encodeFunctionData('deposit', [
                        //         amount, false
                        //     ])
                        // )
                        // return { tokenAddress, permit }
                    ];
                    case 2:
                        permit = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PapayaBySig.prototype.PermitAndBySigDeposit = function (amount_1, deadline_1) {
        return __awaiter(this, arguments, void 0, function (amount, deadline, isPermit2) {
            var nonce, name, version, tokenAddress, walletAddress, permit, _a, _b, signedCall, signature, _c, _d;
            var _e;
            if (isPermit2 === void 0) { isPermit2 = false; }
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_f.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _f.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_f.sent()).toString();
                        return [4 /*yield*/, this.token.getAddress()];
                    case 4:
                        tokenAddress = _f.sent();
                        walletAddress = this.wallet.address;
                        _a = permit_1.createPermit;
                        _b = [this.wallet, this.token, '1', this.ChainId];
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, _b.concat([_f.sent(), amount, deadline]))];
                    case 6:
                        permit = _f.sent();
                        signedCall = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('deposit', [amount, isPermit2])
                        };
                        _d = (_c = this.wallet).signTypedData;
                        _e = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 7: return [4 /*yield*/, _d.apply(_c, [(_e.verifyingContract = _f.sent(), _e), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            signedCall])
                        // await this.contract.connect(this.wallet).permitAndCall(
                        //     ethers.solidityPacked(
                        //         ['address', 'bytes'],
                        //         [await token.getAddress(), permit]
                        //     ),
                        //     papaya.interface.encodeFunctionData('bySig', [
                        //         walletAddress, signedCall, signature
                        //     ])
                        // )
                    ];
                    case 8:
                        signature = _f.sent();
                        // await this.contract.connect(this.wallet).permitAndCall(
                        //     ethers.solidityPacked(
                        //         ['address', 'bytes'],
                        //         [await token.getAddress(), permit]
                        //     ),
                        //     papaya.interface.encodeFunctionData('bySig', [
                        //         walletAddress, signedCall, signature
                        //     ])
                        // )
                        return [2 /*return*/, { Permit: { tokenAddress: tokenAddress, permit: permit }, Call: { walletAddress: walletAddress, signedCall: signedCall, signature: signature } }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigDepositFor = function (to_1, amount_1, deadline_1) {
        return __awaiter(this, arguments, void 0, function (to, amount, deadline, isPermit2) {
            var nonce, name, version, walletAddress, callTraits, signature, _a, _b;
            var _c;
            if (isPermit2 === void 0) { isPermit2 = false; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        walletAddress = this.wallet.address;
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('depositFor', [to, amount, isPermit2])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { walletAddress: walletAddress, callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.PermitAndBySigDepositFor = function (to_1, amount_1, deadline_1) {
        return __awaiter(this, arguments, void 0, function (to, amount, deadline, isPermit2) {
            var nonce, name, version, walletAddress, tokenAddress, permit, _a, _b, signedCall, signature, _c, _d;
            var _e;
            if (isPermit2 === void 0) { isPermit2 = false; }
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_f.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _f.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_f.sent()).toString();
                        walletAddress = this.wallet.address;
                        return [4 /*yield*/, this.token.getAddress()];
                    case 4:
                        tokenAddress = _f.sent();
                        _a = permit_1.createPermit;
                        _b = [this.wallet, this.token, '1', this.ChainId];
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, _b.concat([_f.sent(), amount, deadline]))];
                    case 6:
                        permit = _f.sent();
                        signedCall = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('deposit', [to, amount, isPermit2])
                        };
                        _d = (_c = this.wallet).signTypedData;
                        _e = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 7: return [4 /*yield*/, _d.apply(_c, [(_e.verifyingContract = _f.sent(), _e), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            signedCall])
                        // await this.contract.connect(this.wallet).permitAndCall(
                        //     ethers.solidityPacked(
                        //         ['address', 'bytes'],
                        //         [await token.getAddress(), permit]
                        //     ),
                        //     papaya.interface.encodeFunctionData('bySig', [
                        //         this.wallet.address, signedCall, signature
                        //     ])
                        // )
                    ];
                    case 8:
                        signature = _f.sent();
                        // await this.contract.connect(this.wallet).permitAndCall(
                        //     ethers.solidityPacked(
                        //         ['address', 'bytes'],
                        //         [await token.getAddress(), permit]
                        //     ),
                        //     papaya.interface.encodeFunctionData('bySig', [
                        //         this.wallet.address, signedCall, signature
                        //     ])
                        // )
                        return [2 /*return*/, { Permit: { tokenAddress: tokenAddress, permit: permit }, Call: { walletAddress: walletAddress, signedCall: signedCall, signature: signature } }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigWithdraw = function (amount, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('withdraw', [amount])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigWithdrawTo = function (to, amount, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('withdrawTo', [to, amount])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigPay = function (to, amount, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('pay', [to, amount])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigSubscribe = function (author, subscriptionRate, projectId, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('subscribe', [author, subscriptionRate, projectId])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigUnsubscribe = function (author, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('unsubscribe', [author])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.BySigLiquidate = function (account, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, name, version, callTraits, signature, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.contract.nonces(this.wallet.address)];
                    case 1:
                        nonce = (_d.sent()).toString();
                        return [4 /*yield*/, this.contract.name()];
                    case 2:
                        name = _d.sent();
                        return [4 /*yield*/, this.contract.version()];
                    case 3:
                        version = (_d.sent()).toString();
                        callTraits = {
                            traits: this.buildBySigTraits({ deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce }),
                            data: this.contract.interface.encodeFunctionData('liquidate', [account])
                        };
                        _b = (_a = this.wallet).signTypedData;
                        _c = { name: name, version: version, chainId: this.ChainId };
                        return [4 /*yield*/, this.contract.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [(_c.verifyingContract = _d.sent(), _c), { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes' }] },
                            callTraits])];
                    case 5:
                        signature = _d.sent();
                        return [2 /*return*/, { callTraits: callTraits, signature: signature }];
                }
            });
        });
    };
    PapayaBySig.prototype.buildBySigTraits = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.nonceType, nonceType = _c === void 0 ? 0n : _c, _d = _b.deadline, deadline = _d === void 0 ? 0n : _d, _e = _b.relayer, relayer = _e === void 0 ? solidity_utils_1.constants.ZERO_ADDRESS.toString() : _e, _f = _b.nonce, nonce = _f === void 0 ? 0n : _f;
            return __generator(this, function (_g) {
                if (nonceType > 3) {
                    throw new Error('Wrong nonce type, it should be less than 4');
                }
                if (deadline > 0xffffffffff) {
                    throw new Error('Wrong deadline, it should be less than 0xffffffff');
                }
                if (relayer.length > 42) {
                    throw new Error('Wrong relayer address, it should be less than 42 symbols');
                }
                if (nonce > 0xffffffffffffffffffffffffffffffffn) {
                    throw new Error('Wrong nonce, it should not be more than 128 bits');
                }
                return [2 /*return*/, (BigInt(nonceType) << 254n) +
                        (BigInt(deadline) << 208n) +
                        ((BigInt(relayer) & 0xffffffffffffffffffffn) << 128n) +
                        BigInt(nonce)];
            });
        });
    };
    return PapayaBySig;
}());
exports.PapayaBySig = PapayaBySig;
