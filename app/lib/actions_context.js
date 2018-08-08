/**
 * Extract video hash ID from context. If context is not
 * VideoDebate, return null.
 * @param {string} context
 */
export const videoHashIDFromContext = context => {
  if (!context)
    return null

  const [universe, identifier] = context.split(':')
  if (universe === 'VD')
    return identifier
  return null
}
