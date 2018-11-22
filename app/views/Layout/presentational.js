import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/i18n'
import { ds } from "./../../styles/tokens"
import { css, injectGlobal } from 'emotion'
import Container from './../../components/presentationals/Container'
import Navbar from './../../components/presentationals/Navbar'
import { withTheme } from './../../components/smart/ThemeProvider'

// Dynamic styles values (theme)
const backgrounds = {
  dark: `linear-gradient(180deg, ${ds.get('colors.midnightLightest')} 0%, ${ds.get('colors.midnightDark')} 100%)`,
  light: `linear-gradient(180deg, ${ds.get('colors.white')} 0%, ${ds.get('colors.grayMedium')} 100%, ${ds.get('colors.grayMedium')} 100%)`,
}
const textColors = {
  dark: 'text-white',
  light: 'text-dark',
}

class Layout extends PureComponent {
  componentDidMount() {
    this.props.componentDidMount()
  }

  render() {
    const { theme, children, locale, reputation, avatarSrc, t } = this.props
    return <I18nextProvider i18n={i18n}>
        <main lang={locale} className={
          ` min-h-screen
            flex
            flex-column
            m-0
            ${textColors[theme]}
          `
          .concat(' ', css({
            background: backgrounds[theme]
          }))
        }>
        <Container contained staticStyles='flex flex-col justify-center'>
            <header className='pt-5 mb-auto'>
              <Navbar reputation={reputation} avatarSrc={avatarSrc}/>
            </header>
            {children}
          </Container>
        </main>
    </I18nextProvider>
  }
}

export default withTheme(Layout)