import Metrics from './amplitude';
import { ButtonsActionEventType, ScreenEventType } from './types';

const metrics = new Metrics();

const trackButtonsEvents = (event: ButtonsActionEventType) => {
  metrics.track(event);
};

const trackScreenEvents = (event: ScreenEventType) => {
  metrics.track(event);
};

export {
  trackButtonsEvents,
  trackScreenEvents
}