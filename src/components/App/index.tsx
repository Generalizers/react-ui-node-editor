import { Grid } from '../Grid';
import { Container } from '../Grid/Container';
import { FunctionComponent } from 'react';

import styles from './index.module.scss';

export const App: FunctionComponent = () => {
  return (
    <div className={styles.main}>
      <Grid>
        <Container position={[350, 460]}>Hello world</Container>
        {/* <Container>Hello world</Container> */}
      </Grid>
    </div>
  );
};
