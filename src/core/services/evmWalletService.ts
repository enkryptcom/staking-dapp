import { ethers } from "ethers";

import { MIN_BALANCE_EVM } from "../constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default class EvmWalletService {
  private static instance: EvmWalletService;

  private provider: ethers.providers.Web3Provider | undefined;

  private readonly rpcProvider: ethers.providers.JsonRpcProvider;

  private readonly rootstockRpc = import.meta.env.VITE_ROOTSTOCK_RPC as string;

  private constructor() {
    this.rpcProvider = new ethers.providers.JsonRpcProvider(this.rootstockRpc);
  }

  static getInstance() {
    if (this.instance != null) {
      return this.instance;
    }
    this.instance = new EvmWalletService();
    return this.instance;
  }

  getWeb3Provider() {
    return this.provider;
  }

  getRpcProvider() {
    return this.provider ?? this.rpcProvider;
  }

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error("EVM wallet provider not detected");
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await this.ensureRootstockNetwork();

    const accounts: string[] = await this.provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      throw new Error("No accounts found");
    }

    return ethers.utils.getAddress(accounts[0]);
  }

  async ensureRootstockNetwork() {
    if (!this.provider) {
      return;
    }

    const targetChainId = Number(import.meta.env.VITE_ROOTSTOCK_CHAIN_ID ?? 30);
    const hexChainId = `0x${targetChainId.toString(16)}`;

    try {
      await this.provider.send("wallet_switchEthereumChain", [{ chainId: hexChainId }]);
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        await this.provider.send("wallet_addEthereumChain", [{
          chainId: hexChainId,
          chainName: "Rootstock Mainnet",
          rpcUrls: [this.rootstockRpc],
          nativeCurrency: {
            name: "Rootstock Bitcoin",
            symbol: "RBTC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://explorer.rootstock.io/"],
        }]);
      } else {
        throw switchError;
      }
    }
  }

  async loadBalance(address: string) {
    const provider = this.getRpcProvider();
    const balance = await provider.getBalance(address);
    const formattedBalance = Number(ethers.utils.formatEther(balance));

    return formattedBalance;
  }

  async loadTokenBalance(address: string, tokenAddress: string, decimals = 18) {
    const provider = this.getRpcProvider();
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(address);

    return Number(ethers.utils.formatUnits(balance, decimals));
  }

  listenForAccountChanges(handler: (accounts: string[]) => void) {
    window.ethereum?.on?.("accountsChanged", handler);
  }

  removeAccountChangeListener(handler: (accounts: string[]) => void) {
    window.ethereum?.removeListener?.("accountsChanged", handler);
  }

  async disconnect() {
    this.provider = undefined;
  }
}
