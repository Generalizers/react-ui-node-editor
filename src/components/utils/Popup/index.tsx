import React, {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useState,
} from 'react';

import styles from './index.module.scss';

interface PopupProps {
  children: ReactNode;
  button: ReactNode;
}

export const Popup: FunctionComponent<PopupProps> = ({ children, button }) => {
  const [up, setUp] = useState(false);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setUp(false);
  };

  return (
    <>
      <div onClick={() => setUp(true)}>{button}</div>
      <div
        className={`${styles.main} ${up ? styles.mainUp : styles.mainDown}`}
        onClick={handleClose}
        style={{ opacity: up ? 1 : 0 }}
      >
        {children}
      </div>
    </>
  );
};
