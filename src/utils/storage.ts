import { PortfolioByChain } from "@/core/interfaces";

export const saveStorageStakingAccounts = (accounts: PortfolioByChain) => {
  localStorage.setItem("staking_accounts", JSON.stringify(accounts));
}

export const getStorageStakingData = () => {
  return localStorage.getItem("staking_accounts");
};
