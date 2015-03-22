app.controller('AuthController', ['$scope', '$rootScope', '$cookies', '$q', '$resource', '$window', '$location', 'HashFactory', 'AuthService', 'ResourceService', function($scope, $rootScope, $cookies,  $q, $resource, $window, $location, HashFactory, AuthService, ResourceService) {
    var Client = ResourceService.Client;
    $scope.credentials = {
        username: "",
        password: ""
    }

    $scope.login = function() {
        var client = {};
        client.clientname = $scope.credentials.clientname;
        client.password = HashFactory.hash($scope.credentials.password);

        Client.login(client, function(client) {
            var token = client.token;
            /* The token is saved only for this session in the web browser */
            $window.sessionStorage.token = token;
            $rootScope.addAlert('success', 'Welcome!');
            Client.me(null, function(client) {
                $rootScope.client = client;
            });
            $location.path('/');
        }, function (error) {
            $rootScope.addAlert('danger', 'Wrong combination clientname/password.');
        });
    }

    $scope.register = function () {
        $rootScope.toggleLoading();

        var client = new Client({
            email: $scope.credentials.email,
            password: CryptoJS.SHA512($scope.credentials.password).toString(CryptoJS.enc.Hex),
            fullname: $scope.credentials.fullname,
            clientname: $scope.credentials.clientname
        });
        var passwordConfirmation  = CryptoJS.SHA512($scope.credentials.password_confirmation).toString(CryptoJS.enc.Hex);

        if (client.password == passwordConfirmation) {
            Client.register(client, function(client) {
                $location.path('/login');
                $rootScope.toggleLoading();
            }, function(err) {
                $location.path('/register');
                $rootScope.toggleLoading();
                $rootScope.addAlert('danger', 'An error occured.');
            });
        } else {
            $rootScope.toggleLoading();
            $rootScope.addAlert('danger', 'Please fill all the fields required or correct them.', 5000);
        }
    };

    var remember = function(cred, token) {
        if (cred.rememberMe != undefined && cred.rememberMe) {
            $cookies.token = token;
        }
    }

    $scope.logout = function() {
        delete $window.sessionStorage.token;
        $location.path('/login');
    }
}]);
