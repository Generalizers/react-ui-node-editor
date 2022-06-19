import { dragLockedEvent } from '../../global';
import { Dispatch, SetStateAction } from 'react';

export const gridSize = 25;
export const strokeWidth = 8;

export const usePanZoom = (
  container: HTMLElement,
  [zoom, setZoom]: [number, Dispatch<SetStateAction<number>>],
) => {
  const pattern = container.querySelector(
    ':scope > svg > defs > pattern',
  ) as HTMLElement;
  const content = container.querySelector(':scope > div') as HTMLElement;
  if (pattern && content) {
    let posX = 0,
      posY = 0;
    const clean = dragLockedEvent({
      target: container,
      startCallback: (e) => {
        return {
          data: [
            getValueFromPixels(pattern.getAttribute('x') ?? '0px'),
            getValueFromPixels(pattern.getAttribute('y') ?? '0px'),
          ],
          start: e.button == 1,
        };
      },
      eventCallback: (e, data) => {
        const { deltaX, deltaY } = e;
        const [x, y] = data;
        posX = x + deltaX;
        posY = y + deltaY;

        document.documentElement.style.cursor = 'grabbing';

        content.style.transform = `translate(${posX}px, ${posY}px) scale(${zoom})`;

        pattern.setAttribute('x', `${posX}px`);
        pattern.setAttribute('y', `${posY}px`);
      },
      endCallback: () => {
        document.documentElement.style.cursor = 'inherit';
      },
    });

    const fWheel = (e: Event) => {
      const ev = e as WheelEvent;
      const { deltaY, layerX, layerY } = ev;

      const delta = deltaY > 0 ? 1 : -1;
      const minDelta = delta / ((1 / zoom) * 5);
      const newZoom = Array.clamp([0.3, 3], zoom - minDelta);

      posX = -((layerX - posX) / zoom) * newZoom + layerX;
      posY = -((layerY - posY) / zoom) * newZoom + layerY;

      content.style.transform = `translate(${posX}px, ${posY}px) scale(${zoom})`;
      pattern.setAttribute('x', `${posX}px`);
      pattern.setAttribute('y', `${posY}px`);

      const size = `${gridSize * zoom}px`;
      pattern.style.transform = `scale(${size})`;
      pattern.setAttribute('width', size);
      pattern.setAttribute('height', size);
      setZoom(newZoom);
    };

    container.addEventListener('wheel', fWheel, { passive: true });

    return () => {
      clean();
      container.removeEventListener('wheel', fWheel);
    };
  }
};

const getValueFromPixels = (px: string) => parseInt(px.split('px')[0]);
