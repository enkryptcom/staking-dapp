import { Network } from "./network";

export interface StakingItem {
  id: number;
  name: string;
  image: string;
  apr: number;
  balance: number;
  priceChange: number;
  percentChange: number;
  mcap: number;
  network: Network
}
