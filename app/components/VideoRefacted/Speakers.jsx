import PropType from 'prop-types';
import React, { PureComponent } from 'react';

class Speakers extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper-speakers">
        <p>Speakers</p>
      </div>
    );
  }
}

export default Speakers;