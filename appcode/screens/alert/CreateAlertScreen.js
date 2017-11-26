/**
* CreateAlertsScreen.js
* Shows a form to create a new alert
* Getting the symbols/markets from firebase
* Display form
* Save form
*/

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native'

// third party
var t = require('tcomb-form-native');
import dismissKeyboard from 'dismissKeyboard'
import _ from 'lodash'
// internal components
import LoaderModal from '../../components/LoaderModal'
// screens tyles
import styles from './CreateAlertStyles'
const stylesheet = _.cloneDeep(t.form.Form.stylesheet)
stylesheet.textbox.normal.borderColor = 'transparent'

// set up tcomb form
let Form = t.form.Form;
// options for tcomb form
let options = {
    auto: 'placeholders',
    fields: {
        symbol: {
            label: '',
            nullOption: {value: '', text: 'Select Symbol'},
            error: 'Select a symbol',
            // onBlur: function() { console.log('symbol onblur') },
            // onFocus: function(event) { console.log('symbol onfocus') },
            // onEndEditing: function(event) { console.log('symbol end editing') },
        },
        direction: {
            label: '',
            nullOption: {value: '', text: 'Select Direction'},
            error: 'Select a a direction.'
        },
        rate: {
            label: '',
            stylesheet: stylesheet
            // onBlur: function() { console.log('rate onblur') },
            // onFocus: function(event) { console.log('rate onforcus') },
        }
    }
}

const spikeType = t.enums({
  '0.25': 'Small (0.25%)',
  '0.5': 'Medium (0.50%)',
  '1.0': 'Big (1%)'
})

let SpikeForm = t.form.Form;
// options for tcomb form
let optionsSpike = {
    auto: 'placeholders',
    fields: {
        symbol: {
            label: '',
            nullOption: {value: '', text: 'Select Symbol'},
            error: 'Select a symbol',
            // onBlur: function() { console.log('symbol onblur') },
            // onFocus: function(event) { console.log('symbol onfocus') },
            // onEndEditing: function(event) { console.log('symbol end editing') },
        },
        type: {
            label: '',
            nullOption: {value: '', text: 'Select Type'},
            error: 'Select a Type',
            // onBlur: function() { console.log('symbol onblur') },
            // onFocus: function(event) { console.log('symbol onfocus') },
            // onEndEditing: function(event) { console.log('symbol end editing') },
        }
    }
}

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

class CreateAlertScreen extends Component {

    constructor(props) {
        super(props)
        // states defaults
        this.state = {
            animating: true,
            modalVisible: true,
            transparent: true,
            symbolOptions: t.enums({}),
            symbol: {},
            options: options
        }
    }

    onChange(value) {

     }

    // Return the form structure
    // we have to do this this way to be able to inject the data loaded from firebase
    // in this case the markets
    getForm() {
        return(t.struct({
              symbol: this.state.symbolOptions,
              rate: t.Number,
              direction: t.enums({0: 'Below', 1: 'Above'})
            })
        )
    }

    // Return the start options for this form
    getFormOptions() {
        return(options)
    }

    getSpikeForm() {
        return(t.struct({
              symbol: this.state.symbolOptions,
              type: spikeType
            })
        )
    }

    getSpikeFormOptions() {
        return(optionsSpike)
    }

    // default api calls live in here
    componentDidMount() {

        // get the markets for the form, this will fill the symbol select field
        this.props.Firebase.database().ref('symbols/').once('value').then((snapshot) => {

            let data = (Platform.OS === 'ios') ? snapshot.val().filter(Boolean) : snapshot.val()
            let markets = _.values(data)
            // new object to hold the new options
            var symbolOptions = {};
            // walk through the array
            markets = markets.map((value, index) => {
                if(value) {
                    if(Allowed[value["name"]] && Allowed[value["name"]]['name']) {
                        //add new index to object
                        symbolOptions[value["name"]] = Allowed[value["name"]]['name'];
                    }
                }
            })
            // update the state, which will update the form
            this.setState({
                symbolOptions: t.enums(symbolOptions),
                animating: false,
                modalVisible: false,
            })

        }).catch((error) => {
            console.log(error)
        })
    }

    // new spike alert
    onPressSpike() {
        dismissKeyboard()
        // start loader animation
        this.setState({
            animating: true,
            modalVisible: true,
        })

        // get form values
        var value = this.refs.spikeform.getValue();

        if (value) { // if validation fails, value will be null
            // get device uuid to save the data
            let deviceUuid = this.props.DeviceInfo.getUniqueID()

            if(value) {
                // save the data to firebase
                this.props.Firebase.database().ref('marketSpikes/'+deviceUuid+'/'+value.symbol).set({
                    symbol: value.symbol,
                    type: value.type,
                    dateCreated: new Date(),
                    deviceUuid: deviceUuid

                }).then((reference) => {
                    // stop the loader animation
                    this.setState({animating: false, modalVisible: false,})
                    this.props.goToPage(2)

                }).catch((error) => {

                    //console.log(error)
                })
            }

        } else {
            // stop loader animation
            this.setState({
                animating: false,
                modalVisible: false,
            })
        }
    }

    // On form submit
    onPress() {
        dismissKeyboard()
        // start loader animation
        this.setState({
            animating: true,
            modalVisible: true,
        })

        // get form values
        var value = this.refs.form.getValue();


        if (value) { // if validation fails, value will be null
            // get device uuid to save the data
            let deviceUuid = this.props.DeviceInfo.getUniqueID()

            if(value) {
                // save the data to firebase
                this.props.Firebase.database().ref('marketAlerts/'+deviceUuid).push({
                    symbol: value.symbol,
                    rate: value.rate,
                    direction: value.direction,
                    dateCreated: new Date(),
                    deviceUuid: deviceUuid

                }).then((reference) => {
                    // stop the loader animation
                    this.setState({animating: false, modalVisible: false,})
                    this.props.goToPage(1)

                }).catch((error) => {

                    //console.log(error)
                })
          }
        } else {
            // stop loader animation
            this.setState({
                animating: false,
                modalVisible: false,
            })
        }
    }

    // default component render method
    render() {
        // show only if the form data was loaded from firebaase
        // This will re render after the setState changed the data
        if(this.state.symbolOptions) {

            return (
                <View style={styles.container, styles.mainPadding}>

                    <LoaderModal parentProps={this.state} />

                    <View style={styles.wrapper}>
                        <Text style={styles.cardHeadline}>
                            New Alert
                        </Text>
                        <View style={styles.formWrapper}>
                            <Form
                              ref="form"
                              type={this.getForm()}
                              options={this.getFormOptions()}
                              value={this.state.formValue}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={(form) => this.onPress()}
                                underlayColor='#99d9f4'
                            >
                              <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex: 1, height: 15}}></View>

                    <View style={styles.wrapper}>
                        <Text style={styles.cardHeadline}>
                            New Spike Alert
                        </Text>
                        <Text style={{fontSize: 12, padding: 5}}>
                            A spike, is a move up or down in the last 20 minutes.
                        </Text>
                        <View style={styles.formWrapper}>
                            <Form
                              ref="spikeform"
                              type={this.getSpikeForm()}
                              options={this.getSpikeFormOptions()}
                              value={this.state.formValue}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={(spikeform) => this.onPressSpike()}
                                underlayColor='#99d9f4'
                            >
                              <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )

        } else {
            // in case that no markets were loaded from firebase
            // or that is still in progress, show the loader animation
            return (
                <LoaderModal parentProps={this.state} />
            )
        }
    }
}

module.exports = CreateAlertScreen
