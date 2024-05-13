import { constants } from '@1inch/solidity-utils'
import { ethers } from 'ethers';
import { createPermit } from '../helpers/permit';

const papayaABI = require('../abi/Papaya.json');
const erc20PermitABI = require('../abi/ERC20Permit.json')

export class PapayaBySig {
    NonceType = {
        Account: 0n,
        Selector: 1n,
        Unique: 2n,
    }

    customProvider: ethers.JsonRpcProvider
    contract: ethers.Contract

    wallet: ethers.Wallet
    token: ethers.Contract
    ChainId: bigint

    constructor(
        url: string,
        chainId: bigint,
        papayaAddress: string,
        tokenAddress: string,
        secretKey: string
    ) {
        this.customProvider = new ethers.JsonRpcProvider(url)
        this.wallet = new ethers.Wallet(secretKey, this.customProvider)
        this.contract = new ethers.Contract(papayaAddress, papayaABI.abi, this.wallet)

        this.token = new ethers.Contract(tokenAddress, erc20PermitABI.abi, this.wallet)
        this.ChainId = chainId
    }

    async BySigDeposit(
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('deposit', [amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async PermitAndDeposit(
        amount: bigint,
        deadline: bigint
    ){

        // console.log(this.contract, this.token)

        const permit = await createPermit(this.wallet, this.token, '1', this.ChainId, await this.contract.getAddress(), amount, deadline)

        const tokenAddress = await this.token.getAddress()

        console.log(ethers.solidityPacked(['address', 'bytes'], [tokenAddress, permit]))

        let func = this.contract.getFunction("permitAndCall")

        await func(
            ethers.solidityPacked(
            ['address', 'bytes'],
            [await this.token.getAddress(), permit]
            ),
            this.contract.interface.encodeFunctionData(
                'deposit',
                [amount, false]
            )
        )

        // await this.contract.connect(this.wallet).permitAndCall(
        //     ethers.solidityPacked(
        //         ['address', 'bytes'],
        //         [await this.token.getAddress(), permit]
        //     ),
        //     this.contract.interface.encodeFunctionData('deposit', [
        //         amount, false
        //     ])
        // )

        // return { tokenAddress, permit }
    }

    async PermitAndBySigDeposit(
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ){


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const tokenAddress = await this.token.getAddress()
        const walletAddress = this.wallet.address

        const permit = await createPermit(this.wallet, this.token, '1', this.ChainId, await this.contract.getAddress(), amount, deadline)

        const signedCall = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('deposit', [amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            signedCall
        )

        // await this.contract.connect(this.wallet).permitAndCall(
        //     ethers.solidityPacked(
        //         ['address', 'bytes'],
        //         [await token.getAddress(), permit]
        //     ),
        //     papaya.interface.encodeFunctionData('bySig', [
        //         walletAddress, signedCall, signature
        //     ])
        // )

        return { Permit: { tokenAddress, permit }, Call: { walletAddress, signedCall, signature } }
    }

    async BySigDepositFor(
        to: string,
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('depositFor', [to, amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { walletAddress, callTraits, signature }
    }

    async PermitAndBySigDepositFor(
        to: string,
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address
        const tokenAddress = await this.token.getAddress()

        const permit = await createPermit(this.wallet, this.token, '1', this.ChainId, await this.contract.getAddress(), amount, deadline)

        const signedCall = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('deposit', [to, amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            signedCall
        )

        // await this.contract.connect(this.wallet).permitAndCall(
        //     ethers.solidityPacked(
        //         ['address', 'bytes'],
        //         [await token.getAddress(), permit]
        //     ),
        //     papaya.interface.encodeFunctionData('bySig', [
        //         this.wallet.address, signedCall, signature
        //     ])
        // )

        return { Permit: { tokenAddress, permit }, Call: { walletAddress, signedCall, signature } }
    }

    async BySigWithdraw(
        amount: bigint,
        deadline: bigint,
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('withdraw', [amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async BySigWithdrawTo(
        to: string,
        amount: bigint,
        deadline: bigint,
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('withdrawTo', [to, amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async BySigPay(
        to: string,
        amount: bigint,
        deadline: bigint
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('pay', [to, amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async BySigSubscribe(
        author: string,
        subscriptionRate: bigint,
        projectId: bigint,
        deadline: bigint
    ) {

        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('subscribe', [author, subscriptionRate, projectId])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async BySigUnsubscribe(
        author: string,
        deadline: bigint
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('unsubscribe', [author])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async BySigLiquidate(
        account: string,
        deadline: bigint
    ) {


        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('liquidate', [account])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        return { callTraits, signature }
    }

    async buildBySigTraits({
        nonceType = 0n,
        deadline = 0n,
        relayer = constants.ZERO_ADDRESS.toString(),
        nonce = 0n,
    } = {}) {
        if (nonceType > 3) {
            throw new Error('Wrong nonce type, it should be less than 4');
        }
        if (deadline > 0xffffffffff) {
            throw new Error('Wrong deadline, it should be less than 0xffffffff');
        }
        if (relayer.length > 42) {
            throw new Error('Wrong relayer address, it should be less than 42 symbols');
        }
        if (nonce > 0xffffffffffffffffffffffffffffffffn) {
            throw new Error('Wrong nonce, it should not be more than 128 bits');
        }

        return (BigInt(nonceType) << 254n) +
                (BigInt(deadline) << 208n) +
                ((BigInt(relayer) & 0xffffffffffffffffffffn) << 128n) +
                BigInt(nonce);
    }
}
