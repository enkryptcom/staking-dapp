export interface SolanaPriceResponse {
  data: {
    getCoinGeckoTokenMarketDataByIds: CoinGeckoToken[],
  }
};

export interface CoinGeckoToken {
  id: string,
  symbol: string,
  name: string,
  image: string,
  market_cap: number,
  market_cap_rank: number,
  high_24h: number,
  low_24h: number,
  price_change_24h: number,
  price_change_percentage_24h: number,
  sparkline_in_24h: {
    price: number[],
  },
  price_change_percentage_24h_in_currency: number,
  current_price: number,
};

export interface SolanaPriceRequest {
  operationName: string | null,
  variables: any,
  query: string,
};
