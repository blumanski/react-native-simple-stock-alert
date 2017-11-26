import { StyleSheet } from 'react-native'

var styles = StyleSheet.create({
    listViewContainer: {
        flex: 1,
        paddingTop: 0,
        paddingBottom:10,
        flexDirection: 'column',
    },
    mainPadding: {
      padding: 0
    },
    itemBlock: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 0,
        borderColor: '#dedede',
        borderBottomWidth: 1,
        padding: 15
    },
    removeItem: {
        marginRight: 20
    },
    removeAlert: {
      marginRight: 10,
      marginLeft: 7,
      color: '#aa0000',
      fontSize: 32,
    }
});


export default styles
