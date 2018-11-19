import React, { PureComponent } from 'react';
import ReactPlayer from 'react-player';

import Block from './Block';
import Nav from './Nav';

const url = 'https://www.youtube.com/watch?v=20G-Z1RbwwI';
const PLAYER_CONFIG = {youtube: {playerVars: { showinfo: 1 }}};

class VideoRefacted extends PureComponent {
  render() {
    return (
      <div id="VideoRefacted">
        <Nav />
        <div className="row main-container">
          <Block className="col-12 sub-container p-0">
            <div className="wrapper-video">
              <ReactPlayer
                className="video"
                controls
                height={'100%'}
                width={'100%'}
                url={url}
                config={PLAYER_CONFIG}
              />
            </div>
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