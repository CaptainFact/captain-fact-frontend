import React, { Fragment } from 'react'
import { ds } from './../../../styles/tokens'
import { pxTo } from "design-system-utils"
import { css } from 'emotion'
import { withTheme } from './../../smart/ThemeProvider'
import PropTypes from 'prop-types'

const tasksTheme = {
  wipColor: {
    dark: 'text-white',
    light: 'text-'
  },
  doneColor: {
    dark: 'text-grayDark' ,
    light: 'text-grayDark',
  },
}

const ObjectiveTask = (props) => {
  const { tasksDone, tasksWip, entities, theme } = props

  return <Fragment>
    <ul>
      { tasksWip.map((task, index) => <li className='mb-5' key={index}>
          <span>{task.name}</span> <b>({entities[task.entity]} sur {task.goal})</b>
        </li>
        )
      }
    </ul>
    <ul className='mt-20 opacity-45'>
      {tasksDone.map((task, index) => <li className='mb-5' key={index}>
        <strike>{task.name} ({entities[task.entity]} sur {task.goal})</strike>
      </li>
      )
      }
    </ul>
  </Fragment>

}

ObjectiveTask.propTypes = {
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
  tasksDone: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasksWip: PropTypes.arrayOf(PropTypes.object).isRequired,
  entities: PropTypes.object.isRequired,
}


export default withTheme(ObjectiveTask)