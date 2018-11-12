import React, { PureComponent } from 'react';

import Block from './Block';
import Nav from './Nav';

class VideoRefacted extends PureComponent {
  render() {
    return (
      <div id="VideoRefacted">
        <Nav />
        <div className="row main-container">
          <Block className="col-12 sub-container">
            <h1>Vidéo</h1>
          </Block>

          <Block className="col-12 sub-container">
            <h1>Timeline</h1>
          </Block>

          <Block className="col-12 sub-container">
            <h1>Citations</h1>
          </Block>
        </div>
      </div>
    );
  }
}

export default VideoRefacted;