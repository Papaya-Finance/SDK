import { ethers } from 'ethers'
const papayaABI = require('../abi/Papaya.json');

export class PapayaInteraction {
    customProvider: ethers.JsonRpcProvider
    contract: ethers.Contract
    wallet: ethers.Wallet

    constructor(url: string, papayaAddress: string, secretKey: string) {
        this.customProvider = new ethers.JsonRpcProvider(url)
        this.wallet = new ethers.Wallet(secretKey, this.customProvider)

        this.contract = new ethers.Contract(papayaAddress, papayaABI.abi, this.wallet)
    }

    async claimProjectId() {
        let func = this.contract.getFunction("claimProjectId")
        return await func()
    }

    async setDefaultSettings(initialized = true, projectFee: number, projectId: number) {
        let func = this.contract.getFunction("setDefaultSettings")
        return await func({initialized, projectFee}, projectId)
    }

    async setSettingsForUser(user: string, initialized = true, projectFee: number, projectId: number) {
        let func = this.contract.getFunction("setSettingsForUser")
        return await func(user, {initialized, projectFee}, projectId)
    }

    async deposit(amount: number, isPermit2 = false) {
        let func = this.contract.getFunction("deposit")
        return await func(amount, isPermit2)
    }

    async depositFor(amount: number, to: string, isPermit2 = false) {
        let func = this.contract.getFunction("depositFor")
        return await func(to, amount, isPermit2)
    }

    async withdraw(amount: number) {
        let func = this.contract.getFunction("withdraw")
        return await func(amount)
    }

    async withdrawTo(to: string, amount: number) {
        let func = this.contract.getFunction("withdrawTo")
        return await func(to, amount)
    }

    async pay(to: string, amount: number) {
        let func = this.contract.getFunction("pay")
        return await func(to, amount)
    }

    async subscribe(author: string, subscriptionRate: number, projectId: number) {
        let func = this.contract.getFunction("subscribe")
        return await func(author, subscriptionRate, projectId)
    }

    async unsubscribe(author: string) {
        let func = this.contract.getFunction("unsubscribe")
        return await func(author)
    }

    async liquidate(target: string) {
        let func = this.contract.getFunction("liquidate")
        return await func(target)
    }
}

module.exports = {
    PapayaInteraction
}
