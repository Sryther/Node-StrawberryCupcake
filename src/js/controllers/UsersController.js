app.controller('UsersController', ['$scope', '$rootScope', '$stateParams', 'ResourceService', 'uiGmapGoogleMapApi', function ($scope, $rootScope, $stateParams, ResourceService, uiGmapGoogleMapApi) {
    var User = ResourceService.User;
    $scope.users = [];
    $scope.currentUser = {};

    if ($stateParams.username) {
        $scope.username = $stateParams.username;
    }

    // Pagination
    $scope.numPerPage = 20;
    $scope.filteredUsers = [];
    $scope.currentPage = 1;

    $scope.selectAll = {
        isSelected: false
    };

    $scope.getAll = function() {
        $rootScope.toggleLoading();
        User.all(null, function(data) {
            $scope.users = data;
            angular.forEach($scope.users, function(v, k) {
                $scope.users[k].isSelected = false;
            });
            $rootScope.toggleLoading();
        }, function(error) {
            $rootScope.toggleLoading();
            $rootScope.addAlert('danger', error.message);
        });
    }

    $scope.get = function(username) {
        User.get({id: username}, function(data) {
            $scope.currentUser = data;

            $scope.currentUser.geo = $scope.currentUser.geo.split(",");
            $scope.map = {
                center: {
                    latitude: $scope.currentUser.geo[0],
                    longitude: $scope.currentUser.geo[1]
                },
                 zoom: 10
            };
        }, function(error) {
            $rootScope.addAlert('danger', error.message);
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

    $scope.$watch('selectAll.isSelected', function() {
        $scope.all();
    });

    $scope.all = function() {
        angular.forEach($scope.users, function (v, k) {
            $scope.users[k].isSelected = $scope.selectAll.isSelected;
        });
    };

    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
             zoom: 8
        };
    });
}]);
