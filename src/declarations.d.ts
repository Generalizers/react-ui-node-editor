declare module '*.scss';

interface ArrayConstructor {
  clamp: (arr: [number, number], n: number) => number;
}

interface WheelEvent {
  layerX: number;
  layerY: number;
}

interface MouseEvent {
  layerX: number;
  layerY: number;
}
