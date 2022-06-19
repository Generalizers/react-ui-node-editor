import { Controls } from '../../Controls';
import { Popup } from '../../utils/Popup';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FunctionComponent, useState } from 'react';

import styles from './index.module.scss';

export const Options: FunctionComponent = () => {
  return (
    <div className={styles.main}>
      <div>
        <Popup button={<FontAwesomeIcon icon={faKeyboard} />}>
          <Controls />
        </Popup>
      </div>
    </div>
  );
};
