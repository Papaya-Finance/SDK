import { ethers } from "ethers";
import { PapayaAbstract } from "./PapayaAbstract";
import papayaABI from "./abi/Papaya.json";

interface IContructor {
    papayaAddress: `0x${string}`;
    rpcUrl?: string;
}

export class PapayaGetter extends PapayaAbstract {
    private contract: ethers.Contract;

    constructor({ rpcUrl, papayaAddress }: IContructor) {
        super(rpcUrl);
        this.contract = this.getContract(
            papayaABI.abi,
            papayaAddress,
            this.provider
        );
    }

    async allSubscriptions(
        user: string
    ): Promise<{ address: string[]; encodedRates: BigInt[] }> {
        return await this.contract.allSubscriptions(user);
    }

    async balanceOf(user: string): Promise<BigInt> {
        return await this.contract.balanceOf(user);
    }

    async getDefaultSettings(
        projectId: number
    ): Promise<{ initialized: boolean; projectFee: BigInt }> {
        return await this.contract.defaultSettings(projectId);
    }

    async getUserSettings(
        projectId: number,
        user: string
    ): Promise<{ initialized: boolean; projectFee: BigInt }> {
        return await this.contract.userSettings(projectId, user);
    }

    async getAllProjectOwners(): Promise<string[]> {
        return await this.contract.allProjectOwners();
    }

    async getUser(user: string): Promise<{
        balance: BigInt;
        incomeRate: BigInt;
        outgoingRate: BigInt;
        updated: BigInt;
    }> {
        return await this.contract.users(user);
    }

    async FLOOR(): Promise<BigInt> {
        return await this.contract.FLOOR();
    }

    async MAX_PROTOCOL_FEE(): Promise<BigInt> {
        return await this.contract.MAX_PROTOCOL_FEE();
    }

    async APPROX_LIQUIDATE_GAS(): Promise<BigInt> {
        return await this.contract.APPROX_LIQUIDATE_GAS();
    }

    async APPROX_SUBSCRIPTION_GAS(): Promise<BigInt> {
        return await this.contract.APPROX_SUBSCRIPTION_GAS();
    }

    async SUBSCRIPTION_THRESHOLD(): Promise<BigInt> {
        return await this.contract.SUBSCRIPTION_THRESHOLD();
    }

    async COIN_PRICE_FEED(): Promise<string> {
        return await this.contract.COIN_PRICE_FEED();
    }

    async TOKEN_PRICE_FEED(): Promise<string> {
        return await this.contract.TOKEN_PRICE_FEED();
    }

    async TOKEN(): Promise<string> {
        return await this.contract.TOKEN();
    }

    async DECIMALS_SCALE(): Promise<BigInt> {
        return await this.contract.DECIMALS_SCALE();
    }
}
