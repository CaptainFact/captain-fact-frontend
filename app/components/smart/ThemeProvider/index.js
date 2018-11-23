//
// Theme provider
import React, { createContext, PureComponent } from "react"

// Theme consts
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'

// Declare context
export const ThemeContext = createContext({
  theme: "",
  setTheme: () => { }
})

// Declare provider
class ThemeProvider extends PureComponent {
  state = {
    theme: localStorage.getItem('cf-theme') !== null ? localStorage.getItem('cf-theme') : THEME_DARK,
    setTheme: () => this.setState({ theme: this.state.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK }, () => {
      localStorage.setItem('cf-theme', this.state.theme)
    })
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

//
// HOC to access theme more easily
export const withTheme = Component => props => (
  <ThemeContext.Consumer>
    {store => <Component {...props} {...store} />}
  </ThemeContext.Consumer>
)

export default ThemeProvider
