import { init, track, Types, setOptOut } from '@amplitude/analytics-browser';
import { detectBrowser, detectOS } from '../../utils/browser';

class Metrics {
  browser = '';
  os = '';

  constructor() {
    this.init();
    this.browser = detectBrowser();
    this.os = detectOS()
  }

  private init() {
      if (typeof window !== 'undefined') {
        init('apikey', {
          instanceName: __IS_DEV__
            ? 'enkrypt-staking-dev'
            : 'enkrypt-staking',
          optOut: true,
          serverUrl: __IS_DEV__
            ? 'https://analytics-enkrypt-staking-dev.mewwallet.dev/record'
            : 'https://analytics-enkrypt-staking.mewwallet.dev/record',
          appVersion: __PACKAGE_VERSION__,
          trackingOptions: {
            ipAddress: false,
          },
          userId: 'none',
          useBatch: true,
          identityStorage: 'none',
          sessionTimeout: 15 * 60 * 1000, // 15 mins
          logLevel: Types.LogLevel.None,
          defaultTracking: {
            formInteractions: false,
            pageViews: false,
          },
        });
      }
  }
  track(event: string, options: Record<string, unknown>) {
    track(
      event,
      { ...options },
      {
        os_name: this.os,
        platform: this.browser,
      },
    );
  }
  setOptOut(val: boolean) {
    setOptOut(val);
  }
}

export default Metrics;