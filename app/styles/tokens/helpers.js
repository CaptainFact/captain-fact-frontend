import { ds } from './'
import { pxTo } from "design-system-utils"
const baseFontSize = ds.get("type.sizes.baseFontSize")

const breakpoints = {
  xs: pxTo(ds.get("breakpoints.xs"), baseFontSize, "rem"),
  sm: pxTo(ds.get("breakpoints.sm"), baseFontSize, "rem"),
  md: pxTo(ds.get("breakpoints.md"), baseFontSize, "rem"),
  lg: pxTo(ds.get("breakpoints.lg"), baseFontSize, "rem"),
  xl: pxTo(ds.get("breakpoints.xl"), baseFontSize, "rem")
}

const mq = {}
Object.keys(breakpoints).map(bp => mq[bp] = `@media(min-width: ${breakpoints[bp]})`)

export { mq }