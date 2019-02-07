const path = require('path')
const fileExistsCaseInsensitive = require('react-styleguidist/scripts/utils/findFileCaseInsensitive')

module.exports = {
  title: 'CaptainFact - Style Guide',
  components: 'app/components/**/*.jsx',
  skipComponentsWithoutExample: true,
  usageMode: 'expand',
  getExampleFilename(componentPath) {
    const examplePath = path.join(
      __dirname,
      'styleguide/examples',
      `${path.parse(componentPath).name}.md`
    )
    return fileExistsCaseInsensitive(examplePath) || false
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/Wrapper')
  },
  require: [path.join(__dirname, 'app/styles/application.sass')]
}
