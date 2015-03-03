app.controller('UsersController', ['$scope', '$rootScope', 'ResourceService', function ($scope, $rootScope, ResourceService) {
    var Conversation = ResourceService.Conversation;
    $scope.conversation = [];
    $scope.currentConversation = {};

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
        Conversation.get({id: id}, function(data) {
            $scope.currentConversation = data;
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }
}]);
