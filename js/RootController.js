function RootController($scope,appFactory,$location){
    $scope.changeView = function(pageName){
        console.log(pageName);
        $location.path("/" + pageName);
    }
    $scope.updateScope = function(scope){
        if(!scope.$$phase || scope.$$phase == '' || scope.$$phase == null) scope.$apply();
    }
    $scope.changeView("top");
}