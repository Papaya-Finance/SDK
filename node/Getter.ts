import { ethers } from 'ethers';

const papayaABI = require('../abi/Papaya.json');

export class Getter {
    customProvider: ethers.JsonRpcProvider
    contract: ethers.Contract

    constructor(url: string, papayaAddress: string) {
        this.customProvider = new ethers.JsonRpcProvider(url)
        this.contract = new ethers.Contract(papayaAddress, papayaABI.abi, this.customProvider)
    }

    async allSubscriptions(user: string) {
        return await this.contract.allSubscriptions(user)
    }

    async balanceOf(user: string) {
        return await this.contract.balanceOf(user)
    }

    async getDefaultSettings(projectId: number) {
        return await this.contract.defaultSettings(projectId)
    }

    async getUserSettings(projectId: number, user: string) {
        return await this.contract.userSettings(projectId, user)
    }

    async getAllProjectOwners() {
        return await this.contract.allProjectOwners()
    }

    async getUser(user: string) {
        return await this.contract.users(user)
    }

    async FLOOR() {
        return await this.contract.FLOOR()
    }

    async MAX_PROTOCOL_FEE() {
        return await this.contract.MAX_PROTOCOL_FEE()
    }

    async APPROX_LIQUIDATE_GAS() {
        return await this.contract.APPROX_LIQUIDATE_GAS()
    }

    async APPROX_SUBSCRIPTION_GAS() {
        return await this.contract.APPROX_SUBSCRIPTION_GAS()
    }

    async SUBSCRIPTION_THRESHOLD() {
        return await this.contract.SUBSCRIPTION_THRESHOLD()
    }

    async COIN_PRICE_FEED() {
        return await this.contract.COIN_PRICE_FEED()
    }

    async TOKEN_PRICE_FEED() {
        return await this.contract.TOKEN_PRICE_FEED()
    }

    async TOKEN() {
        return await this.contract.TOKEN()
    }

    async DECIMALS_SCALE() {
        return await this.contract.DECIMALS_SCALE()
    }
}

module.exports = {
    Getter
}
