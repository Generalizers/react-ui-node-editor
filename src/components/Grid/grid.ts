import { dragLockedEvent, useMove } from '../../global';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const gridSize = 25;
export const strokeWidth = 8;

export const usePanZoom = (
  container: HTMLElement,
  zoomState: [number, Dispatch<SetStateAction<number>>],
) => {
  const posState = useState<[number, number]>([0, 0]);

  useMove({
    container,
    position: posState[0],
    postOperation(n) {
      return n / zoomState[0];
    },
    button: 1,
  });

  useEffect(() => {
    if (container) {
      return listen(container, zoomState, posState);
    }
  }, [container, zoomState[0]]);
};

export const listen = (
  container: HTMLElement,
  [zoom, setZoom]: [number, Dispatch<SetStateAction<number>>],
  [[posX, posY], setPos]: [
    [number, number],
    Dispatch<SetStateAction<[number, number]>>,
  ],
) => {
  const pattern = container.querySelector(
    ':scope > svg > defs > pattern',
  ) as HTMLElement;
  const content = container.querySelector(':scope > div') as HTMLElement;
  if (pattern && content) {
    // const clean = dragLockedEvent({
    //   target: container,
    //   startCallback: (e) => {
    //     return {
    //       data: [
    //         getValueFromPixels(pattern.getAttribute('x') ?? '0px'),
    //         getValueFromPixels(pattern.getAttribute('y') ?? '0px'),
    //       ],
    //       start: e.button == 1,
    //     };
    //   },
    //   eventCallback: (e, data) => {
    //     const { deltaX, deltaY } = e;
    //     const [x, y] = data;

    //     posX = x + deltaX;
    //     posY = y + deltaY;

    //     document.documentElement.style.cursor = 'grabbing';

    //     content.style.transform = `translate(${posX}px, ${posY}px) scale(${zoom})`;

    //     pattern.setAttribute('x', `${posX}px`);
    //     pattern.setAttribute('y', `${posY}px`);
    //   },
    //   endCallback: () => {
    //     setPos([posX, posY]);
    //     document.documentElement.style.cursor = 'inherit';
    //   },
    // });

    const { left: cx, top: cy } = container.getBoundingClientRect();
    const fWheel = (e: Event) => {
      const ev = e as WheelEvent;
      const { deltaY, clientX, clientY } = ev;
      const lx = clientX - cx;
      const ly = clientY - cy;

      const delta = deltaY > 0 ? 1 : -1;

      const minDelta = delta / ((1 / zoom) * 5);
      const newZoom = Array.clamp([0.3, 3], zoom - minDelta);

      posX = -((lx - posX) / zoom) * newZoom + lx;
      posY = -((ly - posY) / zoom) * newZoom + ly;

      content.style.transform = `translate(${posX}px, ${posY}px) scale(${newZoom})`;
      pattern.setAttribute('x', `${posX}px`);
      pattern.setAttribute('y', `${posY}px`);
      setPos([posX, posY]);

      setZoom(newZoom);

      const size = `${gridSize * newZoom}px`;
      pattern.style.transform = `scale(${size})`;
      pattern.setAttribute('width', size);
      pattern.setAttribute('height', size);
    };

    container.addEventListener('wheel', fWheel, { passive: true });

    return () => {
      //clean();
      container.removeEventListener('wheel', fWheel);
    };
  }
};

const getValueFromPixels = (px: string) => parseInt(px.split('px')[0]);
