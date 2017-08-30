const merge = require('lodash.merge')
const defaultConfig = require('./defaultConfig')
const customConfig = require('./customConfig')

module.exports = merge(defaultConfig, customConfig)
