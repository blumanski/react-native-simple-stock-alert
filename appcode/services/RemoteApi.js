import AppConfig from '../AppConfig';

class RemoteApi {

    static removeAlert(id, hwid) {

        return new Promise(function (resolve, reject){

            let removeAlert = new Request(AppConfig.getConfig().remoteApi + "/v1/alerts/removeAlert/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'id='+id+'&hwid='+hwid
            });

            fetch(removeAlert)
              .then(function(response) {
                return response.json()
              })
              .then(function(json) {
                resolve(json)
            })
            .catch(function(error){
                reject(error)
            });
        })
    }

    // get all active alerts
    static getAlerts(hwid) {

        return new Promise(function (resolve, reject){

            let getAlerts = new Request(AppConfig.getConfig().remoteApi + "/v1/alerts/getactivealerts/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'action=getRates&hwid='+hwid
            });

            fetch(getAlerts)
              .then(function(response) {
                return response.json()
              })
              .then(function(json) {
                resolve(json)
            })
            .catch(function(error){
                reject(error)
            });
        })
    }

    // get the newest rates
    static getRates() {
        return new Promise(function (resolve, reject){

            let getMarketData = new Request(AppConfig.getConfig().remoteApi + "/v1/alerts/getrates/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'action=getRates'
            });

            fetch(getMarketData)
              .then(function(response) {
                return response.json()
              })
              .then(function(json) {
                resolve(json)
            })
            .catch(function(error){
                reject(error)
            });
        })
    }

    static getMarkets() {

        return new Promise(function (resolve, reject){

            let getMarketData = new Request(AppConfig.getConfig().remoteApi + "/v1/alerts/getmarkets/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'action=getmarkets'
            });

            fetch(getMarketData)
              .then(function(response) {
                return response.json()
              })
              .then(function(json) {
                resolve(json)
            })
            .catch(function(error){
                reject(error)
            });
        })
    }

    // save a new alert to the remote database
    static saveAlert(market, rate, direction, deviceId) {

        return new Promise(function (resolve, reject){

            let saveAlert = new Request(AppConfig.getConfig().remoteApi + "/v1/alerts/savealert/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: 'action=saveAlert&market='+market+'&rate='+rate+'&direction='+direction+'&hwid='+deviceId+''
            });

            fetch(saveAlert)
              .then(function(response) {
                return response.json()
              })
              .then(function(json) {
                resolve(json)
            })
            .catch(function(error){
                reject(error)
            });
        })
    }

}

export default RemoteApi
