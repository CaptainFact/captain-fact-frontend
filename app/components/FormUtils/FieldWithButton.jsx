import React from 'react'
import classNames from 'classnames'
import Input from './Input'

export default props => {
  const { submitting, invalid } = props.meta || {}
  const {
    buttonClassName,
    buttonLabel,
    buttonClickHandler,
    expandInput,
    ...inputProps
  } = props
  return (
    <div className="field has-addons">
      <div className={classNames('control', { 'is-expanded': expandInput })}>
        <Input {...inputProps} />
      </div>
      <div className="control">
        <button
          type="submit"
          className={classNames('button', buttonClassName, {
            'is-loading': submitting
          })}
          disabled={submitting || invalid}
          onClick={buttonClickHandler}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
