/**
* NotificationScreen
* Notification options
* Enable
* Disable
*/

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Platform,
  Switch
} from 'react-native'

// internal components
import LoaderModal from '../../components/LoaderModal'
// import screen styles
import styles from './NotificationsStyles'
// third party
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'


class NotificationsScreen extends Component {

    constructor(props) {
        super(props)
        // set the defualt state
        this.state = {
          animating: true,
          modalVisible: true,
          transparent: true,
        }
    }

    // Set up the class and load data using the api
    // This will load the data from firebase
    // Add the data to the state and also a copy of the data for later changes
    componentDidMount() {
        // get the device uuid for identification
        let deviceUuid = this.props.DeviceInfo.getUniqueID()

        if(deviceUuid) {

            this.setState({
                animating: false,
                modalVisible: false,
                falseSwitchIsOn: false,
            })

            // this.props.FirebaseStack.database.ref('marketAlerts/'+deviceUuid).on('value', function(snapshot) {
            //
            //     let data = snapshot.val()
            //
            //     _this.setState({
            //         dataSource: _this.state.dataSource.cloneWithRows(data || []),
            //         animating: false,
            //         modalVisible: false,
            //         // keep a copy of the data for later manipulation
            //         dataCopy: snapshot.value
            //     })
            // })
        }
    }

    // when the switch is changing - do action
    switchChange = (value) => {
        this.setState({falseSwitchIsOn: value})
        if(value === true) {
            console.log('activate notifications')
        } else {
            console.log('deactivate notifications')
        }
    }

    // render component
    render() {



        return (
            <View style={styles.mainPadding, styles.listViewContainer}>

                <LoaderModal parentProps={this.state} />

                <Switch
                  onValueChange={this.switchChange}
                  style={{marginBottom: 10}}
                  value={this.state.falseSwitchIsOn} />

                <Text>Notification Settings</Text>

            </View>
        )
    }
}

module.exports = NotificationsScreen
