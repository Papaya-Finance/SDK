import { ethers } from 'ethers';
export declare class PapayaBySig {
    NonceType: {
        Account: bigint;
        Selector: bigint;
        Unique: bigint;
    };
    customProvider: ethers.JsonRpcProvider;
    contract: ethers.Contract;
    wallet: ethers.Wallet;
    token: ethers.Contract;
    ChainId: bigint;
    constructor(url: string, chainId: bigint, papayaAddress: string, tokenAddress: string, secretKey: string);
    BySigDeposit(amount: bigint, deadline: bigint, isPermit2?: boolean): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    PermitAndDeposit(amount: bigint, deadline: bigint): Promise<void>;
    PermitAndBySigDeposit(amount: bigint, deadline: bigint, isPermit2?: boolean): Promise<{
        Permit: {
            tokenAddress: string;
            permit: string;
        };
        Call: {
            walletAddress: string;
            signedCall: {
                traits: Promise<bigint>;
                data: string;
            };
            signature: string;
        };
    }>;
    BySigDepositFor(to: string, amount: bigint, deadline: bigint, isPermit2?: boolean): Promise<{
        walletAddress: string;
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    PermitAndBySigDepositFor(to: string, amount: bigint, deadline: bigint, isPermit2?: boolean): Promise<{
        Permit: {
            tokenAddress: string;
            permit: string;
        };
        Call: {
            walletAddress: string;
            signedCall: {
                traits: Promise<bigint>;
                data: string;
            };
            signature: string;
        };
    }>;
    BySigWithdraw(amount: bigint, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    BySigWithdrawTo(to: string, amount: bigint, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    BySigPay(to: string, amount: bigint, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    BySigSubscribe(author: string, subscriptionRate: bigint, projectId: bigint, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    BySigUnsubscribe(author: string, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    BySigLiquidate(account: string, deadline: bigint): Promise<{
        callTraits: {
            traits: Promise<bigint>;
            data: string;
        };
        signature: string;
    }>;
    buildBySigTraits({ nonceType, deadline, relayer, nonce, }?: {
        nonceType?: bigint | undefined;
        deadline?: bigint | undefined;
        relayer?: string | undefined;
        nonce?: bigint | undefined;
    }): Promise<bigint>;
}
