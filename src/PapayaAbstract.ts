import { BrowserProvider, ethers } from "ethers";
import { isNode } from "./utils";

export abstract class PapayaAbstract {
    protected provider: ethers.Provider;

    constructor(rpcUrl?: string) {
        if (isNode()) this.provider = new ethers.JsonRpcProvider(rpcUrl);
        //@ts-expect-error there is no window.ethereum in nodejs env
        else this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    protected getContract(
        abi: ethers.Interface | ethers.InterfaceAbi,
        address: `0x${string}`,
        runner?: ethers.ContractRunner
    ) {
        return new ethers.Contract(address, abi, runner);
    }

    protected async getRunner(
        privateKey?: `0x${string}`
    ): Promise<ethers.Wallet | ethers.JsonRpcSigner> {
        if (this.provider instanceof BrowserProvider)
            return await this.provider.getSigner();
        if (!privateKey)
            throw Error(
                "Private key must be specified when using nodejs environment"
            );
        return new ethers.Wallet(privateKey, this.provider);
    }
}
