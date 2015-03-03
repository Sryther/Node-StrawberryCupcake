app.factory('AuthService', ['$http', '$window', function($http, $window) {
    return {
        login: function(user) {
            return $http.post('/api/sessions', user);
        },
        logout: function() {
            $window.sessionStorage.token = false;
        },
        isLoggedIn: function() {
            return $window.sessionStorage.token !== 'undefined' ? true : false;
        },
        getPermissions: function() {
            // todo
        }
    };
}]);
