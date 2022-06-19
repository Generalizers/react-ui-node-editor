import { useEffect, useState } from 'react';

Array.clamp = function (arr, n) {
  return n > arr[0] ? (n < arr[1] ? n : arr[1]) : arr[0];
};

interface DragLockedEventInit extends MouseEventInit {
  startX?: number;
  startY?: number;
  deltaX?: number;
  deltaY?: number;
}

export class DragLockedEvent extends MouseEvent implements DragLockedEventInit {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;

  constructor(type: string, eventInitDict: DragLockedEventInit | undefined) {
    super(type, eventInitDict);
    const { startX, startY, deltaX, deltaY } = eventInitDict ?? {};
    this.startX = startX ?? 0;
    this.startY = startY ?? 0;
    this.deltaX = deltaX ?? 0;
    this.deltaY = deltaY ?? 0;
  }
}

const cursorLock = (elem: Element, id: number, lock: boolean = false) =>
  lock ? elem.setPointerCapture(id) : elem.releasePointerCapture(id);

document.addEventListener('pointerdown', (pe) => {
  const { screenX: peScreenX, screenY: peScreenY, clientX, clientY } = pe;

  const eventElem = document.elementFromPoint(clientX, clientY);

  if (eventElem) {
    const cDragLocked = (e: PointerEvent) => {
      const {
        movementX,
        movementY,
        clientX,
        clientY,
        screenX,
        screenY,
        altKey,
        button,
        buttons,
        ctrlKey,
        detail,
        metaKey,
        relatedTarget,
        shiftKey,
        view,
      } = e;
      const ev = new DragLockedEvent('draglocked', {
        bubbles: true,
        cancelable: true,
        composed: true,
        movementX,
        movementY,
        clientX,
        clientY,
        screenX,
        screenY,
        altKey,
        button,
        buttons,
        ctrlKey,
        detail,
        metaKey,
        relatedTarget,
        shiftKey,
        view,
        deltaX: screenX - peScreenX,
        deltaY: screenY - peScreenY,
        startX: peScreenX,
        startY: peScreenY,
      });

      cursorLock(eventElem, pe.pointerId, true);
      eventElem.dispatchEvent(ev);
    };

    document.addEventListener('pointermove', cDragLocked);
    document.addEventListener(
      'mouseup',
      () => {
        cursorLock(eventElem, pe.pointerId);
        document.removeEventListener('pointermove', cDragLocked);
      },
      { once: true, capture: true },
    );
  }
});

export interface DragLockedEventHelper<T = any> {
  target: Element;
  startCallback: (e: MouseEvent, data: T) => DragLockedEventStart<T>;
  eventCallback: (e: DragLockedEvent, data: T) => any;
  endCallback?: (e: MouseEvent, data: T) => any;
}

interface DragLockedEventStart<T = any> {
  start?: boolean;
  data?: T;
}

export const dragLockedEvent = <T = any>({
  target,
  startCallback,
  eventCallback,
  endCallback,
}: DragLockedEventHelper<T>) => {
  let data: any;
  let store = data;

  const f = (e: Event) => {
    const ev = e as DragLockedEvent;
    store = eventCallback(ev, data);
  };
  const fDown = (e: Event) => {
    const d = startCallback(e as MouseEvent, data);
    if (d.start) {
      data = d.data;
      target.addEventListener('draglocked', f);
    }
  };
  const fUp = (e: MouseEvent) => {
    endCallback?.(e, data);
    target.removeEventListener('draglocked', f);
  };

  target.addEventListener('mousedown', fDown);
  document.addEventListener('mouseup', fUp);

  return () => {
    target.removeEventListener('mousedown', fDown);
    document.removeEventListener('mouseup', fUp);
  };
};

interface MoveOptions {
  container?: HTMLElement;
  position?: [number, number];
  postOperation?: (p: number) => number;
  moveEnd?: (p: [number, number]) => any;
  button?: number;
}

export const useMove = ({
  container,
  position = [0, 0],
  postOperation,
  moveEnd,
}: MoveOptions) => {
  const [pos, setPos] = useState(position);

  useEffect(() => {
    if (container) {
      container.style.left = `${pos[0]}px`;
      container.style.top = `${pos[1]}px`;
    }
  }, [container]);

  useEffect(() => {
    if (container) {
      return dragLockedEvent({
        target: container,
        startCallback: (e, data) => {
          e.preventDefault();

          const d = data ?? pos;

          return {
            data: [d[0], d[1]],
            start: e.button == 0,
          };
        },
        eventCallback: (e, data) => {
          e.preventDefault();

          const { deltaX, deltaY } = e;
          const [x, y] = data;

          const rx = x + deltaX,
            ry = y + deltaY;
          pos[0] = postOperation?.(rx) ?? rx;
          pos[1] = postOperation?.(ry) ?? ry;
          const [dx, dy] = pos;

          container.style.left = `${dx}px`;
          container.style.top = `${dy}px`;
        },
        endCallback: (e) => {
          e.stopPropagation();
          moveEnd?.(pos);
          setPos([...pos]);
        },
      });
    }
  }, [container, pos]);
};
