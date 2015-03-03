app.controller('UsersController', ['$scope', '$rootScope', 'ResourceService', function ($scope, $rootScope, ResourceService) {
    var User = ResourceService.User;
    $scope.users = [];
    $scope.currentUser = {};

    // Pagination
    $scope.numPerPage = 20;
    $scope.filteredUsers = [];
    $scope.currentPage = 1;

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        User.all(null, function(data) {
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

    $scope.numPages = function () {
        return Math.ceil($scope.users.length / $scope.numPerPage);
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        $scope.filteredUsers = $scope.users.slice(begin, end);
    };

    $scope.$watch('users', function() {
        if ($scope.users.length > 0) {
            $scope.pageChanged();
        }
    });
}]);
