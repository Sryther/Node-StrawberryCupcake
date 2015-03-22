app.factory('ResourceService', ['$resource', function($resource) {
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
