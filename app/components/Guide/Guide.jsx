import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'
import GuideSubject from './GuideSubject';
import GuideSearchBar from './GuideSearchBar';
import data from '../../API/guide_data.json';
import GuideList from './GuideList';


@withNamespaces('guide')
export default class Guide extends Component {
  state = {
    data: data,
    dataTf: data.subjects.reduce(function (acc, cur) {
      cur.items.forEach(el => {
        if(el.in_list) {
          acc.push(el);
        }
      })
      return acc;
    }, [])
  };

  onChange = (itemToChange, value) => {
    const newDataSubject = this.state.data.subjects.reduce(function (acc, cur) {
      const newSub = {
        title: cur.title,
        items: cur.items.map(item => {
          if(itemToChange.id === item.id){
            item.in_list = value;
          } 
          return item;
        })
      }

      acc.push(newSub);

      return acc;
    }, []);

    
    const newData = {
      subjects: newDataSubject
    }

    this.setState({
      data: newData,
      dataTf : this.state.data.subjects.reduce(function (acc, cur) {
      
        cur.items.forEach(el => {
          
          if(el.in_list) {
            acc.push(el);
          }
        })
        return acc;
      }, [])
    })
  }
  
  render() {
    return (
      <div className="guide-page">
        <GuideSearchBar data={this.state.data}/>
        <GuideList data={this.state.dataTf} onDelete={this.onChange}/>
        <ul className='guide-subject-wrapper'>
          {this.state.data.subjects.map((subject, index) =>{
            return <GuideSubject key={index} subject={subject} onAdd={this.onChange}/>
          })}
        </ul>
      </div>
    )
  }
}
