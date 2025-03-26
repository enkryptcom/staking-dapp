export const BROWSER_NAMES = {
  chrome: 'chrome',
  firefox: 'firefox',
  brave: 'brave',
  edge: 'edge',
  opera: 'opera',
  safari: 'safari',
};

export const detectOS = (): string => {
  const platform = navigator.platform;
    let osName = "Unknown OS";

    if (platform.includes("Win")) { 
        osName = "Windows";
    } else if (platform.includes("Mac")) { 
        osName = "MacOS";
    } else if (platform.includes("X11") || platform.includes("Linux")) { 
        osName = "Linux";
    }

    return osName;
};

export const detectBrowser = (): string => {
  const { userAgent } = navigator;

  if (userAgent.match(/^((?!chrome|android).)*safari/i)) {
    return BROWSER_NAMES.safari;
  }
  if (userAgent.match(/Opera|OPR/i)) {
    return BROWSER_NAMES.opera;
  }
  if (userAgent.match(/edg/i)) {
    return BROWSER_NAMES.edge;
  }
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return BROWSER_NAMES.chrome;
  }
  if (userAgent.match(/firefox|fxios/i)) {
    return BROWSER_NAMES.firefox;
  }
  return '';
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
