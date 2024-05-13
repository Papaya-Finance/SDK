"use strict";
const { getPermit } = require("@1inch/solidity-utils");
async function createPermit(signer, token, tokenVersion, chainId, spender, amount, deadline) {
    return await getPermit(signer, token, tokenVersion, chainId, spender, amount, deadline);
}
module.exports = {
    createPermit
};
//# sourceMappingURL=permit.js.map