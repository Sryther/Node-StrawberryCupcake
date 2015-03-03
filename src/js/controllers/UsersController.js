app.controller('UsersController', ['$scope', '$rootScope', 'ResourceService', function ($scope, $rootScope, ResourceService) {
    var User = ResourceService.User;
    $scope.users = [];
    $scope.currentUser = {};

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        $scope.users = User.all(null, function(data) {
            $scope.users = data;
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.setError(error.message);
        });
    }

    $scope.get = function(id) {
        User.get({id: id}, function(data) {
            $scope.currentUser = data;
        }, function(error) {
            $rootScope.setError(error.message);
        });
    }
}]);
