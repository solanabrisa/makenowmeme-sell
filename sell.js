require('dotenv').config();
const anchor = require('@coral-xyz/anchor');
const bs58 = require('bs58');
const fs = require('fs');

const { PublicKey } = anchor.web3;

// ====== ✨ User Configuration Section ======

// Token decimal (usually 6 or 9 depending on your SPL token)
const TOKEN_DECIMALS = 6;

// Amount to sell (human readable amount)
const HUMAN_READABLE_AMOUNT = 10000; // 👈 Change to the amount of tokens you want to sell

// Smart contract program ID (fixed)
const PROGRAM_ID = "G8Jeqq2C7vkvCEAsz2K3vymzcPFJNxUsQ5YN9eLBLRud";

// Required accounts - fill in missing fields with your own addresses
const ACCOUNT_ADDRESSES = {
  config: "3b7ZaViXj6entcRC3o3dz9ZmGSPGrFGaEx5y9fBmaqi7", // ✅ Fixed config PDA
  mint: "",                 // 👈 Replace with your token mint address
  bondingCurve: "",         // 👈 Replace with bonding curve account
  associateBondingCurve: "",// 👈 Replace with ATA of bonding curve
  associateUser: "",        // 👈 Replace with your token account
  feeReceiver: "CJFY81Zom7BpZ66xieAHk3hW43Jru9KmgCBe1eKnWUMi", // ✅ Fixed
  fund: "CJFY81Zom7BpZ66xieAHk3hW43Jru9KmgCBe1eKnWUMi",        // ✅ Fixed
  master: "",               // 👈 Replace with your master (or leave default if not used)
  leader: "",               // 👈 Replace with your leader (or leave default if not used)
  referral: "",             // 👈 Replace with referral account (optional)
  systemProgram: "11111111111111111111111111111111", // ✅ System program (fixed)
  tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // ✅ Token program (fixed)
  associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" // ✅ Associated token program (fixed)
};

// ====== 🔐 Load Private Key from .env ======

const base58SecretKey = process.env.PRIVATE_KEY_BASE58;
if (!base58SecretKey) {
  console.error("❌ Missing PRIVATE_KEY_BASE58 in .env file");
  process.exit(1);
}

let wallet;
try {
  const secretKey = bs58.decode(base58SecretKey);
  wallet = anchor.web3.Keypair.fromSecretKey(secretKey);
  console.log("✅ Wallet loaded:", wallet.publicKey.toBase58());
} catch (err) {
  console.error("❌ Invalid private key format:", err.message);
  process.exit(1);
}

// ====== 🔗 Setup Provider ======

const connection = new anchor.web3.Connection("https://api.mainnet-beta.solana.com");
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {});
console.log("👛 Provider Wallet:", provider?.wallet?.publicKey?.toBase58?.() || "❌ Invalid provider wallet");
anchor.setProvider(provider);

// ====== 📦 Load IDL ======

let idl;
try {
  idl = JSON.parse(fs.readFileSync('./idl.json'));
  if (!idl.instructions) throw new Error("Missing instructions in IDL");
  console.log("✅ IDL loaded");
} catch (err) {
  console.error("❌ Failed to read idl.json:", err.message);
  process.exit(1);
}

// ====== 🎯 Initialize Program ======

let program;
try {
  program = new anchor.Program(idl);
  console.log("✅ Anchor Program initialized");
} catch (err) {
  console.error("❌ Failed to initialize Anchor Program:", err);
  process.exit(1);
}

// ====== 🧾 Build Accounts Object ======

function safeKey(label, value) {
  try {
    const pk = new anchor.web3.PublicKey(value);
    console.log(`✅ ${label}: ${pk.toBase58()}`);
    return pk;
  } catch (e) {
    console.error(`❌ Invalid PublicKey for ${label}:`, value);
    throw e;
  }
}

const accounts = {
  seller: wallet.publicKey,
  ...Object.fromEntries(Object.entries(ACCOUNT_ADDRESSES).map(([key, val]) => [key, safeKey(key, val)]))
};

// ====== 💰 Convert Human Amount to Token Units ======

const amountToken = new anchor.BN(HUMAN_READABLE_AMOUNT * (10 ** TOKEN_DECIMALS));

// ====== 🚀 Send Transaction ======

(async () => {
  try {
    const tx = await program.methods
      .sell(amountToken)
      .accounts(accounts)
      .signers([wallet])
      .rpc();

    console.log("🚀 Transaction sent! TX Hash:", tx);
    console.log(`🔗 View on Solscan: https://solscan.io/tx/${tx}`);
  } catch (err) {
    console.error("❌ Transaction failed:", err);
  }
})();