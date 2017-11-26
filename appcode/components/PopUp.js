/**
* PopUp.js
* Shows a small popup
* Can be used in all screens
*/

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

class PopUp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }
    }

    toggleVisibility = () => {
        this.setState({visible: !this.state.visible})
    }

    // render the page loader
    render() {
        if(this.state.visible === true) {
            return (
                <View style={popStyle.popper}>
                    <TouchableOpacity style={popStyle.linker} onPress={}>
                        <Text>
                            New Alert
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={popStyle.linker}>
                        <Text>
                            New Spike
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (<View></View>)
        }

    }
}

export default popStyle = StyleSheet.create({
      popper: {
          backgroundColor: '#fff',
          position: 'absolute',
          right: 12,
          top: 60,
          width: 120,
          height: 120,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          zIndex: 100
      },
      linker: {
          paddingLeft: 6,
          paddingTop: 5,
          paddingBottom: 5,
          marginBottom: 5,

      }
});

module.exports = PopUp
