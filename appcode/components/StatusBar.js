/**
* StatusBar.js
* This creates the top padding for the app as otehrwise
* the app would awekwardly overley the sattus bar
*/

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Platform
} from 'react-native';

class StatusBarBackground extends Component {

  render() {
    return (
      <View
        style={[
            styles.statusBarBackground,
            this.props.style || {} ]}
        >
        </View>
    )
  }

}

const styles = StyleSheet.create({
  statusBarBackground: {
    // seems that android does not need this but iso does
    height: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: 'black'
  }
});

module.exports = StatusBarBackground;
