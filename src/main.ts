import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import * as filters from "./utils/filters";
import { SharedTypes } from "@/store/shared/consts";
import SolanaWallets from 'solana-wallets-vue';
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const wallets = [
  new PhantomWalletAdapter(),
];

const app = createApp(App);

app.use(router);
app.use(store);
app.use(SolanaWallets, { wallets, autoConnect: true });

store.dispatch(SharedTypes.LOAD_WALLET_DATA_ACTION);

app.config.globalProperties.$filters = filters;

app.mount("#app");
