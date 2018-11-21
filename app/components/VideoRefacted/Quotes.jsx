import PropType from 'prop-types';
import React, { PureComponent } from 'react';

class Quotes extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper-quotes">
        <p>Quotes</p>
      </div>
    );
  }
}

export default Quotes;