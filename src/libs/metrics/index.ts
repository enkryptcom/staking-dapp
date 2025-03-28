import Metrics from './amplitude';
import { ButtonsActionEventType, ScreenEventType } from './types';

const metrics = new Metrics();

const trackButtonsEvents = (event: ButtonsActionEventType) => {
  metrics.track('button', { event });
};

const trackScreenEvents = (event: ScreenEventType) => {
  metrics.track('screen', { event });
};

export {
  trackButtonsEvents,
  trackScreenEvents
}