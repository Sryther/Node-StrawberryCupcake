app.config(function($stateProvider, $urlRouterProvider) {
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
