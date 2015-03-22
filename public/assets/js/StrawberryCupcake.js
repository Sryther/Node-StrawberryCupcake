var app = angular.module('StrawberryCupcake',
    [
        'ui.router',
        'ui.bootstrap',
        'ngCookies',
        'ngResource',
        'permission',
        'uiGmapgoogle-maps',
        'btford.socket-io'
    ]
);
;app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBMA4UIe4S5OjrZlNQx6DDME-xFxg0r-2w',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
;app.controller('AuthController', ['$scope', '$rootScope', '$cookies', '$q', '$resource', '$window', '$location', 'HashFactory', 'AuthService', 'ResourceService', function($scope, $rootScope, $cookies,  $q, $resource, $window, $location, HashFactory, AuthService, ResourceService) {
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
;app.controller('ConversationsController', ['$scope', '$rootScope', '$stateParams', 'Socket', 'ResourceService', function ($scope, $rootScope, $stateParams, Socket, ResourceService) {
    var Conversation = ResourceService.Conversation;
    var Client = ResourceService.Client;
    $scope.conversations = [];
    $scope.currentConversation = {};
    $scope.session = "";
    $scope.yourMessage = "";

    $scope.socket = {};

    if ($stateParams.session) {
        $scope.session = $stateParams.session;
    }

    // Pagination
    $scope.numPerPage = 20;
    $scope.filteredConversations = [];
    $scope.currentPage = 1;

    $scope.selectAll = {
        isSelected: false
    };

    $scope.initSocket = function(token) {
        Client.me(null, function(client) {
            $scope.socket = Socket.connect(":1338/chat/" + client.clientname + "/" + token);

            $scope.socket.on('message', function (msg) {
                var message = msg.split('#');
                $scope.currentConversation.push({
                    message: message[1],
                    datetime: new Date(),
                    sender: message[0]
                })
            });
        }, function(err) {
            $rootScope.addAlert('danger', 'An error occured.');
        });
    }

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        Conversation.all(null, function(data) {
            $scope.conversations = data;
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.addAlert('danger', error.message);
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
            $rootScope.addAlert('danger', error.message);
        });
    }

    $scope.send = function() {
        $scope.socket.emit('message', "Team#" + $scope.yourMessage);
        $scope.yourMessage = "";
    }

    $scope.numPages = function () {
        return Math.ceil($scope.conversations.length / $scope.numPerPage);
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        $scope.filteredConversations = $scope.conversations.slice(begin, end);
    };

    $scope.$watch('conversations', function() {
        if ($scope.conversations.length > 0) {
            $scope.pageChanged();
        }
    });

    $scope.$watch('selectAll.isSelected', function() {
        $scope.all();
    });

    $scope.all = function() {
        angular.forEach($scope.conversations, function (v, k) {
            $scope.conversations[k].isSelected = $scope.selectAll.isSelected;
        });
    };
}]);
;app.controller('ErrorsController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.loading = false;
    $scope.alerts = [];

    $rootScope.toggleLoading = function() {
        $scope.loading = !$scope.loading;
    }

    $rootScope.addAlert = function(type, msg) {
        $scope.alerts.push({
            type: type,
            msg: msg
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
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
            $rootScope.addAlert('danger', error.message);
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
            $rootScope.addAlert('danger', error.message);
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
;app.factory('AuthInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function(rejection) {
            return $q.reject(rejection);
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
;app.factory('HashFactory', function() {
    return {
        make: function(size) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < size; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
        },
        hash: function(str) {
            return CryptoJS.SHA512(str).toString(CryptoJS.enc.Hex);
        }
    };
});
;app.factory('Socket', function (socketFactory) {
	return {
		connect: function(path) {
			return socketFactory({
				ioSocket: io.connect(path)
			});
		}
	}
});
;app.factory('ResourceService', ['$resource', function($resource) {
    var methods = {
        'update': { method:'PUT' },
        'all': { method:'GET', isArray:true }
    };

    var idTag = {
        id: '@id'
    };

    // Proper to Client
    var clientMethods = methods;
    clientMethods.me = { method: 'GET', url: '/api/clients/me' };
    clientMethods.isAnonymous = { method: 'GET', url: '/isAnonymous' };
    clientMethods.isClient = { method: 'GET', url: '/api/isClient' };
    clientMethods.isAdmin = { method: 'GET', url: '/api/isAdmin' };
    clientMethods.register = { method: 'POST', url: '/register' };
    clientMethods.login = { method: 'POST', url: '/login' };

    return {
        User: $resource('/api/users/:id', idTag, methods),
        Conversation: $resource('/api/conversations/:id', idTag, methods),
        Client: $resource('/api/clients/:id', idTag, clientMethods)
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

    /// LOGIN ///
    .state('login', {
        url: "/login",
        templateUrl: "/ng/auth/login.html",
        data: {
            permissions: {
                only: ['anonymous'],
                redirectTo: '/'
            }
        }
    })
    .state('register', {
        url: "/register",
        templateUrl: "/ng/auth/register.html",
        data: {
            permissions: {
                only: ['anonymous'],
                redirectTo: '/'
            }
        }
    })

    /// HOMEPAGE ///
    .state('dashboard', {
        url: "/",
        templateUrl: "/ng/dashboard/home.html",
        data: {
            permissions: {
                only: ['client', 'admin'],
                redirectTo: 'login'
            }
        }
    })
    .state('home', {
        url: "",
        templateUrl: "/ng/dashboard/home.html",
        data: {
            permissions: {
                only: ['client', 'admin'],
                redirectTo: 'login'
            }
        }
    })

    /// USERS ///
    .state('users', {
        url: "/users",
        templateUrl: "/ng/users/all.html",
        data: {
            permissions: {
                only: ['client'],
                redirectTo: 'login'
            }
        }
    })
    .state('getUser', {
        url: "/users/:username",
        templateUrl: "/ng/users/get.html",
        data: {
            permissions: {
                only: ['client'],
                redirectTo: 'login'
            }
        }
    })

    /// CONVERSATIONS ///
    .state('conversations', {
        url: "/conversations",
        templateUrl: "/ng/conversations/all.html",
        data: {
            permissions: {
                only: ['client'],
                redirectTo: 'login'
            }
        }
    })
    .state('getConversation', {
        url: "/conversations/:session/:username",
        templateUrl: "/ng/conversations/get.html",
        data: {
            permissions: {
                only: ['client'],
                redirectTo: 'login'
            }
        }
    })
});
;app.run(function (Permission, ResourceService, $rootScope, $q) {
	Client = ResourceService.Client;

	// Define anonymous role
	Permission.defineRole('anonymous', function (stateParams) {
		return Client.isAnonymous(null, function(client) {
			if (client.clientname != undefined) {
				$rootScope.addAlert('danger', 'You can\'t access this page if you\'re already logged.');
			}
		});
	}).defineRole('admin', function (stateParams) {
		return Client.isAdmin(null, function(client) {
			if(client.admin != 1) {
				$rootScope.addAlert('danger', 'You\'re not authorized to access this page.');
			}
		});
	}).defineRole('client', function (stateParams) {
		return Client.isClient(null, function(client) {
			if(client.clientname != undefined) {
				$rootScope.addAlert('danger', 'You must be logged in to access this page.');
			}
		});
	});
});
