app.controller('RootController', ['$scope', '$rootScope', '$window', 'ResourceService', function($scope, $rootScope, $window, ResourceService) {
	$rootScope.client = {};
	var Client = ResourceService.Client;

	$scope.init = function() {
		if ($window.sessionStorage.token !== undefined) {
			Client.me(null, function(client) {
				$rootScope.client = client;
			});
		}
	}
}]);
