app.controller('ConversationsController', ['$scope', '$rootScope', '$stateParams', 'Socket', 'ResourceService', function ($scope, $rootScope, $stateParams, Socket, ResourceService) {
    var Conversation = ResourceService.Conversation;
    $scope.conversations = [];
    $scope.currentConversation = {};
    $scope.session = "";
    $scope.yourMessage = "";

    $scope.socket = {};

    if ($stateParams.session) {
        $scope.session = $stateParams.session;
    }

    // Pagination
    $scope.numPerPage = 20;
    $scope.filteredConversations = [];
    $scope.currentPage = 1;

    $scope.selectAll = {
        isSelected: false
    };

    $scope.initSocket = function(token) {
        $scope.socket = Socket.connect(":8080/chat/" + token);

        $scope.socket.on('message', function (msg) {
            var message = msg.split('#');
            $scope.currentConversation.push({
                message: message[1],
                datetime: new Date(),
                sender: message[0]
            })
        });
    }

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        Conversation.all(null, function(data) {
            $scope.conversations = data;
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

    $scope.send = function() {
        $scope.socket.emit('message', "Team#" + $scope.yourMessage);
        $scope.yourMessage = "";
    }

    $scope.numPages = function () {
        return Math.ceil($scope.conversations.length / $scope.numPerPage);
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        $scope.filteredConversations = $scope.conversations.slice(begin, end);
    };

    $scope.$watch('conversations', function() {
        if ($scope.conversations.length > 0) {
            $scope.pageChanged();
        }
    });

    $scope.$watch('selectAll.isSelected', function() {
        $scope.all();
    });

    $scope.all = function() {
        angular.forEach($scope.conversations, function (v, k) {
            $scope.conversations[k].isSelected = $scope.selectAll.isSelected;
        });
    };
}]);
