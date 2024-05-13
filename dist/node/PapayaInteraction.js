"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PapayaInteraction = void 0;
const ethers_1 = require("ethers");
const papayaABI = require('../abi/Papaya.json');
class PapayaInteraction {
    customProvider;
    contract;
    wallet;
    constructor(url, papayaAddress, secretKey) {
        this.customProvider = new ethers_1.ethers.JsonRpcProvider(url);
        this.wallet = new ethers_1.ethers.Wallet(secretKey, this.customProvider);
        this.contract = new ethers_1.ethers.Contract(papayaAddress, papayaABI.abi, this.wallet);
    }
    async claimProjectId() {
        let func = this.contract.getFunction("claimProjectId");
        return await func();
    }
    async setDefaultSettings(initialized = true, projectFee, projectId) {
        let func = this.contract.getFunction("setDefaultSettings");
        return await func({ initialized, projectFee }, projectId);
    }
    async setSettingsForUser(user, initialized = true, projectFee, projectId) {
        let func = this.contract.getFunction("setSettingsForUser");
        return await func(user, { initialized, projectFee }, projectId);
    }
    async deposit(amount, isPermit2 = false) {
        let func = this.contract.getFunction("deposit");
        return await func(amount, isPermit2);
    }
    async depositFor(amount, to, isPermit2 = false) {
        let func = this.contract.getFunction("depositFor");
        return await func(to, amount, isPermit2);
    }
    async withdraw(amount) {
        let func = this.contract.getFunction("withdraw");
        return await func(amount);
    }
    async withdrawTo(to, amount) {
        let func = this.contract.getFunction("withdrawTo");
        return await func(to, amount);
    }
    async pay(to, amount) {
        let func = this.contract.getFunction("pay");
        return await func(to, amount);
    }
    async subscribe(author, subscriptionRate, projectId) {
        let func = this.contract.getFunction("subscribe");
        return await func(author, subscriptionRate, projectId);
    }
    async unsubscribe(author) {
        let func = this.contract.getFunction("unsubscribe");
        return await func(author);
    }
    async liquidate(target) {
        let func = this.contract.getFunction("liquidate");
        return await func(target);
    }
}
exports.PapayaInteraction = PapayaInteraction;
module.exports = {
    PapayaInteraction
};
//# sourceMappingURL=PapayaInteraction.js.map