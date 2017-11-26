import { StyleSheet } from 'react-native'

var styles = StyleSheet.create({
    viewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch'

    },
    mainPadding: {
      padding: 12
    },
    textbr: {
      marginTop: 20
    },
    topPadding: {
    marginTop: 100
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 44,
    width: 120,
    backgroundColor: '#666666',
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
},
cardHeadline: {
    flex: 1,
    backgroundColor: '#666',
    color: '#fff',
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8
},
wrapper: {
    flex: 1,
    padding: 0,
    backgroundColor: '#efefef',
    marginBottom: 20
},
formWrapper: {
    flex: 1,
    padding: 10,
    backgroundColor: '#efefef',
    marginBottom: 20
}
});


export default styles
