import { makeRequest } from "@/utils/request";
import { TokenMarketDataResponse, TokenMarketDataRequest } from "../interfaces/price";

export async function getTokenMarketData(tokenId: string): Promise<TokenMarketDataResponse> {
  return makeRequest<TokenMarketDataRequest, TokenMarketDataResponse>({
    route: "",
    externalLink: `https://api-v3.ethvm.dev/`,
    method: "POST",
    body: {
      operationName: null,
      variables: {},
      query:
        `{\n  getCoinGeckoTokenMarketDataByIds(coinGeckoTokenIds: ["${tokenId}"]) {\n    id\n    symbol\n    name\n    image\n    market_cap\n    market_cap_rank\n    high_24h\n    low_24h\n    price_change_24h\n    price_change_percentage_24h\n    sparkline_in_24h {\n      price\n    }\n    price_change_percentage_24h_in_currency\n    current_price\n  }\n}\n`,
    },
  });
}
