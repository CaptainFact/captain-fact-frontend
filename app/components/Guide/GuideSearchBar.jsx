import React from 'react'
import PropTypes from 'prop-types';

const GuideSearchBar = ({data}) => {
  return (
    <div className="searchbar guide-searchbar">
      <input placeholder='Rechercher' type="text"/>
      <div>
        <div className='wrapper-select'>
          <select name="" id="">
          {data.subjects.map((subject, index) => {
            return (
              <option key={index} value={subject.title}>{subject.title}</option>
            )
          })}
          </select>
        </div>
        <label className='wrapper-checkbox'>
          <input type="checkbox" name="searchByReputation" id=""/>
          <span className='check'></span>
          <span>Récompense</span>
        </label>
      </div>

    </div>
  )
}

GuideSearchBar.propTypes = {
  data: PropTypes.object.isRequired
};

export default GuideSearchBar;
