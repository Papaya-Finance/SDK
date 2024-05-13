import { ethers } from 'ethers';
export declare class Getter {
    customProvider: ethers.JsonRpcProvider;
    contract: ethers.Contract;
    constructor(url: string, papayaAddress: string);
    allSubscriptions(user: string): Promise<any>;
    balanceOf(user: string): Promise<any>;
    getDefaultSettings(projectId: number): Promise<any>;
    getUserSettings(projectId: number, user: string): Promise<any>;
    getAllProjectOwners(): Promise<any>;
    getUser(user: string): Promise<any>;
    FLOOR(): Promise<any>;
    MAX_PROTOCOL_FEE(): Promise<any>;
    APPROX_LIQUIDATE_GAS(): Promise<any>;
    APPROX_SUBSCRIPTION_GAS(): Promise<any>;
    SUBSCRIPTION_THRESHOLD(): Promise<any>;
    COIN_PRICE_FEED(): Promise<any>;
    TOKEN_PRICE_FEED(): Promise<any>;
    TOKEN(): Promise<any>;
    DECIMALS_SCALE(): Promise<any>;
}
