import PropType from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router';

const Speakers = ({ speakers }) => {
  let domSpeakers = [];

  for (let i = 0; i < speakers.length; i++) {
    domSpeakers.push(
      <div key={ `speaker-${ i }` } className="speaker">
        <img src={ speakers[i].img } alt=""/>
        <Link to={ speakers[i].link }>
          <h5>{ speakers[i].name }</h5>
        </Link>
        <p>{ speakers[i].type }</p>
      </div>
    );
  }

  return (
    <div className="wrapper-speakers">
      <div className="speakers">
        { domSpeakers }
      </div>
    </div>
  );
};

Speakers.propTypes = {
  speakers: PropType.array
};

export default Speakers;