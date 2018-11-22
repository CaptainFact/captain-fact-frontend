import React from 'react'
import PropTypes from 'prop-types'
import { ds } from './../../../styles/tokens'
import { pxTo } from "design-system-utils"
import { css } from 'emotion'
import { keyframes } from 'react-emotion'
import { withTheme } from './../../smart/ThemeProvider'

const blobTheme = {
  backgrounds: {
    light: `linear-gradient(259.28deg, ${ds.get('colors.orangeRegular')} -33.81%, ${ds.get('colors.orangeLight')} 52.04%, #FFE8AB 87.43%)`,
    dark: `linear-gradient(149.53deg, ${ds.get('colors.cyanRegular')} -3.27%, ${ds.get('colors.lavenderRegular')} 81.48%)`
  },
  shadows: {
    dark: 'shadow-mediumDark',
    light: 'shadow-mediumLight',
  },
}

const from0to360 = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`

const from360to0 = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`


const baseFontSize = ds.get("type.sizes.baseFontSize")

// Will randomize our circles so it doesn't look the same
const shuffle = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

const ObjectiveBlob = ({ theme, done }) => {
  return done === true ? <div className={`w-30 h-30 flex items-center justify-center rounded-full ${blobTheme.shadows[theme]}`.concat(' ', css({
    background: blobTheme.backgrounds[theme],
  }))}>
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.00003 11.1703L1.83003 7.00027L0.410034 8.41027L6.00003 14.0003L18 2.00027L16.59 0.590271L6.00003 11.1703Z" fill="white" /></svg>
  </div>
  : <svg className={`${blobTheme.shadows[theme]}`.concat(' ',css({
    maxWidth: pxTo(20, baseFontSize, "rem"),
    maxHeight: pxTo(20, baseFontSize, "rem"),
    overflow: 'visible !important',
    '> circle': {
      fill: `url(#${theme})`
    }
  }))} id="organic-blob"  xmlns="http://www.w3.org/2000/svg" filter="url(#goo)">
    <defs>
      <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
      <linearGradient id="light" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" className={css({
          stopColor: ds.get('colors.orangeRegular'),
           stopOpacity: 1
    })}  />
        <stop offset="100%" className={css({
          stopColor: ds.get('colors.orangeLight'),
          stopOpacity: 1
        })} />
      </linearGradient>
      <linearGradient id="dark" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" className={css({
          stopColor: ds.get('colors.lavenderRegular'),
          stopOpacity: 1
        })} />
        <stop offset="100%" className={css({
          stopColor: ds.get('colors.cyanRegular'),
          stopOpacity: 1
        })} />
      </linearGradient>
    </defs>
    {
      shuffle([
        <circle
        key="1"
        className={css({
        animation: `${from360to0} 5s linear infinite`,
        cx: 6,
        cy: 4,
        r: 20,
        transformOrigin: '6px 4px',
      })} />,
        <circle
        key="2"
        className={css({
          animation: `${from0to360} 4s linear infinite`,
          animationDelay: '75ms',
          cx: 3,
          cy: 1,
          r: 20,
          transformOrigin: '3px 1px',
        })} />,
        <circle
        key="3"
        className={css({
          animation: `${from360to0} 5s linear infinite`,
          cx: 5,
          cy: 0,
          r: 20,
          transformOrigin: '6px 4px',
          animationDelay: '72ms',
        })} />,
        <circle
        key="4"
        className={css({
          animation: `${from0to360} 4s linear infinite`,
          animationDelay: '45ms',
          cx: 6,
          cy: 4,
          r: 20,
          transformOrigin: '6px 4px',
        })} />]).map(el => el)
    }
  </svg>
}

ObjectiveBlob.propTypes = {
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
  done: PropTypes.bool.isRequired,
}

export default withTheme(ObjectiveBlob)