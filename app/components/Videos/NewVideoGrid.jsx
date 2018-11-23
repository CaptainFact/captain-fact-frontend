import React from 'react';
import cxs from 'cxs';

import { NewVideoCard } from './NewVideoCard';

export class NewVideoGrid extends React.PureComponent {
  render() {
    return (
      <div className={`columns is-multiline ${style.videos}`}>
        {this.props.videos.map(video => (
          <NewVideoCard key={video.hash_id} video={video} />
        ))}
      </div>
    );
  }
}

const style = {
    videos: cxs({
        display: 'flex',
        justifyContent: 'center'
    }),
};