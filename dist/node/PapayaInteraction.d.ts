import { ethers } from 'ethers';
export declare class PapayaInteraction {
    customProvider: ethers.JsonRpcProvider;
    contract: ethers.Contract;
    wallet: ethers.Wallet;
    constructor(url: string, papayaAddress: string, secretKey: string);
    claimProjectId(): Promise<any>;
    setDefaultSettings(initialized: boolean | undefined, projectFee: number, projectId: number): Promise<any>;
    setSettingsForUser(user: string, initialized: boolean | undefined, projectFee: number, projectId: number): Promise<any>;
    deposit(amount: number, isPermit2?: boolean): Promise<any>;
    depositFor(amount: number, to: string, isPermit2?: boolean): Promise<any>;
    withdraw(amount: number): Promise<any>;
    withdrawTo(to: string, amount: number): Promise<any>;
    pay(to: string, amount: number): Promise<any>;
    subscribe(author: string, subscriptionRate: number, projectId: number): Promise<any>;
    unsubscribe(author: string): Promise<any>;
    liquidate(target: string): Promise<any>;
}
