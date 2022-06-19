import { contextGenerator } from '@generalizers/react-context';

export const {
  useHook: useZoom,
  Provider: ZoomProvider,
  Consumer: ZoomConsumer,
} = contextGenerator(1, 'ZoomContext');
