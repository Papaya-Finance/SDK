import { PapayaAbstract } from "./PapayaAbstract";
import papayaABI from "./abi/Papaya.json";

export class PapayaInteraction extends PapayaAbstract {
    private papayaAddress: `0x${string}`;
    private secretKey: `0x${string}` | undefined;

    constructor(
        rpcUrl: string,
        papayaAddress: `0x${string}`,
        secretKey?: `0x${string}`
    ) {
        super(rpcUrl);
        this.papayaAddress = papayaAddress;
        this.secretKey = secretKey;
    }

    private async _createContract() {
        const contract = this.getContract(papayaABI.abi, this.papayaAddress);
        const runner = await this.getRunner(this.secretKey);
        contract.connect(runner);
        return contract;
    }

    async claimProjectId() {
        const contract = await this._createContract();
        let func = contract.getFunction("claimProjectId");
        return await func();
    }

    async setDefaultSettings(
        initialized = true,
        projectFee: number,
        projectId: number
    ) {
        const contract = await this._createContract();
        let func = contract.getFunction("setDefaultSettings");
        return await func({ initialized, projectFee }, projectId);
    }

    async setSettingsForUser(
        user: string,
        initialized = true,
        projectFee: number,
        projectId: number
    ) {
        const contract = await this._createContract();
        let func = contract.getFunction("setSettingsForUser");
        return await func(user, { initialized, projectFee }, projectId);
    }

    async deposit(amount: number, isPermit2 = false) {
        const contract = await this._createContract();
        let func = contract.getFunction("deposit");
        return await func(amount, isPermit2);
    }

    async depositFor(amount: number, to: string, isPermit2 = false) {
        const contract = await this._createContract();
        let func = contract.getFunction("depositFor");
        return await func(to, amount, isPermit2);
    }

    async withdraw(amount: number) {
        const contract = await this._createContract();
        let func = contract.getFunction("withdraw");
        return await func(amount);
    }

    async withdrawTo(to: string, amount: number) {
        const contract = await this._createContract();
        let func = contract.getFunction("withdrawTo");
        return await func(to, amount);
    }

    async pay(to: string, amount: number) {
        const contract = await this._createContract();
        let func = contract.getFunction("pay");
        return await func(to, amount);
    }

    async subscribe(
        author: string,
        subscriptionRate: number,
        projectId: number
    ) {
        const contract = await this._createContract();
        let func = contract.getFunction("subscribe");
        return await func(author, subscriptionRate, projectId);
    }

    async unsubscribe(author: string) {
        const contract = await this._createContract();
        let func = contract.getFunction("unsubscribe");
        return await func(author);
    }

    async liquidate(target: string) {
        const contract = await this._createContract();
        let func = contract.getFunction("liquidate");
        return await func(target);
    }
}
