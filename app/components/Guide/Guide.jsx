import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'
import GuideSubject from './GuideSubject';
import GuideSearchBar from './GuideSearchBar';
import data from '../../API/guide_data.json';


@withNamespaces('guide')
export default class Guide extends Component {
  state = {
    data: data
  };

  
  render() {
    return (
      <div className="guide-page">
        <GuideSearchBar data={this.state.data}/>
        <ul>
          {this.state.data.subjects.map(function(subject, index){
            return <GuideSubject key={index} subject={subject}/>
          })}
        </ul>
      </div>
    )
  }
}
