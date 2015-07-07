app.factory('BackgroundFactory', function($http) {

    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentUser = backgroundPage.user;
    var server = 'http://127.0.0.1:1337';
    
    var composeRequest = function (method, url, data) {
        return {
            method: method,
            url: server + url,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            },
            data: data
        }
    };

    var setUser = function(info) {
      currentUser.setLoggedInUser(info);
      return currentUser.getLoggedInUser();
    };

    return {

        setSelectedCircle: function (circle) {
            currentUser.setSelectedCircle(circle);
        },

        getBackgroundPage: function () {
            return backgroundPage;
        },

        getUserCircles: function () {
            var promiseForCircles = new Promise(function (resolve, reject) {
                resolve(currentUser.getLoggedInUser().myCircles)
            });
            
            return promiseForCircles;
        },

        registerUser: function(signUpInfo) {
            return $http(composeRequest('POST','/api/users', { nickname: signUpInfo.nickname, email: signUpInfo.email, password: signUpInfo.password }))
            .then(function (response) {
				var registeredUser = response.data.user;
				setUser(registeredUser);
				return registeredUser;
            })
            .catch(function (err) {
              console.log(err);
            })
        },

        logInUser: function(info) {
            return $http(composeRequest('POST', '/login', { email: info.email, password: info.password }))
            .then(function (response) {
                    chrome.tabs.query({url: server + '/*'}, function (tabs) {
                        if (tabs.length) {
                            chrome.tabs.sendMessage(tabs[0].id, {greeting: 'hello'}, function (res) {
                            })
                        };
                    })            
                    console.log('response.data.user: ', response.data.user)
				var returnedUser = response.data.user;
				setUser(returnedUser);
				return returnedUser;
            })
            .catch(function (err) {
              console.log(err);
            })
        },

        logOutUser: function() {
            return $http(composeRequest('GET', '/logout'))
            .then(function (response) {
                chrome.tabs.query({url: server + '/*'}, function (tabs) {
                    if (tabs.length) {
                        chrome.tabs.sendMessage(tabs[0].id, {greeting: 'hello'}, function (res) {});
                    };
                })      

                currentUser.setLogOutUser();
                return response.status;
            })
            .catch(function (err) {
                console.log(err);
            })
        },

        checkLoggedIn: function() {

            return $http(composeRequest('GET', '/session'))
            .then(function (response) {
                console.log('hit checkloggedin', response)

                return response.data;
            })
            .catch(function (err) {
                console.log('In checkLoggedIn', err);
            })
        },

        isLoggedIn: function () {

        	return backgroundPage.user.isLoggedIn();
        }
    }
})