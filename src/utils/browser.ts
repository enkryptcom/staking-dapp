export const detect = (): string => {
  const userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "no";
  }

  return browserName;
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
