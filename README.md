# SDK

## Installation

```sh
npm install @papaya-finance/sdk
```

## Examples

The use of interaction methods has some differences depending on the execution environment.

#### Using in Browser

When using SDK in browser environment there is no need to specify `secretKey` and `rpcUrl` is optional.

###### Subscribe example

```ts
import { PapayaInteraction } from "@papaya-metaverse/papaya-sdk";
import { PapayaBySigInteraction } from "@papaya-metaverse/papaya-sdk";

const papayaInteraction = new PapayaInteraction({
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    rpcUrl: "https://polygon.infura.io/v3/${INFURA_API_KEY}",
})(async () => {
    // deposit tokens to Papaya contract
    const depositTransaction = await papayaInteraction.deposit(1 * 10 ** 18, false);
    // start streaming money to user(0.00001 token per second)
    const subscribeTransaction = await papayaInteraction.subscribe("0x1234567890123456789012345678901234567890", 1 * 10 ** 13, 0);
})();
```

###### Subscribe example using signature

```ts
const papayaBySigInteraction = new PapayaBySigInteraction({
    chainId: 1,
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    tokenAddress: "0x1234567890123456789012345678901234567890",
    rpcUrl: "https://polygon.infura.io/v3/${INFURA_API_KEY}",
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

#### Using in NodeJS

When using SDK in NodeJS environment `secretKey` and `rpcUrl` are required.

###### Subscribe example

```ts
import { PapayaInteraction } from "@papaya-metaverse/papaya-sdk";
import { PapayaBySigInteraction } from "@papaya-metaverse/papaya-sdk";

const papayaInteraction = new PapayaInteraction({
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    rpcUrl: "https://polygon.infura.io/v3/${INFURA_API_KEY}",
    secretKey: "<WALLET_PRIVATE_KEY>",
})(async () => {
    // deposit tokens to Papaya contract
    const depositTransaction = await papayaInteraction.deposit(1 * 10 ** 18, false);
    // start streaming money to user(0.00001 token per second)
    const subscribeTransaction = await papayaInteraction.subscribe("0x1234567890123456789012345678901234567890", 1 * 10 ** 13, 0);
})();
```

###### Subscribe example using signature

```ts
const papayaBySigInteraction = new PapayaBySigInteraction({
    chainId: 1,
    papayaAddress: "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff",
    tokenAddress: "0x1234567890123456789012345678901234567890",
    rpcUrl: "https://polygon.infura.io/v3/${INFURA_API_KEY}",
    secretKey: "<WALLET_PRIVATE_KEY>"
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
