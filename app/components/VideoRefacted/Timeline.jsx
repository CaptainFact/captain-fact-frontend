import PropType from 'prop-types';
import React, { PureComponent } from 'react';

import { formatHour } from "../../state/utils";

class Timeline extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const iconsQuotes = document.querySelectorAll('.icon-quote');

    for (let i = 0; i < iconsQuotes.length; i++) {
      console.log();
      iconsQuotes[i].style.left = `${document.querySelector('.timeline').offsetWidth / this.props.totalTime * parseInt(iconsQuotes[i].getAttribute('data-time'))}px`;
      iconsQuotes[i].style.zIndex = i + 1;
    }

    document.querySelector('.timeline-played').style.width = `${document.querySelector('.timeline').offsetWidth / this.props.totalTime * this.props.currentTime}px`;
  }

  render() {
    const props = this.props;
    let domIconsQuotes = [];

    for (let i = 0; i < props.facts.length; i++) {
      domIconsQuotes.push(
        <div key={ `icon-quote-${ i }` } className="icon-quote" data-time={ props.facts[i].time }>
          <img src={ props.facts[i].icon } alt=""/>
        </div>
      );
    }

    return (
      <div className="wrapper-timeline">
        <h3 className="mb-4 text-center">{ props.facts.length } facts checking</h3>
        <div className="timeline">
          <div className="timeline-played"></div>
          { domIconsQuotes }
        </div>
        <div className="time mt-3">
          <p>{ formatHour(props.currentTime) }</p>
          <p className="ml-auto">{ formatHour(props.totalTime) }</p>
        </div>
      </div>
    );
  }
}

Timeline.defaultProps = {
  currentTime: 0,
  facts: [],
  totalTime: 0
};

Timeline.propTypes = {
  currentTime: PropType.number,
  facts: PropType.array,
  totalTime: PropType.number
};

export default Timeline;