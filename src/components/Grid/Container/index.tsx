import { dragLockedEvent } from '../../../global';
import { FunctionComponent, HTMLProps, useEffect, useState } from 'react';

import styles from './index.module.scss';

interface InitProps {
  x?: number;
  y?: number;
}

interface ContainerProps extends HTMLProps<HTMLDivElement> {
  init?: InitProps;
}

export const Container: FunctionComponent<ContainerProps> = ({
  children,
  init = { x: 0, y: 0 },
  ...props
}) => {
  const { x = 0, y = 0 } = init;
  const [containerRef, setContainerRef] = useState<Element>();

  useEffect(() => {
    const dRef = [x, y];
    if (containerRef) {
      dragLockedEvent({
        target: containerRef,
        startCallback: (e, data) => {
          e.preventDefault();

          const d = data ?? dRef;

          return {
            data: [d[0], d[1], e.layerX, e.layerY],
            start: e.button == 0,
          };
        },
        eventCallback(e, data) {
          e.preventDefault();

          const [x, y, lx, ly] = data;

          console.log(lx);

          dRef[0] = e.clientX - x - lx;
          dRef[1] = e.clientY - y - ly;
          const [dx, dy] = dRef;

          (containerRef as HTMLDivElement).style.left = `${dx}px`;
          (containerRef as HTMLDivElement).style.top = `${dy}px`;
        },
      });
    }
  }, [containerRef]);

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
