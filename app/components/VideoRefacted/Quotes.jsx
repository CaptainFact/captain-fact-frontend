import PropType from 'prop-types';
import React, { Fragment, PureComponent } from 'react';

import QuoteLeftWhite from '../../assets/quote-left-white.svg';
import QuoteRightWhite from '../../assets/quote-right-white.svg';

class Quotes extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    let domQuotes = [];

    for (let i = 0; i < props.quotes.length; i++) {
      domQuotes.push(
        <Fragment key={ `quote-${ i }` }>
          <div className="quote" id={ `time-${props.quotes[i].time}` }>
            <img src={ QuoteRightWhite } className="mr-3" alt=""/>
            <p>{ props.quotes[i].quote }</p>
            <img src={ QuoteLeftWhite } className="ml-3" alt=""/>
          </div>
          <div className="row p-4">
            <div className="col-6 wrapper-confirm">
              <p>Confirme <span className="vote">215</span></p>
              <div className="comments up p-3">
                <div className="vote">
                  <p>+</p>
                  <p>215</p>
                  <p>-</p>
                </div>
                <div className="user-comment-name">
                  <img src="https://cdn.dribbble.com/users/199982/screenshots/4044699/furkan-avatar-dribbble.png" alt=""/>
                  <span className="user-comment">Jean Eude Michelin</span>
                  <span className="comment"></span>
                </div>
              </div>
            </div>
            <div className="col-6 wrapper-refute">
              <p>Refute <span className="vote">9</span></p>
              <div className="comments down p-3">
                <div className="vote">
                  <p>+</p>
                  <p>9</p>
                  <p>-</p>
                </div>
                <div className="user-comment-name">
                  <img src="https://cdn.dribbble.com/users/199982/screenshots/4044699/furkan-avatar-dribbble.png" alt=""/>
                  <span className="user-comment">Thierry Joyeuse</span>
                  <span className="comment"></span>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <div className="wrapper-quotes">
        { domQuotes }
      </div>
    );
  }
}

export default Quotes;