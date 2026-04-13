import platform from "platform";
import { Chains } from "@/core/interfaces";

export const BROWSER_NAMES = {
  chrome: "Chrome",
  firefox: "Firefox",
  brave: "Brave",
  edge: "Edge",
  opera: "Opera",
  safari: "Safari",
};

export const detectOS = (): string => {
  const { userAgent } = navigator;
  const info = platform.parse(userAgent);

  return info.os?.toString() || "Unknown OS";
};

export const detectBrowser = (): string => {
  const { userAgent } = navigator;
  const info = platform.parse(userAgent);

  return `${info.name} ${info.version}`;
};

export const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const openSolscanExplorerAddress = (
  address: string,
  cluster: string
) => {
  window.open(
    `https://solscan.io/account/${address}?cluster=${cluster}`,
    "_blank"
  );
};

export const openSolscanExplorerTransaction = (id: string, cluster: string) => {
  window.open(`https://solscan.io/tx/${id}?cluster=${cluster}`, "_blank");
};

const ROOTSTOCK_EXPLORER =
  import.meta.env.VITE_ROOTSTOCK_EXPLORER || "https://explorer.rootstock.io";

export const openExplorerAddress = (
  address: string,
  chain: Chains,
  cluster: string
) => {
  if (chain === Chains.SOLANA) {
    openSolscanExplorerAddress(address, cluster);
    return;
  }

  if (chain === Chains.ROOTSTOCK) {
    window.open(`${ROOTSTOCK_EXPLORER}/address/${address}`, "_blank");
  }
};

export const openExplorerTransaction = (
  id: string,
  chain: Chains,
  cluster: string
) => {
  if (chain === Chains.SOLANA) {
    openSolscanExplorerTransaction(id, cluster);
    return;
  }

  if (chain === Chains.ROOTSTOCK) {
    window.open(`${ROOTSTOCK_EXPLORER}/tx/${id}`, "_blank");
  }
};

export const openContactSupport = () => {
  window.open(
    `mailto:support@enkrypt.com?subject=Enkrypt Staking Dapp Enquiry - ${__PACKAGE_VERSION__} - ${detectBrowser()} - ${detectOS()}`,
    "_blank"
  );
};
