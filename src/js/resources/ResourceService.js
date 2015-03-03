app.factory('ResourceService', ['$resource', function($resource) {
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
