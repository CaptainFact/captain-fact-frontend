const path = require('path')
const fileExistsCaseInsensitive = require('react-styleguidist/scripts/utils/findFileCaseInsensitive')

module.exports = {
  components: 'app/components/**/*.jsx',
  skipComponentsWithoutExample: true,
  getExampleFilename(componentPath) {
    const examplePath = path.join(
      __dirname,
      'styleguide',
      'examples',
      `${path.parse(componentPath).name}.md`
    )
    const existingFile = fileExistsCaseInsensitive(examplePath)
    if (existingFile) {
      return existingFile
    }
    return false
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/Wrapper')
  }
}
