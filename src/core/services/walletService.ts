import { Connection, Transaction, PublicKey } from "@solana/web3.js";
import { LAMPORTS_IN_SOL } from "@/core/constants";

declare global {
  interface Window { enkrypt: any }
}

export default class WalletService {
  private static instance: WalletService;

  private connection: Connection | undefined;

  static getInstance() {
    if (this.instance != null) {
      return this.instance;
    }
    this.instance = new WalletService();
    return this.instance;
  }

  init = async () => {
    this.connection = new Connection(import.meta.env.VITE_SOLANA_RPC);
  }

  loadBalance = async (address: string) => {
    if (this.connection) {
      const wallet = new PublicKey(address);
      const balance = await this.connection.getBalance(wallet);
      const solBalance = balance / LAMPORTS_IN_SOL;

      return solBalance;
    } else {
      return null;
    }
  }

  getTransactionFee = async (transaction: Transaction) => {
    if (this.connection) {
      const response = await this.connection.getFeeForMessage(
        transaction.compileMessage(),
        'confirmed',
      );
      return response.value;
    }
  }

  getTxStatus = async (signature: string) => {
    const txStatus = await this.connection?.getSignatureStatus(signature);
    return txStatus;
  }
};