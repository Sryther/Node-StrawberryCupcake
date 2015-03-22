app.run(function (Permission, ResourceService, $rootScope, $q) {
	Client = ResourceService.Client;

	// Define anonymous role
	Permission.defineRole('anonymous', function (stateParams) {
		var deferred = $q.defer();
		Client.isAnonymous(null, function(client) {
			if (client.clientname != undefined) {
				$rootScope.addAlert('danger', 'You can\'t access this page if you\'re already logged.');
				deferred.reject();
			}
			deferred.resolve();
		}, function(err) {
			deferred.reject();
		});
		return deferred.promise;
	}).defineRole('admin', function (stateParams) {
		var deferred = $q.defer();
		Client.isAdmin(null, function(client) {
			if (client.admin != 1) {
				$rootScope.addAlert('danger', 'You\'re not authorized to access this page.');
				deferred.reject();
			}
			deferred.resolve();
		}, function(err) {
			deferred.reject();
		});
		return deferred.promise;
	}).defineRole('client', function (stateParams) {
		var deferred = $q.defer();
		Client.isClient(null, function(client) {
			if(client.clientname != undefined) {
				$rootScope.addAlert('danger', 'You must be logged in to access this page.');
				deferred.reject();
			}
			deferred.resolve();
		}, function(err) {
			deferred.reject();
		});
		return deferred.promise;
	});
});
