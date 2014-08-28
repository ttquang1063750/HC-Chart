function TopController($scope,appFactory,$modal,$log){
    $('input[type=file]').bootstrapFileInput();
//    $('.file-inputs').bootstrapFileInput();
   var data = null;
    var activeButton = "";
    $scope.dataScatterPlot = null;
    $scope.dataBivariate = null;
    $scope.dataBarChart = null;
    $scope.chartName = "";


    function getData(){
        return data;
    }
    function setData(d){
        data = d;
    }
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/chart.html',
            controller: ModalInstanceCtrl,
            size: 'lg',
            resolve: {
                data: function () {
                    return $scope.data;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    var ModalInstanceCtrl = function ($scope, $modalInstance) {

        if( activeButton == "dataScatterPlot"){
            $scope.chartName = "ScatterPlot Chart";
            $scope.dataScatterPlot = getData();
            $scope.dataBivariate = null;
            $scope.dataBarChart = null;
        }
        if( activeButton == "dataBivariate"){
            $scope.chartName = "Bivariate Chart";
            $scope.dataScatterPlot = null;
            $scope.dataBarChart = null;
            $scope.dataBivariate =  getData();
        }
        if( activeButton == "dataBarChart"){
            $scope.chartName = "Bart Chart";
            $scope.dataScatterPlot = null;
            $scope.dataBivariate =  null;
            $scope.dataBarChart = getData();
        }

        $scope.close = function () {
            $modalInstance.close();
            console.log("close");
        };
    }

    appFactory.readFileFromButton("ScatterPlot",function(data){
        var dt = data[0],
            keys = _.keys(data[0]),
            key1 = keys[0],
            key2 = keys[1],
            key3 = keys[2];
        if(!isNumber(dt[key1]) || !isNumber(dt[key2]) || !angular.isString(dt[key3])){
            return errHandle();
        }
        activeButton = "dataScatterPlot";
        setData(data);
        $scope.updateScope($scope);
        $scope.open();

    },function(error){
        errHandle(error);
    });
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    appFactory.readFileFromButton("Bivariate",function(data){
        var dt = data[0],
            keys = _.keys(data[0]),
            key1 = keys[0],
            key2 = keys[1],
            key3 = keys[2],
            parseDate = d3.time.format("%Y%m%d").parse;

        if(!angular.isDate(parseDate(dt[key1])) || !isNumber(dt[key2]) || !isNumber(dt[key3])){
            return errHandle();
        }

        activeButton = "dataBivariate";
        setData(data);
        $scope.updateScope($scope);
        $scope.open();

    },function(error){
        errHandle(error);
    });

    appFactory.readFileFromButton("BarChart",function(data){
        var dt = data[0],
            keys = _.keys(data[0]),
            key1 = keys[0],
            key2 = keys[1];

        if(!angular.isString(dt[key1]) || !isNumber(dt[key2])){
            return errHandle();
        }

        activeButton = "dataBarChart";
        setData(data);
        $scope.updateScope($scope);
        $scope.open();

    },function(error){
        errHandle(error);
    });

    function errHandle(error){
        if(error)
            return  alert("your file insert is " + error + " incorrect");
        else
            return alert("your data entered is invalid");
    }
}