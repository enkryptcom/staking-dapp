export enum SharedTypes {
  CONNECT_PHANTOM_ACTION = "sharedStore/connectPhantomAction",
  CONNECT_ENKRYPT_ACTION = "sharedStore/connectEnkryptAction",
  CONNECTED_WALLET_ACTION = "sharedStore/walletConnectedAction",
  LOAD_WALLET_DATA_ACTION = "sharedStore/loadWalletDataAction",
  SET_ERROR_ACTION = "sharedStore/setError",
  DISCONNECT_WALLET_ACTION = "sharedStore/disconnectWallet",
  CONNECT_MODAL_ACTION = "sharedStore/connectModalAction",
  SET_PRICE = "sharedStore/setPrice",

  SET_ACCOUNT = "sharedStore/setAccount",
  SET_WALLET_TYPE = "sharedStore/setWalletType",
  SET_CONNECT_MODAL_VISIBLE = "sharedStore/setIsConnectModalVisible",

  IS_WALLET_CONNECTED_GETTER = "sharedStore/isWalletConnected",
  WALLET_ACCOUNT_GETTER = "sharedStore/walletAccount",
  WALLET_BALANCE_GETTER = "sharedStore/walletBalance",
  CHAIN_GETTER = "sharedStore/getChain",
  NETWORK_GETTER = "sharedStore/getNetwork",
  WALLET_TYPE_GETTER = "sharedStore/walletType",
  PRICE_GETTER = "sharedStore/getPrice",
  PRICE_STATS_GETTER = "sharedStore/getPriceStats",
  IS_CONNECT_MODAL_VISIBLE_GETTER = "sharedStore/isConnectModalVisible",
}