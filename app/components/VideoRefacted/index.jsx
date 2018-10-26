import React, { PureComponent } from 'react';

import Block from './Block';
import Container from './Container';
import Nav from './Nav';

class VideoRefacted extends PureComponent {
  render() {
    return (
      <div id="VideoRefacted">
        <Nav />
        <Container className="row main-container">
          <Block className="col-12 sub-container">
            <h1>Vidéo</h1>
          </Block>

          <Block className="col-12 sub-container">
            <h1>Timeline</h1>
          </Block>

          <Block className="col-12 sub-container">
            <h1>Citations</h1>
          </Block>
        </Container>
      </div>
    );
  }
}

export default VideoRefacted;