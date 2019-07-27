/**
 * Extension content scripts load after CaptainFact. We could have created a message
 * interface to communicate between the two but as our need is very basic for now
 * (detecting if extension is installed) we wait 5 seconds and check.
 * @returns {Promise}
 */
export const checkExtensionInstall = () => {
  return new Promise(fulfill => {
    setTimeout(
      () => fulfill(!!document.getElementById('captainfact-extension-installed')),
      5000
    )
  })
}
