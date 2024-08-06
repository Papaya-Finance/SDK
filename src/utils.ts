import { getPermit } from "@1inch/solidity-utils";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Wallet } from "ethers";

export const isNode = () =>
    typeof process !== "undefined" &&
    !!process.versions &&
    !!process.versions.node;

export async function createPermit(
    signer: Wallet | HardhatEthersSigner,
    token: any,
    tokenVersion: string,
    chainId: number,
    spender: string,
    amount: string,
    deadline: string
) {
    return await getPermit(
        signer,
        token,
        tokenVersion,
        chainId,
        spender,
        amount,
        deadline
    );
}
