/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component;
}

declare let __PACKAGE_VERSION__: string;
declare let __IS_DEV__: boolean;