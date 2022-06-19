import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Options } from './Options';
import { gridSize, strokeWidth, usePanZoom } from './grid';
import styles from './index.module.scss';
import { ZoomConsumer, ZoomProvider, useZoom } from './zoom';

export const Grid: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ZoomProvider>
      <ZoomConsumer>
        {([zoom, setZoom]) => {
          const [graphRef, setGraphRef] = useState<Element>();

          usePanZoom(graphRef as HTMLElement, [zoom, setZoom]);

          return (
            <div className={styles.main}>
              <div
                className={styles.mainContainer}
                ref={(r) => r && setGraphRef(r)}
              >
                <svg
                  preserveAspectRatio='xMidYMid slice'
                  patternUnits='userSpaceOnUse'
                >
                  <defs>
                    <pattern
                      id='cross'
                      width={gridSize}
                      height={gridSize}
                      patternUnits='userSpaceOnUse'
                      viewBox='0 0 40 40'
                      transform='scale(50)'
                    >
                      <line
                        y1={5}
                        y2={5}
                        x1={4}
                        x2={6}
                        strokeWidth={strokeWidth}
                      />
                      <line
                        x1={5}
                        x2={5}
                        y1={4}
                        y2={6}
                        strokeWidth={strokeWidth}
                      />
                    </pattern>
                  </defs>
                  <rect
                    x={0}
                    y={0}
                    width={`100%`}
                    height={`100%`}
                    fill='url(#cross)'
                  />
                </svg>
                <div className={styles.mainContainerContent}>{children}</div>
              </div>
              <Options />
            </div>
          );
        }}
      </ZoomConsumer>
    </ZoomProvider>
  );
};
