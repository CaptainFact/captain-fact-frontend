import React, { Component } from 'react'

export default class IconsSet extends Component {
  state = {

  };

  render() {
    return ( 
      <svg style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}}>
        <defs>
          <linearGradient id="lgrad" x1="79%" y1="100%" x2="21%" y2="0%" > 
            <stop offset="0%" stopColor='rgb(22,158,248)' stopOpacity='1' />
            <stop offset="100%" stopColor='rgb(22,203,248)' stopOpacity='1' />
          </linearGradient> 
          <symbol id="icon-videos" viewBox="0 0 28 18">
            <title>videos</title>
            <path d="M0 2.25c0-1.243 1.007-2.25 2.25-2.25v0h16.594c1.243 0 2.25 1.007 2.25 2.25v0 2.7l3.756-1.923c1.496-0.767 3.275 0.321 3.275 2.003v7.94c0 1.682-1.779 2.77-3.275 2.002l-3.756-1.923v2.7c0 1.243-1.007 2.25-2.25 2.25v0h-16.594c-1.243 0-2.25-1.007-2.25-2.25v0z"></path>
          </symbol>
          <symbol id="icon-arrow-down" viewBox="0 0 36 18">
            <title>arrow-down</title>
            <path strokeWidth="3" d="M0 0l18 18 18-18"></path>
          </symbol>
          <symbol id="icon-settings" viewBox="0 0 18 18">
            <title>settings</title>
            <path d="M15.532 6.714l-0.305-0.742c1.049-2.421 0.981-2.493 0.775-2.7l-1.341-1.338-0.132-0.114h-0.155c-0.084 0-0.326 0-2.365 0.943l-0.751-0.31c-0.971-2.453-1.069-2.453-1.357-2.453h-1.889c-0.284 0-0.394 0-1.292 2.462l-0.747 0.31c-1.377-0.594-2.185-0.9-2.403-0.9h-0.18l-1.439 1.44c-0.222 0.225-0.3 0.299 0.811 2.682l-0.306 0.739c-2.455 0.968-2.455 1.062-2.455 1.367v1.886c0 0.297 0 0.401 2.464 1.303l0.306 0.738c-1.049 2.421-0.978 2.493-0.775 2.7l1.341 1.339 0.132 0.117h0.157c0.081 0 0.323 0 2.364-0.945l0.749 0.312c0.97 2.449 1.069 2.449 1.362 2.449h1.884c0.29 0 0.392 0 1.295-2.461l0.751-0.31c1.377 0.594 2.182 0.901 2.399 0.901h0.18l1.454-1.453c0.207-0.212 0.279-0.287-0.824-2.66l0.305-0.739c2.457-0.979 2.457-1.082 2.457-1.377v-1.886c0-0.297 0-0.401-2.468-1.3zM9 12.149c-0.002 0-0.005 0-0.007 0-1.739 0-3.15-1.41-3.15-3.15 0-1.737 1.406-3.146 3.142-3.15h0c0.002 0 0.005 0 0.007 0 1.739 0 3.15 1.41 3.15 3.15 0 1.737-1.406 3.146-3.142 3.15h-0z"></path>
          </symbol>
          <symbol id="icon-limitations" viewBox="0 0 10 18">
            <title>limitations</title>
            <path d="M9.182 7.244c0 0 0 0 0 0 0.301 0 0.545 0.244 0.545 0.545 0 0.107-0.031 0.207-0.084 0.291l0.001-0.002-6.040 9.664c-0.323 0.517-1.121 0.196-0.997-0.4l1.372-6.585h-3.432c0 0 0 0 0 0-0.301 0-0.545-0.244-0.545-0.545 0-0.107 0.031-0.207 0.084-0.291l-0.001 0.002 6.040-9.665c0.322-0.516 1.12-0.196 0.997 0.4l-1.372 6.585z"></path>
          </symbol>
          <symbol id="icon-help" viewBox="0 0 18 18">
            <title>help</title>
            <path d="M18 9c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9zM8.923 9.040c-0.203 0.042-0.449 0.076-0.699 0.095l-0.020 0.001v1.659h1.142v-0.854c0.23-0.047 0.432-0.112 0.624-0.195l-0.021 0.008c0.197-0.082 0.378-0.201 0.532-0.35 0.157-0.154 0.283-0.348 0.379-0.585 0.096-0.24 0.144-0.537 0.144-0.892 0-0.412-0.057-0.751-0.173-1.016-0.115-0.269-0.269-0.48-0.46-0.633-0.184-0.148-0.404-0.259-0.645-0.319l-0.012-0.002c-0.229-0.058-0.491-0.091-0.761-0.091-0 0-0.001 0-0.001 0h0c-0.275 0-0.525 0.016-0.753 0.048-0.231 0.028-0.429 0.064-0.624 0.109l0.040-0.008c-0.151 0.030-0.278 0.065-0.401 0.107l0.023-0.007c-0.044 0.013-0.087 0.028-0.129 0.044v0.867c0.151-0.026 0.303-0.048 0.456-0.067 0.143-0.017 0.287-0.033 0.431-0.048 0.133-0.015 0.288-0.024 0.445-0.024h0.001c0.23 0 0.431 0.015 0.604 0.044s0.318 0.083 0.437 0.163c0.118 0.077 0.206 0.184 0.263 0.321 0.061 0.137 0.091 0.315 0.091 0.532 0 0.224-0.033 0.407-0.101 0.551s-0.171 0.263-0.299 0.348l-0.003 0.002c-0.146 0.090-0.317 0.157-0.499 0.19l-0.009 0.001zM8.074 11.787c-0.019 0.093-0.028 0.215-0.028 0.365 0 0.147 0.010 0.268 0.028 0.364 0.019 0.088 0.060 0.164 0.116 0.225l-0-0c0.061 0.056 0.137 0.095 0.222 0.11l0.003 0c0.096 0.022 0.216 0.033 0.36 0.033 0.147 0 0.268-0.011 0.364-0.033 0.088-0.014 0.165-0.054 0.225-0.111l-0 0c0.056-0.061 0.096-0.137 0.115-0.222l0.001-0.003c0.022-0.096 0.033-0.217 0.033-0.364 0-0.15-0.011-0.272-0.033-0.365-0.018-0.088-0.059-0.164-0.116-0.225l0 0c-0.060-0.057-0.137-0.096-0.223-0.11l-0.002-0c-0.1-0.019-0.215-0.029-0.332-0.029-0.011 0-0.023 0-0.034 0l0.002-0c-0.144 0-0.264 0.010-0.36 0.029-0.088 0.015-0.164 0.054-0.225 0.11l0-0c-0.057 0.061-0.098 0.137-0.115 0.222l-0 0.003z"></path>
          </symbol>
          {/* <symbol id="icon-arrow-right" viewBox="0 0 24 18">
            <title>arrow-right</title>
            <path fill="none" stroke="#e3f1f9" style="stroke: var(--color1, #e3f1f9)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="3" d="M1.5 9h21l-7.583-7.5M22.5 9l-7.583 7.5"></path>
          </symbol> */}
          <symbol id="icon-guide" viewBox="0 0 26 18">
            <title>guide</title>
            <path d="M1.937 3.028c-0.798-1.248 0.17-2.873 1.648-2.765l14.173 1.039c0.429 0.031 0.833 0.216 1.138 0.52l5.924 5.903c0.327 0.326 0.53 0.777 0.53 1.275s-0.202 0.949-0.53 1.275l-5.924 5.903c-0.295 0.294-0.692 0.486-1.132 0.52l-0.006 0-14.173 1.039c-1.478 0.108-2.446-1.517-1.648-2.765l3.2-5.002c0.378-0.591 0.378-1.349 0-1.94z"></path>
          </symbol>
        </defs>
      </svg>
    )
  }
}