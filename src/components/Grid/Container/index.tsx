import { dragLockedEvent } from '../../../global';
import { useZoom } from '../zoom';
import { FunctionComponent, HTMLProps, useEffect, useState } from 'react';

import styles from './index.module.scss';

interface InitProps {}

interface ContainerProps extends HTMLProps<HTMLDivElement> {
  position?: [number, number];
}

export const Container: FunctionComponent<ContainerProps> = ({
  children,
  position,
  ...props
}) => {
  const [pos, setPos] = useState(position ?? [0, 0]);
  const [containerRef, setContainerRef] = useState<Element>();
  const [zoom] = useZoom();

  useEffect(() => {
    if (containerRef) {
      (containerRef as HTMLDivElement).style.left = `${pos[0]}px`;
      (containerRef as HTMLDivElement).style.top = `${pos[1]}px`;
    }
  }, [containerRef]);

  useEffect(() => {
    if (containerRef) {
      return dragLockedEvent({
        target: containerRef,
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

          pos[0] = x + deltaX / zoom;
          pos[1] = y + deltaY / zoom;
          const [dx, dy] = pos;

          (containerRef as HTMLDivElement).style.left = `${dx}px`;
          (containerRef as HTMLDivElement).style.top = `${dy}px`;
        },
        endCallback: (e) => {
          e.stopPropagation();
          setPos([...pos]);
        },
      });
    }
  }, [containerRef, zoom, pos]);

  return (
    <div
      {...props}
      className={styles.main}
      ref={(r) => r && setContainerRef(r)}
    >
      {children}
    </div>
  );
};
