import { createRenderer } from 'fela'
import { mapValueToMediaQuery } from 'fela-tools'

// Fela plugins (exact order)
import extend from 'fela-plugin-extend'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallbackValue from 'fela-plugin-fallback-value'
import namedKeys from 'fela-plugin-named-keys'
import { pxTo } from 'design-system-utils'

// Design tokens
import { ds } from './tokens'

const baseFontSize = ds.get('type.baseFontSize')
const xxsOnlyBreakpoint = pxTo(ds.bp('xs') - 1, baseFontSize, 'rem')
const xsBreakpoint = pxTo(ds.bp('xs'), baseFontSize, 'rem')
const smBreakpoint = pxTo(ds.bp('sm'), baseFontSize, 'rem')
const mdBreakpoint = pxTo(ds.bp('md'), baseFontSize, 'rem')
const lgBreakpoint = pxTo(ds.bp('lg'), baseFontSize, 'rem')
const xlBreakpoint = pxTo(ds.bp('xl'), baseFontSize, 'rem')

const namedKeysPlugin = namedKeys({
  xxsOnly: `@media (min-width: ${xxsOnlyBreakpoint})`,
  xs: `@media (min-width: ${xsBreakpoint})`,
  sm: `@media (min-width: ${smBreakpoint})`,
  md: `@media (min-width: ${mdBreakpoint})`,
  lg: `@media (min-width: ${lgBreakpoint})`,
  xl: `@media (min-width: ${xlBreakpoint})`,
})

/*
**
*** Fela renderer config
*** plugins order matters !
**
*/

export default () => {
  const renderer = createRenderer({
    plugins: [extend(), embedded(), namedKeysPlugin, prefixer(), fallbackValue()],
  })

  return renderer
}
