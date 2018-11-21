import PropType from 'prop-types';
import React, { PureComponent } from 'react';

const Timeline = ({ facts, currentTime, totalTime }) => {
  return (
    <div className="wrapper-timeline">
      <h3 className="mb-4 text-center">{ facts.length } facts checking</h3>
      <div className="timeline"></div>
      <div className="time">
        <p>{ currentTime }</p>
        <p className="ml-auto">{ totalTime }</p>
      </div>
    </div>
  );
};

Timeline.defaultProps = {
  currentTime: '00:00:00',
  facts: 0,
  totalTime: '00:00:00'
};

Timeline.propTypes = {
  currentTime: PropType.string,
  facts: PropType.array,
  totalTime: PropType.string
};

export default Timeline;