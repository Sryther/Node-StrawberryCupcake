app.controller('ErrorsController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.loading = false;
    $scope.alerts = [];

    $rootScope.toggleLoading = function() {
        $scope.loading = !$scope.loading;
    }

    $rootScope.addAlert = function(type, msg) {
        $scope.alerts.push({
            type: type,
            msg: msg
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}]);
