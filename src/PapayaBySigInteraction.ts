import { constants } from "@1inch/solidity-utils";
import { ethers, JsonRpcSigner, Wallet } from "ethers";
import { createPermit } from "./utils";
import papayaABI from "./abi/Papaya.json";
import erc20PermitABI from "./abi/ERC20Permit.json";
import { PapayaAbstract } from "./PapayaAbstract";

export class PapayaBySigInteraction extends PapayaAbstract {
    private nonceType = {
        Account: 0n,
        Selector: 1n,
        Unique: 2n,
    };
    private chainId: number;
    private papayaAddress: `0x${string}`;
    private tokenAddress: `0x${string}`;
    private secretKey: `0x${string}` | undefined;

    constructor(
        rpcUrl: string,
        papayaAddress: `0x${string}`,
        tokenAddress: `0x${string}`,
        chainId: number,
        secretKey?: `0x${string}`
    ) {
        super(rpcUrl);
        this.papayaAddress = papayaAddress;
        this.tokenAddress = tokenAddress;
        this.secretKey = secretKey;
        this.chainId = chainId;
    }

    async bySigDeposit(amount: bigint, deadline: bigint, isPermit2 = false) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("deposit", [
                amount,
                isPermit2,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        return { callTraits, signature };
    }

    async permitAndDeposit(amount: bigint, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const tokenContract = await this._createTokenContract();
        const runner = await this.getRunner(this.secretKey);

        const permit = await createPermit(
            runner as Wallet,
            tokenContract,
            await tokenContract.version(),
            this.chainId,
            await papayaContract.getAddress(),
            amount.toString(),
            deadline.toString()
        );

        let permitAndCall = papayaContract.getFunction("permitAndCall");

        let tx = await permitAndCall(
            ethers.solidityPacked(
                ["address", "bytes"],
                [await tokenContract.getAddress(), permit]
            ),
            papayaContract.interface.encodeFunctionData("deposit", [
                amount,
                false,
            ])
        );

        return tx;
    }

    async permitAndBySigDeposit(
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {
        const papayaContract = await this._createPapayaContract();
        const tokenContract = await this._createTokenContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const permit = await createPermit(
            runner as Wallet,
            tokenContract,
            await tokenContract.version(),
            this.chainId,
            await papayaContract.getAddress(),
            amount.toString(),
            deadline.toString()
        );

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("deposit", [
                amount,
                isPermit2,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let permitAndCall = papayaContract.getFunction("permitAndCall");

        let tx = await permitAndCall(
            ethers.solidityPacked(
                ["address", "bytes"],
                [await tokenContract.getAddress(), permit]
            ),
            papayaContract.interface.encodeFunctionData("bySig", [
                address,
                callTraits,
                signature,
            ])
        );

        return tx;
    }

    async bySigDepositFor(
        to: string,
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("depositFor", [
                to,
                amount,
                isPermit2,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(address, callTraits, signature);

        return tx;
    }

    async permitAndBySigDepositFor(
        to: string,
        amount: bigint,
        deadline: bigint,
        isPermit2 = false
    ) {
        const papayaContract = await this._createPapayaContract();
        const tokenContract = await this._createTokenContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const permit = await createPermit(
            runner as Wallet,
            tokenContract,
            await tokenContract.version(),
            this.chainId,
            await papayaContract.getAddress(),
            amount.toString(),
            deadline.toString()
        );

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("depositFor", [
                to,
                amount,
                isPermit2,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let permitAndCall = papayaContract.getFunction("permitAndCall");

        let tx = await permitAndCall(
            ethers.solidityPacked(
                ["address", "bytes"],
                [await tokenContract.getAddress(), permit]
            ),
            papayaContract.interface.encodeFunctionData("bySig", [
                walletAddress,
                callTraits,
                signature,
            ])
        );

        return tx;
    }

    async bySigWithdraw(amount: bigint, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("withdraw", [
                amount,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    async bySigWithdrawTo(to: string, amount: bigint, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("withdrawTo", [
                to,
                amount,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );
        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    async bySigPay(to: string, amount: bigint, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("pay", [
                to,
                amount,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    async bySigSubscribe(
        author: string,
        subscriptionRate: bigint,
        projectId: number,
        deadline: bigint
    ) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("subscribe", [
                author,
                subscriptionRate,
                projectId,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    async bySigUnsubscribe(author: string, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("unsubscribe", [
                author,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    async bySigLiquidate(account: string, deadline: bigint) {
        const papayaContract = await this._createPapayaContract();
        const runner = await this.getRunner(this.secretKey);
        const address = await this._getAddress();

        const nonce = (await papayaContract.nonces(address)).toString();
        const name = await papayaContract.name();
        const version = (await papayaContract.version()).toString();

        const walletAddress = address;

        const callTraits = {
            traits: this._buildBySigTraits({
                deadline: deadline,
                nonceType: this.nonceType.Selector,
                nonce: nonce,
            }),
            data: papayaContract.interface.encodeFunctionData("liquidate", [
                account,
            ]),
        };

        const signature = await runner.signTypedData(
            {
                name: name,
                version: version,
                chainId: this.chainId,
                verifyingContract: await papayaContract.getAddress(),
            },
            {
                SignedCall: [
                    { name: "traits", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            },
            callTraits
        );

        let bySig = papayaContract.getFunction("bySig");

        let tx = await bySig(walletAddress, callTraits, signature);

        return tx;
    }

    private async _createPapayaContract() {
        const contract = this.getContract(papayaABI.abi, this.papayaAddress);
        const runner = await this.getRunner(this.secretKey);
        contract.connect(runner);
        return contract;
    }

    private async _createTokenContract() {
        const contract = this.getContract(
            erc20PermitABI.abi,
            this.tokenAddress
        );
        const runner = await this.getRunner(this.secretKey);
        contract.connect(runner);
        return contract;
    }

    private async _getAddress() {
        const runner = await this.getRunner(this.secretKey);
        if (runner instanceof JsonRpcSigner) return await runner.getAddress();
        return runner.address;
    }

    private async _buildBySigTraits({
        nonceType = 0n,
        deadline = 0n,
        relayer = constants.ZERO_ADDRESS.toString(),
        nonce = 0n,
    } = {}) {
        if (nonceType > 3) {
            throw new Error("Wrong nonce type, it should be less than 4");
        }
        if (deadline > 0xffffffffff) {
            throw new Error(
                "Wrong deadline, it should be less than 0xffffffff"
            );
        }
        if (relayer.length > 42) {
            throw new Error(
                "Wrong relayer address, it should be less than 42 symbols"
            );
        }
        if (nonce > 0xffffffffffffffffffffffffffffffffn) {
            throw new Error("Wrong nonce, it should not be more than 128 bits");
        }

        return (
            (BigInt(nonceType) << 254n) +
            (BigInt(deadline) << 208n) +
            ((BigInt(relayer) & 0xffffffffffffffffffffn) << 128n) +
            BigInt(nonce)
        );
    }
}
