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
