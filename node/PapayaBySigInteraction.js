const { constants } = require ("@1inch/solidity-utils")
const { ethers } = require ("ethers")
const { createPermit } = require ("../helpers/permit")

const papayaABI = require('../abi/Papaya.json');
const erc20PermitABI = require('../abi/ERC20Permit.json')

class PapayaBySig {
    NonceType = {
        Account: 0n,
        Selector: 1n,
        Unique: 2n,
    }

    customProvider
    contract

    wallet
    token
    ChainId

    constructor(
        url,
        chainId,
        papayaAddress,
        tokenAddress,
        secretKey
    ) {
        this.customProvider = new ethers.JsonRpcProvider(url)
        this.wallet = new ethers.Wallet(secretKey, this.customProvider)
        this.contract = new ethers.Contract(papayaAddress, papayaABI.abi, this.wallet)

        this.token = new ethers.Contract(tokenAddress, erc20PermitABI.abi, this.wallet)
        this.ChainId = chainId
    }

    async BySigDeposit(
        amount,
        deadline,
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
        amount,
        deadline
    ){
        const permit = await createPermit(
            this.wallet,
            this.token,
            await this.token.version(),
            this.ChainId,
            await this.contract.getAddress(),
            amount,
            deadline
        )

        let permitAndCall = this.contract.getFunction("permitAndCall")

        let tx = await permitAndCall(
            ethers.solidityPacked(
            ['address', 'bytes'],
            [await this.token.getAddress(), permit]
            ),
            this.contract.interface.encodeFunctionData(
                'deposit',
                [amount, false]
            )
        )

        return tx
    }

    async PermitAndBySigDeposit(
        amount,
        deadline,
        isPermit2 = false
    ){
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const tokenAddress = await this.token.getAddress()
        const walletAddress = this.wallet.address

        const permit = await createPermit(
            this.wallet,
            this.token,
            await this.token.version(),
            this.ChainId,
            await this.contract.getAddress(),
            amount,
            deadline
        )

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('deposit', [amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let permitAndCall = this.contract.getFunction("permitAndCall")

        let tx = await permitAndCall(
            ethers.solidityPacked(
                ['address', 'bytes'],
                [await this.token.getAddress(), permit]
            ),
            this.contract.interface.encodeFunctionData('bySig', [
                walletAddress, callTraits, signature
            ])
        )

        return tx
    }

    async BySigDepositFor(
        to,
        amount,
        deadline,
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

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async PermitAndBySigDepositFor(
        to,
        amount,
        deadline,
        isPermit2 = false
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const permit = await createPermit(
            this.wallet,
            this.token,
            await this.token.version(),
            this.ChainId,
            await this.contract.getAddress(),
            amount,
            deadline
        )

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('depositFor', [to, amount, isPermit2])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let permitAndCall = this.contract.getFunction("permitAndCall")

        let tx = await permitAndCall(
            ethers.solidityPacked(
                ['address', 'bytes'],
                [await this.token.getAddress(), permit]
            ),
            this.contract.interface.encodeFunctionData('bySig', [
                walletAddress, callTraits, signature
            ])
        )

        return tx
    }

    async BySigWithdraw(
        amount,
        deadline,
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('withdraw', [amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async BySigWithdrawTo(
        to,
        amount,
        deadline,
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('withdrawTo', [to, amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )
        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async BySigPay(
        to,
        amount,
        deadline
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('pay', [to, amount])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async BySigSubscribe(
        author,
        subscriptionRate,
        projectId,
        deadline
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('subscribe', [author, subscriptionRate, projectId])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async BySigUnsubscribe(
        author,
        deadline
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('unsubscribe', [author])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
    }

    async BySigLiquidate(
        account,
        deadline
    ) {
        const nonce = (await this.contract.nonces(this.wallet.address)).toString()
        const name = await this.contract.name()
        const version = (await this.contract.version()).toString()

        const walletAddress = this.wallet.address

        const callTraits = {
            traits: this.buildBySigTraits({deadline: deadline, nonceType: this.NonceType.Selector, nonce: nonce}),
            data: this.contract.interface.encodeFunctionData('liquidate', [account])
        }

        const signature = await this.wallet.signTypedData(
            { name: name, version: version, chainId: this.ChainId, verifyingContract: await this.contract.getAddress() },
            { SignedCall: [{ name: 'traits', type: 'uint256' }, { name: 'data', type: 'bytes'}] },
            callTraits
        )

        let bySig = this.contract.getFunction("bySig")

        let tx = await bySig(walletAddress, callTraits, signature)

        return tx
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

module.exports = {
    PapayaBySig
}
