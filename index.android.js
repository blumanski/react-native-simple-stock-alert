// Entry file for android
// Will call appcode/App.js
import React, {Component} from 'react'
import {
  AppRegistry
} from 'react-native'

var manskimarketalert = require('./appcode/App')

AppRegistry.registerComponent('manskimarketalert', () => manskimarketalert)
