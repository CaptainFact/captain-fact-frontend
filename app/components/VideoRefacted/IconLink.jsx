import PropType from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router'

const IconLink = ({ handleOnClick, navLink, text, className, href, propsAnchor, propsImg }) => {
  const templateLink = (
    <Fragment>
      <img { ...propsImg } />
      { text.length > 0 && <p>{ text }</p> }
    </Fragment>
  );

  return (
    <Fragment>
      { navLink === true ?
        <Link onClick={ handleOnClick } to={ href } className={ `link-icon ${className}` } { ...propsAnchor }>
          { templateLink }
        </Link>
          :
        <a onClick={ handleOnClick } href={ href } className={ `link-icon ${className}` } { ...propsAnchor }>
          { templateLink }
        </a>
      }
    </Fragment>
  );
};

IconLink.defaultProps = {
  navLink: false,
  handleOnClick: () => 0,
  propsAnchor: {},
  propsImg: {},
  text: ''
};

IconLink.propTypes = {
  navLink: PropType.bool,
  handleOnClick: PropType.oneOfType([
    PropType.bool,
    PropType.func,
  ]),
  propsAnchor: PropType.object,
  propsImg: PropType.object.isRequired,
  text: PropType.string
};

export default IconLink;