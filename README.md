# Solana Token Sell Script for makenow.meme (Anchor / JavaScript)

This script allows you to sell SPL tokens purchased from the [makenow.meme](https://makenow.meme/en) platform directly on the Solana blockchain using the Anchor framework. It is specifically tailored to interact with the smart contract behind that platform, allowing users to reclaim their SOL by selling tokens even if the frontend becomes unavailable.

This is particularly useful in the **early stage of token launches**, when:

- Liquidity has **not yet been moved** to a public DEX like Raydium
- Your tokens are **stuck in the internal pool**
- The **frontend is broken** or offline

In such cases, users can no longer interact through the website and must use on-chain instructions directly.

---

## 🚀 Features

- Sell tokens purchased on makenow.meme via the smart contract
- Uses Anchor-compatible IDL to interact with the on-chain program
- Direct execution from Node.js (no browser required)
- Full control of wallet via `.env`
- Built-in error handling and logging

---

## 📦 Project Structure

```
solana-sell/
├── .env.example         # Environment variable template
├── idl.json             # Anchor IDL file of the makenow.meme smart contract (included)
├── sell.js              # Main JavaScript script to sell tokens
├── package.json         # Node.js dependencies and scripts
├── package-lock.json    # Dependency lock file
├── README.md            # Project documentation
└── LICENSE              # License file (MIT)
```


---

## 🛠️ Requirements

- Node.js (v18+ recommended)
- Yarn or npm
- A valid Solana wallet private key (Base58 format)

> ✅ The required `idl.json` file is already included in this repository. No need to fetch it manually.

---

## 🔐 Setup

1. **Clone the repo:**

```bash
git clone https://github.com/solanabrisa/makenowmeme-sell.git
cd makenowmeme-sell
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:**

Copy the provided `.env.example` to `.env` and fill in your base58 private key:

```
PRIVATE_KEY_BASE58=your_base58_secret_key_here
```

4. **Edit `sell.js`:**

Update:
- `ACCOUNT_ADDRESSES` → Insert your wallet/token account details
- `HUMAN_READABLE_AMOUNT` → Amounts of the token you want to sell

---

## 🧪 Run the Script

```bash
node sell.js
```

If successful, you will see:

```
🚀 Transaction sent! TX Hash: <hash>
🔗 View on Solscan: https://solscan.io/tx/<hash>
```

---

## 📄 License

This project is open-sourced under the MIT License.

---

## 🙏 Credits

This script was originally created to help users sell tokens acquired on makenow.meme when the platform UI became unavailable. If it helped you recover funds, feel free to share or improve it.

---

## 💡 Disclaimer

> This script is designed for a specific smart contract (makenow.meme) **in its pre-DEX liquidity stage**. It is not guaranteed to work with arbitrary DEX platforms. Use it at your own risk and test with small amounts first.

