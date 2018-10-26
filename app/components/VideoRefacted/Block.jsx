import PropType from 'prop-types';
import React, { PureComponent } from 'react';

const Block = ({ children, className = '' }) => (
  <div className={`${ className } `}>
    { children }
  </div>
);

Block.propTypes = {
  children: PropType.node.isRequired
};

export default Block;