import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router'
import { css } from 'emotion'
import { withNamespaces } from 'react-i18next'
import { pxTo } from 'design-system-utils'
import { withTheme } from './../../smart/ThemeProvider'
import Link from './../Link'
import sun from './../../../assets/icons/sun.svg'
import moon from './../../../assets/icons/moon.svg'
import { ds } from './../../../styles/tokens'

// Base font size (for rem calculation)
const baseFontSize = ds.get("type.sizes.baseFontSize")

// Theme-related styles
const colors = {
  dark: 'text-cyanRegular',
  light: 'textOrangeRegular',
}

const icons = {
  dark: sun,
  light: moon,
}
const submenuTheme = {
  backgrounds: {
    dark: `linear-gradient(180deg, ${ds.get('colors.midnightMedium')} 0%, ${ds.get('colors.midnightDark')} 121.05%)`,
    light: `linear-gradient(180deg, ${ds.get('colors.white')} 0%, ${ds.get('colors.grayMedium')} 121.05%);`,
  },
  shadows: {
    dark: 'shadow-slightDark',
    light: 'shadow-slightLight',
  },
  arrows: {
    dark: ds.get('colors.midnightDark'),
    light: ds.get('colors.whiteMedium'),
  },
  itemsBorders: {
    dark: 'border-navy',
    light: 'border-grayMedium'
  },
}

// Submenu items
const submenuItems = [
  {
    path: '/parameters',
    name: 'page.parameters',
  },
  {
    path: '/logout',
    name: 'label.logout',
  }
]
const Navbar = (props) => {
  const { reputation, avatarSrc, theme, setTheme, t, currentObjective, newVideos } = props

  // Main menu items
  const pages = [
    {
      path: '/city',
      name: 'page.city',
      subname: t('label.currentObjective', { currentObjective })
    },
    {
      path: '/videos',
      name: 'page.videos',
      subname: t('label.newVideos', { newVideos })
    },
    {
      path: '/me',
      name: 'page.me',
      subname: `(${reputation})`
    },
  ]

  return <nav className={'flex w-8/12 ml-auto items-center justify-between'}>
    <ul className={`flex list-reset flex-grow items-evenly`}>
      {pages.map(page => <li key={page.path}>
        <Link staticStyles='font-700' activeClassName="opacity-45 no-underline" component={RouterLink} key={page.path} to={page.path}>
          {t(`${page.name}`)} <small className={`text-sm opacity-inherit ${page.name.length > 8 ? 'block' : ''}`}>{page.subname}</small>
        </Link>
      </li>)}
    </ul>
    <div className={
      `relative`.concat(' ', css({
        '&:hover ul': {
          display: 'block',
        },
        '&:hover button::after': {
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: `0 ${pxTo(7.5, baseFontSize, 'rem')} ${pxTo(10, baseFontSize, 'rem')} ${pxTo(7.5, baseFontSize, 'rem')}`,
          borderColor: `transparent transparent ${submenuTheme.arrows[theme]} transparent`,
          position: 'absolute',
          content: '" "',
          display: 'block',
        },
      }))}>
      <button className='bg-transparent border-transparent hover:outline-none h-75 w-75 relative'>
        <img className='rounded-full w-full' src={avatarSrc} />
      </button>
      <ul className={`hidden absolute ${submenuTheme.shadows[theme]} rounded`.concat(' ', css({
        background: `${submenuTheme.backgrounds[theme]}`,
        minWidth: pxTo(150, baseFontSize, 'rem'),
        }))}
      >
        {submenuItems.map((item, index) => <li key={item.name} className={`text-sm ${index < submenuItems.length - 1 && `border-solid ${submenuTheme.itemsBorders[theme]} border-0 border-b-1` }`}>
          <Link staticStyles='font-700 p-10 block' underline={false} component={RouterLink} key={item.path} to={item.path}>
            {t(`${item.name}`)}
          </Link>
        </li>)
      }
      </ul>
    </div>
    {reputation > 500 && <button className='bg-transparent border-transparent outline-none' onClick={ () => setTheme() }>
      <div className='w-25' dangerouslySetInnerHTML={{ __html: icons[theme] }} />
    </button>
    }
  </nav>
}

// Typechecking
Navbar.propTypes = {
  currentObjective: PropTypes.shape({
    name: PropTypes.string,
    progression: PropTypes.string,
  }),
  newVideos: PropTypes.number,
  reputation: PropTypes.number,
  avatarSrc: PropTypes.string,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
  setTheme: PropTypes.func.isRequired
}

// Default props
Navbar.defaultProps = {
  newVideos: 5,
  currentObjective: {
    name: 'Aidez les îles voisines',
    progression: '28%',
  }
}

export default withNamespaces('menu')(withTheme(Navbar))