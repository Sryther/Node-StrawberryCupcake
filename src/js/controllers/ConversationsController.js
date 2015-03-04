app.controller('ConversationsController', ['$scope', '$rootScope', '$stateParams', 'ResourceService', function ($scope, $rootScope, $stateParams, ResourceService) {
    var Conversation = ResourceService.Conversation;
    $scope.conversations = [];
    $scope.currentConversation = {};
    $scope.username = "";

    if ($stateParams.username) {
        $scope.username = $stateParams.username;
    }

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
        Conversation.all({id: id}, function(data) {
            $scope.currentConversation = data;
            angular.forEach($scope.currentConversation, function(v, k) {
                var date = new Date(v.datetime);
                $scope.currentConversation[k].datetime = date.toDateString() + ' ' + date.toLocaleTimeString();
            });
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }
}]);
