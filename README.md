# SDK

## Installation

```sh
npm install @papaya-finance/sdk
```

## Examples

###### Subscribe example

```ts
import { PapayaInteraction } from "@papaya-protocol/papaya-sdk";
import { JsonRpcProvider } from "ethers";

const papayaInteraction = new PapayaInteraction({
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    provider: new JsonRpcProvider("https://polygon.infura.io/v3/${INFURA_API_KEY}"),
    //secretKey: `${SECRET_KEY}` - you can specify wallet private key to sign transactions
})(async () => {
    // deposit tokens to Papaya contract
    const depositTransaction = await papayaInteraction.deposit(1 * 10 ** 18, false);
    // start streaming money to user(0.00001 token per second)
    const subscribeTransaction = await papayaInteraction.subscribe("0x1234567890123456789012345678901234567890", 1 * 10 ** 13, 0);
})();
```

###### Subscribe example using signature

```ts
import { PapayaBySigInteraction } from "@papaya-protocol/papaya-sdk"
import { JsonRpcProvider } from "ethers";

const papayaBySigInteraction = new PapayaBySigInteraction({
    chainId: 1,
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    tokenAddress: "0x1234567890123456789012345678901234567890",
    provider: new JsonRpcProvider("https://polygon.infura.io/v3/${INFURA_API_KEY}"),
    //secretKey: `${SECRET_KEY}` - you can specify wallet private key to sign transactions
})

(async () => {
    // deposit tokens to Papaya contract with. <TIMESTAMP> is date when signature will be expired
    const depositTransaction = await papayaBySigInteraction.bySigDeposit(
        1*(10**18),
        <TIMESTAMP>,
        false
    )
    // start streaming money to user(0.00001 token per second). <TIMESTAMP> is date when signature will be expired
    const subscribeTransaction = await papayaBySigInteraction.bySigSubscribe(
        "0x1234567890123456789012345678901234567890",
        1*(10**13),
        0,
        <TIMESTAMP>
    )
})()
```

> When using SDK in browser `window.ethereum` provider is taken
