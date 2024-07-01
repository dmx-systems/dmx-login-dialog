module.exports = {
    modulePaths: ['src'],
    moduleFileExtensions: ['js', 'vue'],
    transformIgnorePatterns: ['/node_modules/(?!(dmx-api)/)'],
    transform: {
      '^.+\\.js$': 'babel-jest',
      '^.+\\.vue$': '@vue/vue2-jest'
    }
  }
  