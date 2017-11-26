/**
* Application wrapper and kick-starter
* is loading all the app screens
* is rendering the main layout
* is providing the routes
*/

import React, { Component } from 'react'
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
  ScrollView,
  Alert
} from 'react-native'

// third party
import DeviceInfo from 'react-native-device-info';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import FCM from 'react-native-fcm'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base'

import CodePush from "react-native-code-push"
import Fire, { app, database } from 'firebase'

// Components
import globalStyles from './GlobalStyles'
import StatusBar from './components/StatusBar'
import AppBar from './components/AppBar'
// screens
import MyAlertScreen from './screens/alert/MyAlertScreen'
import MySpikeScreen from './screens/alert/MySpikeScreen'
import CreateAlertScreen from './screens/alert/CreateAlertScreen'
import RatesScreen from './screens/rates/RatesScreen'
import NotificationsScreen from './screens/notifications/NotificationsScreen'
// config
import AppConfig from './AppConfig'
// set config
const Config = AppConfig.getConfig()

Firebase = Fire.initializeApp(Config.firebaseConfig)


class manskimarketalert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: Config.app.title,
        }
    }

    showAlert(message) {
        Alert.alert(
            'Notification',
            message,
           [
             {text: 'OK', onPress: () => this.closeAlert()},
           ],
           {
             cancelable: false
           }
       )
    }
    closeAlert() {}

    componentDidMount() {

        CodePush.sync({
            updateDialog: true,
            installMode: CodePush.InstallMode.IMMEDIATE
        })

        FCM.requestPermissions()
        // add device to database
        this.addDevice()
        // FCM.getInitialNotification((notif) => {
        //     console.log(notif)
        // })

        FCM.on('notification', (notif) => {

            if(notif.local_notification){
                // console.log(notif)
                console.log(notif.local_notification)
              //this is a local notification
            } else if(notif.opened_from_tray){
                // console.log(notif)
                // console.log(notif.opened_from_tray)
            } else {
                if(notif && typeof(notif) == 'object') {

                    if(notif.notification && notif.notification.body) {
                        this.showAlert(notif.notification.body)
                    } else {
                        let message = ''
                        Object.keys(notif).forEach((key) => {
                            message += notif[key]+"\n"
                        })
                        this.showAlert(message)
                    }
                }
            }

        })
    }

    addDevice() {
        FCM.getFCMToken()
            .then((cloudTokenData) => {
                if(cloudTokenData) {
                    let deviceUud = DeviceInfo.getUniqueID()
                    let token = ''
                    // adapt the returned token object or string
                    if(cloudTokenData.token) {
                        token = cloudTokenData.token
                    } else {
                        token = cloudTokenData
                    }

                    Firebase.database().ref('devices/'+deviceUud).set({
                        cloudToken: token,
                    }).then(() => {

                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
            .catch((error) => {
                //console.log(error)
            })
    }

    goToPage = (item) => {
        this.tabView.goToPage(item);
    }

    providePopUp(popup) {
        this.popUpProps = {popup}
    }

    toggleVisibility = () => {
        this.popUpProps.popup.toggleVisibility()
    }

  // render component
  render() {

      let globalNavigatorProps = {
        Firebase,
        FCM,
        DeviceInfo,
        globalStyles
      }

      return (
         <View style={styles.appMainContainer}>
            <StatusBar style={{backgroundColor: 'black'}} />

            <AppBar title={Config.app.title} toggleVisibility={this.toggleVisibility}/>


            <ScrollableTabView
                  renderTabBar={()=><ScrollableTabBar
                                        backgroundColor='#6EAD4E'
                                        inactiveTextColor='white'
                                        activeTextColor='white'
                                        underlineStyle={{backgroundColor: '#fff'}}
                                        tabBarTextStyle={{color: '#333'}}
                                    />}
                  tabBarPosition='overlayTop'
                  initialPage={0}
                  ref={(tabView) => {
                      if (tabView != null) {
                          this.tabView = tabView;
                      }
                  }}
                >

                  <ScrollView tabLabel='Rates' key='Rates' style={styles.scrollTabMargin}>
                      <RatesScreen goToPage={this.goToPage} {...globalNavigatorProps} />
                  </ScrollView>

                  <ScrollView tabLabel='Alerts'  key='Alerts' style={styles.scrollTabMargin}>
                      <MyAlertScreen goToPage={this.goToPage} {...globalNavigatorProps} />
                  </ScrollView>

                  <ScrollView tabLabel='Spikes'  key='Spikes' style={styles.scrollTabMargin}>
                      <MySpikeScreen goToPage={this.goToPage} {...globalNavigatorProps} />
                  </ScrollView>

                  <ScrollView
                        tabLabel='New'
                        key='CreateAlert'
                        style={styles.scrollTabMargin}
                        keyboardShouldPersistTaps={true}
                    >
                      <CreateAlertScreen goToPage={this.goToPage} {...globalNavigatorProps} />
                  </ScrollView>

            </ScrollableTabView>

        </View>
      )
    }
}

var styles = StyleSheet.create({
    appMainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    scrollTabMargin: {
        marginTop: 45
    }
})

module.exports = manskimarketalert
