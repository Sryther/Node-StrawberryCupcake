app.controller('ErrorsController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.error   = false;
    $scope.success = false;
    $scope.loading = false;
    $scope.messageError = "";
    $scope.messageSuccess = "";

    $rootScope.toggleLoading = function() {
        $scope.loading = !$scope.loading;
    }

    $rootScope.setError = function(message) {
        $scope.messageError = message;
        $scope.error        = true;
    }

    $rootScope.unsetError = function() {
        $scope.messageError = "";
        $scope.error        = false;
    }

    $rootScope.setSuccess = function(message) {
        $scope.messageSuccess = message;
        $scope.success        = true;
    }

    $rootScope.unsetSuccess = function() {
        $scope.messageSuccess = "";
        $scope.success        = false;
    }
}]);
