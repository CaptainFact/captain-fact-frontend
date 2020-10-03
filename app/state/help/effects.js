import { setContent, setLoading } from './reducer'

const ERROR_NOT_FOUND = 'not_found'

export const fetchHelpPage = (pageName) => (dispatch, getState) => {
  const locale = getState().UserPreferences.locale
  dispatch(setLoading(true))
  dispatch(
    setContent(
      fetch(`/assets/help/${locale}/${pageName}.md`).then((response) => {
        const contentType = response.headers.get('Content-Type')
        if (contentType && !contentType.includes('markdown')) {
          throw ERROR_NOT_FOUND
        }
        if (response.status === 200 || response.status === 304) {
          return response.text()
        }
        if (response.status === 404) {
          return ERROR_NOT_FOUND
        }
        throw new Error('Cannot fetch help page')
      })
    )
  )
}
