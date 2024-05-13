"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Getter = void 0;
const ethers_1 = require("ethers");
const papayaABI = require('../abi/Papaya.json');
class Getter {
    customProvider;
    contract;
    constructor(url, papayaAddress) {
        this.customProvider = new ethers_1.ethers.JsonRpcProvider(url);
        this.contract = new ethers_1.ethers.Contract(papayaAddress, papayaABI.abi, this.customProvider);
    }
    async allSubscriptions(user) {
        return await this.contract.allSubscriptions(user);
    }
    async balanceOf(user) {
        return await this.contract.balanceOf(user);
    }
    async getDefaultSettings(projectId) {
        return await this.contract.defaultSettings(projectId);
    }
    async getUserSettings(projectId, user) {
        return await this.contract.userSettings(projectId, user);
    }
    async getAllProjectOwners() {
        return await this.contract.allProjectOwners();
    }
    async getUser(user) {
        return await this.contract.users(user);
    }
    async FLOOR() {
        return await this.contract.FLOOR();
    }
    async MAX_PROTOCOL_FEE() {
        return await this.contract.MAX_PROTOCOL_FEE();
    }
    async APPROX_LIQUIDATE_GAS() {
        return await this.contract.APPROX_LIQUIDATE_GAS();
    }
    async APPROX_SUBSCRIPTION_GAS() {
        return await this.contract.APPROX_SUBSCRIPTION_GAS();
    }
    async SUBSCRIPTION_THRESHOLD() {
        return await this.contract.SUBSCRIPTION_THRESHOLD();
    }
    async COIN_PRICE_FEED() {
        return await this.contract.COIN_PRICE_FEED();
    }
    async TOKEN_PRICE_FEED() {
        return await this.contract.TOKEN_PRICE_FEED();
    }
    async TOKEN() {
        return await this.contract.TOKEN();
    }
    async DECIMALS_SCALE() {
        return await this.contract.DECIMALS_SCALE();
    }
}
exports.Getter = Getter;
module.exports = {
    Getter
};
//# sourceMappingURL=Getter.js.map