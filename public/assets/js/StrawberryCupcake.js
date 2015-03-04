var app = angular.module('StrawberryCupcake',
    [
        'ui.router',
        'ui.bootstrap',
        'ngCookies',
        'ngResource',
        'uiGmapgoogle-maps'
    ]
);
;app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBMA4UIe4S5OjrZlNQx6DDME-xFxg0r-2w',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
;app.controller('ConversationsController', ['$scope', '$rootScope', '$stateParams', 'ResourceService', function ($scope, $rootScope, $stateParams, ResourceService) {
    var Conversation = ResourceService.Conversation;
    $scope.conversations = [];
    $scope.currentConversation = {};
    $scope.username = "";

    if ($stateParams.username) {
        $scope.username = $stateParams.username;
    }

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
        Conversation.all({id: id}, function(data) {
            $scope.currentConversation = data;
            angular.forEach($scope.currentConversation, function(v, k) {
                var date = new Date(v.datetime);
                $scope.currentConversation[k].datetime = date.toDateString() + ' ' + date.toLocaleTimeString();
            });
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
;app.controller('UsersController', ['$scope', '$rootScope', '$stateParams', 'ResourceService', 'uiGmapGoogleMapApi', function ($scope, $rootScope, $stateParams, ResourceService, uiGmapGoogleMapApi) {
    var User = ResourceService.User;
    $scope.users = [];
    $scope.currentUser = {};

    if ($stateParams.username) {
        $scope.username = $stateParams.username;
    }

    // Pagination
    $scope.numPerPage = 20;
    $scope.filteredUsers = [];
    $scope.currentPage = 1;

    $scope.selectAll = {
        isSelected: false
    };

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        User.all(null, function(data) {
            $scope.users = data;
            angular.forEach($scope.users, function(v, k) {
                $scope.users[k].isSelected = false;
            });
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.setError(error.message);
        });
    }

    $scope.get = function(username) {
        User.get({id: username}, function(data) {
            $scope.currentUser = data;

            $scope.currentUser.geo = $scope.currentUser.geo.split(",");
            $scope.map = {
                center: {
                    latitude: $scope.currentUser.geo[0],
                    longitude: $scope.currentUser.geo[1]
                },
                 zoom: 10
            };
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }

    $scope.numPages = function () {
        return Math.ceil($scope.users.length / $scope.numPerPage);
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        $scope.filteredUsers = $scope.users.slice(begin, end);
    };

    $scope.$watch('users', function() {
        if ($scope.users.length > 0) {
            $scope.pageChanged();
        }
    });

    $scope.$watch('selectAll.isSelected', function() {
        $scope.all();
    });

    $scope.all = function() {
        angular.forEach($scope.users, function (v, k) {
            $scope.users[k].isSelected = $scope.selectAll.isSelected;
        });
    };

    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
             zoom: 8
        };
    });
}]);
;app.directive('icheck', ['$timeout', function($timeout) {
	return {
		require: 'ngModel',
		link: function($scope, element, $attrs, ngModel) {
			return $timeout(function() {
				var value;
				value = $attrs['value'];

				$scope.$watch($attrs['ngModel'], function(newValue){
					$(element).iCheck('update');
				})

				return $(element).iCheck({
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green',
					increaseArea: '20%'

				}).on('ifChanged', function(event) {
					if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
						$scope.$apply(function() {
							return ngModel.$setViewValue(event.target.checked);
						});
					}
					if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
						return $scope.$apply(function() {
							return ngModel.$setViewValue(value);
						});
					}
				});
			});
		}
	};
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
        templateUrl: "/ng/dashboard/home.html"
    })
    .state('users', {
        url: "/users",
        templateUrl: "/ng/users/all.html"
    })
    .state('getUser', {
        url: "/users/:username",
        templateUrl: "/ng/users/get.html"
    })
    .state('conversations', {
        url: "/conversations",
        templateUrl: "/ng/conversations/all.html"
    })
    .state('getConversation', {
        url: "/conversations/:username",
        templateUrl: "/ng/conversations/get.html"
    })
});
