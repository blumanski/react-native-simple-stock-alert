/**
* RatesScreen.js
* Shows the current rates of a selection of stock market data
* The data comes from firebase and is updated automatically
* every 4 minutes
* Show current stock market rates
*/

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native'

// screen styles
import styles from './RatesStyles'
// third party
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
// internal components
import LoaderModal from '../../components/LoaderModal'

let Allowed = {
            USOil:  {name: 'Oil', type: 'com', sort: 1, show: true},
            XAUUSD: {name: 'Gold', type: 'com', sort: 0, show: true},
            USDJPY: {name: 'USDJPY', type: 'cur', sort: 2, show: true},
            AUDUSD: {name: 'AUDUSD', type: 'cur', sort: 3, show: true},
            EURUSD: {name: 'EURUSD', type: 'cur', sort: 4, show: true},
            GER30:  {name: 'GER30', type: 'ind', sort: 5, show: true},
            AUS200: {name: 'AUS200', type: 'ind', sort: 6, show: true},
            SPX500: {name: 'SPX500', type: 'ind', sort: 7, show: true},
            NAS100: {name: 'NAS100', type: 'ind', sort: 8, show: true},
            JPN225: {name: 'JPN225', type: 'ind', sort: 9, show: true},
            US30:   {name: 'US30', type: 'ind', sort: 10, show: true},
            GBPUSD: {name: 'GBPUSD', type: 'cur', sort: 11, show: true},
            XAGUSD: {name: 'Silver', type: 'com', sort: 12, show: true},
            Copper: {name: 'Copper', type: 'com', sort: 13, show: true},
            UK100:  {name: 'UK100', type: 'ind', sort: 14, show: true},
            ESP35:  {name: 'ESP35', type: 'ind', sort: 15, show: true},
            USDCAD: {name: 'USDCAD', type: 'cur', sort: 16, show: true},
            USDCHF: {name: 'USDCHF', type: 'cur', sort: 17, show: true},
            EUSTX50: {name: 'EUSTX50', type: 'ind', sort: 18, show: true},
            FRA40:  {name: 'FRA40', type: 'ind', sort: 19, show: true},
            EURCHF: {name: 'EURCHF', type: 'cur', sort: 20, show: true},
            EURGBP: {name: 'EURGBP', type: 'cur', sort: 21, show: true},
            EURAUD: {name: 'EURAUD', type: 'cur', sort: 22, show: true},
            AUDJPY: {name: 'AUDJPY', type: 'cur', sort: 23, show: true},
            GBPAUD: {name: 'GBPAUD', type: 'cur', sort: 24, show: true},
            USDTRY: {name: 'USDTRY', type: 'cur', sort: 25, show: true},
            EURTRY: {name: 'EURTRY', type: 'cur', sort: 26, show: true},
}

class RatesScreen extends Component {

    constructor(props) {
        super(props)

        this.deviceUuid = null

        // set state defaults
        this.state = {
          animating: true,
          modalVisible: true,
          transparent: true,
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          marketConfig: Allowed
        }
    }

    // on didMount we subcribed to the firebase reference path
    // Now this has to get unsubscribed to free this.
    componentWillUnmount() {
        // set this path reference to off (unsubscribe channel callback)
        this.props.Firebase.database().ref('latestMarkets/').off()
    }

    // api call live here
    componentDidMount() {
        this.deviceUuid = this.props.DeviceInfo.getUniqueID()
        // get the config for the markets from database
        this.getMarketConfig()
            .then((snapshot) => {
                let config = snapshot.val()
                if(config && config.config) {
                    // set config if available
                    this.setState({
                        marketConfig: config.config
                    })
                }
                // Get the latest market rates from firebase and supbscribe them
                // They will automatically update on data change in the database
                // There is a cronjob which updates the database all x minutes
                this.props.Firebase.database().ref('latestMarkets/').on('value', snapshot => {
                    let snapper = snapshot.val()
                    if (snapper) {
                        // new object
                        let newRates = {}
                        let i = 0
                        // transform the data a bit to fit
                        Object.keys(snapper).forEach((key) => {
                            i++

                            if(this.state.marketConfig[key] && this.state.marketConfig[key]['name']) {
                                let newKey = this.state.marketConfig[key]['sort']
                                newRates[newKey] = {}
                                newRates[newKey]['name'] = this.state.marketConfig[key]['name']
                                newRates[newKey]['Ask'] = snapper[key].Ask
                                newRates[newKey]['Bid'] = snapper[key].Bid
                                newRates[newKey]['Direction'] = snapper[key].Direction
                                newRates[newKey]['High'] = snapper[key].High
                                newRates[newKey]['Low'] = snapper[key].Low
                                newRates[newKey]['Last'] = snapper[key].Last
                            }
                        })
                        // Set the data in the state
                        // setState will overwite the default data and will re render the list
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(newRates),
                            // stop the loader animation
                            animating: false,
                            modalVisible: false,
                        })
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
    }

    // at first, add dummy config to database
    addDummyConfig(config) {
        let data
        if(config) {
            data = config
        } else {
            data = this.state.marketConfig
        }

        this.props.Firebase.database().ref('marketConfig/'+this.deviceUuid).set({
            config: data
        })
    }
    // get the market config
    getMarketConfig() {
        return this.props.Firebase.database().ref('marketConfig/'+this.deviceUuid).once('value')
    }

    resetSymbols(index, name) {
        if(index && name) {
            this.props.Firebase.database().ref('symbols/'+index).set({
                name: name
            }).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        }

    }

    // render the direction Icon and return the result
    renderDirection(direction) {
        if(direction == 0) {
            return(
                <Icon style={styles.arrowDown} name="arrow-circle-down" />
            )
        } else {
            return(
                <Icon style={styles.arrowUp} name="arrow-circle-up" />
            )
        }
    }

    // render each item
    renderRow(row) {
        return (
          <View style={styles.itemBlock} key={row.name}>
              <Text style={styles.itemHeadline}>
                {this.renderDirection(row.Direction)} {`${row.name}`} {`${row.Ask}`}
              </Text>
              <Text style={this.props.globalStyles.lauftext}>
                Buy: {`${row.Ask}`} Sell: {`${row.Bid}`}
              </Text>
              <Text style={this.props.globalStyles.lauftext}>
                Low: {`${row.Bid}`} High: {`${row.Ask}`}
              </Text>
              {/*}
              <View style={styles.sorterView}>
                  <TouchableOpacity onPress={() => this.pinTop(row)}>
                    <Text style={styles.sorter}>
                        {this.renderSorter()}
                    </Text>
                  </TouchableOpacity>
              </View>
              {*/}
          </View>
        )
    }

    // render component
    render() {

        return (

            <View style={this.props.globalStyles.mainPadding, this.props.globalStyles.listViewContainer}>

                <LoaderModal parentProps={this.state} />

                <ListView
                    style={this.props.globalStyles.listViewContainer}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {return this.renderRow(rowData)}}
                />

            </View>
        )
    }
}

module.exports = RatesScreen
