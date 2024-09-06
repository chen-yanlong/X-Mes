// scripts/setup.js
const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
require('dotenv').config(); // Load environment variables

(async () => {
  try {
    const privateKey = process.env.PRIVATE_KEY; // Get private key from .env

    if (!privateKey) {
      throw new Error('Private key not found in .env file');
    }

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      account: privateKeyToAccount(privateKey),
    });

    const res = await client.createSchema({
      name: "XmesFriend",
      data: [
        { name: "friendAddress", type: "address" },
        { name: "chain", type: "string" },
        { name: "key", type: "string" },
        { name: "oappAddress", type: "address" }
      ],
    });

    console.log("Schema created:", res);
  } catch (error) {
    console.error("Error creating schema:", error);
  }
})();
