import PropType from 'prop-types';
import React, { PureComponent } from 'react';

const Container = ({ children, className = '' }) => (
  <div className={`${ className } `}>
    { children }
  </div>
);

Container.propTypes = {
  children: PropType.node.isRequired
};

export default Container;