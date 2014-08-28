var HCChart = angular.module('HC-chart', ['ngRoute','ui.bootstrap']);

HCChart.factory('appFactory', function() {
    return HCChartServices.instance();
});

HCChart.config(
    function($routeProvider) {
        $routeProvider
            .when('/top', {
                templateUrl: 'views/top.html'
            });
    }
);

HCChart.directive("scatterPlot",function($compile,appFactory){
    return {
        restrict: 'E',
        link:function(scope, element, attrs) {
            scope.$watch(attrs.chartData,function(data){
                appFactory.ScatterPlot(data);
            });
        }
    }
});

HCChart.directive("bivariate",function($compile,appFactory){
    return {
        restrict: 'E',
            link:function(scope, element, attrs) {
        scope.$watch(attrs.chartData,function(data){
            appFactory.Bivariate(data);
        });
    }
}
});

HCChart.directive("barChart",function($compile,appFactory){
    return {
        restrict: 'E',
        link:function(scope, element, attrs) {
            scope.$watch(attrs.chartData,function(data){
                appFactory.BarChart(data);
            });
        }
    }
});
