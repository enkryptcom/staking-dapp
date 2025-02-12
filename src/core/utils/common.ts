export const floatFormat = (balance: string) => {
  if (balance.includes('.')) {
    const [integerPart, decimalPart] = balance.split('.');

    if (decimalPart.length > 4) {
      let truncatedDecimals = decimalPart.substring(0, 4);
      const remainingDecimals = decimalPart.substring(4);

      if (truncatedDecimals[3] === '0') {
        let i = 0;

        while (i < remainingDecimals.length && remainingDecimals[i] === '0') {
          truncatedDecimals += '0';
          i++;
        }

        if (i < remainingDecimals.length) {
          truncatedDecimals += remainingDecimals[i];
        }

        return integerPart + '.' + truncatedDecimals;
      } else {
        return integerPart + '.' + truncatedDecimals;
      }
    }

    return integerPart + '.' + decimalPart;
  } else {
    return balance;
  }
}

export const formatValue = (num: number) => {
  if (!num || num === 0) {
    return "-";
  }
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toFixed(2).toString();
  }
}
