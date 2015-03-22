app.run(function (Permission, ResourceService, $rootScope, $q) {
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
