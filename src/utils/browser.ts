import platform from "platform";

export const BROWSER_NAMES = {
  chrome: 'Chrome',
  firefox: 'Firefox',
  brave: 'Brave',
  edge: 'Edge',
  opera: 'Opera',
  safari: 'Safari',
};

export const detectOS = (): string => {
  const { userAgent } = navigator;
  const info = platform.parse(userAgent);

  return info.os;
};

export const detectBrowser = (): string => {
  const { userAgent } = navigator;
  const info = platform.parse(userAgent);

  return `${info.name} ${info.version}` ;
};

export const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export const openSolscanExplorerAddress = (address: string, cluster: string) => {
  window.open(`https://solscan.io/account/${address}?cluster=${cluster}`, '_blank');
}

export const openSolscanExplorerTransaction = (id: string, cluster: string) => {
  window.open(`https://solscan.io/tx/${id}?cluster=${cluster}`, '_blank');
}

export const openContactSupport = () => {
  window.open(`mailto:support@enkrypt.com?subject=Enkrypt Staking Dapp Enquiry - ${__PACKAGE_VERSION__} - ${detectBrowser()} - ${detectOS()}`, '_blank');
}