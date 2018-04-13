import isPromise from 'is-promise'


/**
 * A helper to create effects that can be dispatched with dispatch() using promises.
 *
 * Execution order: before, then, catch then after
 * Errors will always be caught at the end and an object similar to a
 * flux standard action (FSA) will be generated using `generateFSAError()`
 *
 * All opts values are dispatched using `cleverDispatch` meaning you can give
 * an action, an action creator, or an iterable containing any number of these.
 *
 * `after` last action / action creator return will be used as the final return
 *
 * @param {Promise || null} promise - if null, returns immediately
 * @param {{before: *, then: *, catch: *, after: *} || null} opts
 * @return function effect returning the updated promise
 */
export function createEffect(promise, opts=null) {
  return (dispatch, getState) => {
    // Dispatch a series of actions at different steps of the promise
    if (opts) {
      if (opts.before)
        cleverDispatch(dispatch, getState, opts.before)
      if (promise && opts.then)
        promise = promise.then(x => cleverDispatch(dispatch, getState, opts.then, x))
      if (promise && opts.catch)
        promise = promise.catch(x => cleverDispatch(dispatch, getState, opts.catch, x))
      if (opts.after)
        promise = cleverDispatch(dispatch, getState, opts.after, promise)
    }
    // Handle return value : if none of the functions generated FSA actions,
    // we manually generate SUCCESS / ERROR actions based on then() / catch()
    if (promise && isPromise(promise)) {
      return promise
        .then(value => isAction(value) ? value : generateFSASuccess(value))
        .catch(value => isAction(value) ? value : generateFSAError(value))
    }
    return promise
  }
}

/**
 * Effect to return a SUCCESS FSA action
 *
 * Useful to do stuff like : createEffect(asyncFunc, {
 *  then: [actionCreator(...), returnSuccess]
 * })
 */
export function returnSuccess(returnValue) {
  return () => generateFSASuccess(returnValue)
}

/**
 * Dispatch that accepts an action object, an action creator or a iterable
 * The iterable can itself contain action or action creators
 *
 * @param dispatch
 * @param getState
 * @param toDispatch action / action creator / iterable
 * @param params params to give to action creators
 * @returns {*}
 */
export function cleverDispatch(dispatch, getState, toDispatch, params=null) {
  if (typeof(toDispatch) === 'function')
    return dispatch(toDispatch(params))
  else if (isAction(toDispatch))
    return dispatch(toDispatch)
  else if (isIterable(toDispatch)) {
    let lastValue = null
    toDispatch.forEach(a => {
      lastValue = cleverDispatch(dispatch, getState, a, params)
    })
    return lastValue
  }
  console.warn(`Cannot dispatch ${toDispatch}`)
  return null
}

/**
 * Generates a flux-standard-action representing the given error
 * @param payload message || object
 * @returns {{type: string, error: boolean, payload: *}}
 */
export function generateFSAError(payload) {
  return {
    type: 'ERROR',
    error: true,
    payload
  }
}

/**
 * Generates a flux-standard-action representing the given success
 * @param payload message || object
 * @returns {{type: string, error: boolean, payload: *}}
 */
export function generateFSASuccess(payload) {
  return {
    type: 'SUCCESS',
    error: false,
    payload
  }
}

/**
 * Check if given param is a valid FSA action
 * @param obj
 * @returns {boolean}
 */
export function isAction(obj) {
  return obj !== null && typeof(obj) === 'object' && typeof(obj.type) === 'string'
}

function isIterable(obj) {
  return obj !== null && typeof(obj[Symbol.iterator]) === 'function'
}