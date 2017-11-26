/**
* MyAlertScreen
* This screen shows a list of users alerts.
* The alerts are assigned to the device uuid
* The device uuid changes after a reinstall.... that as a note
* Show Alerts
* Delete Alerts
*/

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Platform
} from 'react-native'

// internal components
import LoaderModal from '../../components/LoaderModal'
// import screen styles
import styles from './MySpikeStyles'
// third party
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'

const Allowed = {
            US30:   {name: 'US30', type: 'ind', sort: 0},
            SPX500: {name: 'SPX500', type: 'ind', sort: 1},
            NAS100: {name: 'NAS100', type: 'ind', sort: 2},
            GER30:  {name: 'GER30', type: 'ind', sort: 3},
            EUSTX50: {name: 'EUSTX50', type: 'ind', sort: 4},
            UK100:  {name: 'UK100', type: 'ind', sort: 5},
            JPN225: {name: 'JPN225', type: 'ind', sort: 6},
            FRA40:  {name: 'FRA40', type: 'ind', sort: 7},
            ESP35:  {name: 'ESP35', type: 'ind', sort: 8},
            AUS200: {name: 'AUS200', type: 'ind', sort: 9},
            USOil:  {name: 'Oil', type: 'com', sort: 10},
            XAUUSD: {name: 'Gold', type: 'com', sort: 11},
            XAGUSD: {name: 'Silver', type: 'com', sort: 12},
            Copper: {name: 'Copper', type: 'com', sort: 13},
            EURUSD: {name: 'EURUSD', type: 'cur', sort: 14},
            USDJPY: {name: 'USDJPY', type: 'cur', sort: 15},
            GBPUSD: {name: 'GBPUSD', type: 'cur', sort: 16},
            USDCHF: {name: 'USDCHF', type: 'cur', sort: 17},
            AUDUSD: {name: 'AUDUSD', type: 'cur', sort: 18},
            USDCAD: {name: 'USDCAD', type: 'cur', sort: 19},
            EURCHF: {name: 'EURCHF', type: 'cur', sort: 20},
            EURGBP: {name: 'EURGBP', type: 'cur', sort: 21},
            EURAUD: {name: 'EURAUD', type: 'cur', sort: 22},
            AUDJPY: {name: 'AUDJPY', type: 'cur', sort: 23},
            GBPAUD: {name: 'GBPAUD', type: 'cur', sort: 24},
            USDTRY: {name: 'USDTRY', type: 'cur', sort: 25},
            EURTRY: {name: 'EURTRY', type: 'cur', sort: 26},
}


class MySpikeScreen extends Component {

    constructor(props) {
        super(props)
        // set the defualt state
        this.state = {
          animating: true,
          modalVisible: true,
          transparent: true,
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
          dataCopy: null
        }
    }

    componentWillUnmount() {
        this.props.Firebase.database().ref('marketSpikes/'+deviceUuid).off('value')
    }

    // Set up the class and load data using the api
    // This will load the data from firebase
    // Add the data to the state and also a copy of the data for later changes
    componentDidMount() {
        // get the device uuid for identification
        let deviceUuid = this.props.DeviceInfo.getUniqueID()

        if(deviceUuid) {
            this.props.Firebase.database().ref('marketSpikes/'+deviceUuid).on('value', (snapshot) => {

                let data = snapshot.val()
                if(data) {
                    // change naming
                    Object.keys(data).forEach((key) => {
                        data[key]['symbol'] = Allowed[data[key]['symbol']]['name']
                    })

                    setTimeout(() => {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(data || []),
                            animating: false,
                            modalVisible: false,
                            // keep a copy of the data for later manipulation
                            dataCopy: data
                        })
                    }, 1000)

                } else {
                    // assign something to the data
                    let mockData = {data: false}
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(mockData),
                        animating: false,
                        modalVisible: false,
                    })
                }
            })
        }
    }

    getSpikes(deviceUuid) {

    }

    // remove alert
    // returns promise
    removeAlertItem(id, i) {
        // start the loader
        this.setState({
            animating: true,
            modalVisible: true,
        })
        // get the device uuid
        let deviceUuid = this.props.DeviceInfo.getUniqueID()

        // return a promise
        return new Promise((resolve, reject) => {

            if(deviceUuid) {
                // delete the item from the firebase database
                this.props.Firebase.database().ref('marketSpikes/'+deviceUuid).child(i)
                    .remove()
                    .then((response) => {
                        // remove was success
                        if(response.status && response.status == 'success') {
                                // resolve this promise
                                resolve('success')
                        } else {
                            // reject this
                            reject('failed')
                        }
                    })
                    .catch((error) => {
                        // reject this
                        reject(error)
                    })
            }
        })
    }

    // Render each row
    renderRow(row, sec, i) {
        // on empty data, return just te text instead
        if(row === false) {
            return (
                <View style={styles.itemBlock}  key={row.id}>
                    <Text style={this.props.globalStyles.lauftext}>No alert set yet.</Text>
                </View>
            )
        }

        // direction condition
        let direction = ''
        if(row.direction > 0) {
            direction = ' >= '
        } else {
            direction = ' <= '
        }
        // date format
        let dateCreated = moment(row.created).format('D MMM YYYY');
        let timeCreated = moment(row.created).format('h:mma');

        return (
          <View style={styles.itemBlock}  key={row.id}>

                <View style={{width: 40}}>
                    <TouchableOpacity
                        onPress={() => {
                          this.removeAlertItem(row.id, i)
                            .then(function(response) {
                                if(response != 'success') {
                                    this.setState({
                                        animating: false,
                                        modalVisible: false,
                                    })
                                }
                            })
                            .catch(function(error) {
                                //console.log(error)
                            })
                        }}

                        style={{padding: 0, top: 0}}
                    >
                        <Text style={this.props.globalStyles.lauftext}>
                            <Icon style={styles.removeAlert} name="times" />
                        </Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={{fontSize: 18, fontWeight: 'bold', paddingTop: 4, color: '#333'}}>
                      {`${row.symbol}`}
                    </Text>
                </View>

          </View>
        )
    }

    // render component
    render() {

        return (
            <View style={styles.mainPadding, styles.listViewContainer}>

                <LoaderModal parentProps={this.state} />

                <ListView
                    key={this._data}
                    style={styles.listViewContainer}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, sec, i) => {return this.renderRow(rowData, sec, i)}}
                />

            </View>
        )
    }
}

module.exports = MySpikeScreen
