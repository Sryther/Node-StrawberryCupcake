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
        templateUrl: "/ng/dashboard/users.html"
    })
});