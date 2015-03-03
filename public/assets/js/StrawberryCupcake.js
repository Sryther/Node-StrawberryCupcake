var app = angular.module('StrawberryCupcake',
    [
        'ui.router',
        'ui.bootstrap',
        'ngCookies',
        'ngResource'
    ]
);
;;app.controller('UsersController', ['$scope', '$rootScope', 'ResourceService', function ($scope, $rootScope, ResourceService) {
    var Conversation = ResourceService.Conversation;
    $scope.conversation = [];
    $scope.currentConversation = {};

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        $scope.conversation = Conversation.all(null, function(data) {
            $scope.conversation = data;
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.setError(error.message);
        });
    }

    $scope.get = function(id) {
        Conversation.get({id: id}, function(data) {
            $scope.currentConversation = data;
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }
}]);
;app.controller('ErrorsController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.error   = false;
    $scope.success = false;
    $scope.loading = false;
    $scope.messageError = "";
    $scope.messageSuccess = "";

    $rootScope.toggleLoading = function() {
        $scope.loading = !$scope.loading;
    }

    $rootScope.setError = function(message) {
        $scope.messageError = message;
        $scope.error        = true;
    }

    $rootScope.unsetError = function() {
        $scope.messageError = "";
        $scope.error        = false;
    }

    $rootScope.setSuccess = function(message) {
        $scope.messageSuccess = message;
        $scope.success        = true;
    }

    $rootScope.unsetSuccess = function() {
        $scope.messageSuccess = "";
        $scope.success        = false;
    }
}]);
;app.controller('TableController', ['$scope', function($scope) {
    $scope.orderByField = 'firstName';
    $scope.reverseSort = false;
}]);
;app.controller('UsersController', ['$scope', '$rootScope', 'ResourceService', function ($scope, $rootScope, ResourceService) {
    var User = ResourceService.User;
    $scope.users = [];
    $scope.currentUser = {};

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        $scope.users = User.all(null, function(data) {
            $scope.users = data;
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.setError(error.message);
        });
    }

    $scope.get = function(id) {
        User.get({id: id}, function(data) {
            $scope.currentUser = data;
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }
}]);
;app.factory('AuthService', ['$http', '$window', function($http, $window) {
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
;app.factory('ResourceService', ['$resource', function($resource) {
    var methods = {
        'update': { method:'PUT' },
        'all': { method:'GET', isArray:true }
    };
    var idTag = {
        id: '@id'
    };

    return {
        User: $resource('/api/users/:id', idTag, methods),
        Conversation: $resource('/api/conversations/:id', idTag, methods)
    };
}]);
;app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /404
    $urlRouterProvider.otherwise("/404");
    // ROUTES
    $stateProvider
    .state('404', {
        url: "/404",
        templateUrl: "/ng/errors/404.html"
    })
    .state('dashboard', {
        url: "",
        templateUrl: "/ng/dashboard/users.html"
    })
});
