angular
.module("desafioSenior.controller", ['desafioSenior.service', 'chart.js'])
.controller("desafioSeniorCtrl", ['$scope', 'consultaService','$http', '$state', function($scope, consultaService, $http, $state){
    $scope.app = "Desafio Sênior";
    $scope.pagination = {currentPage: 1, pageSize: 2};

    $scope.previsao = {};
    $scope.previsao.cidade = JSON.parse(localStorage.getItem("cidade"));
    $scope.previsao.estado = JSON.parse(localStorage.getItem("estado"));
    $scope.estados = [];
    $scope.cidades = [];

    $scope.alerts = [
        { msg: 'Sucesso! Cidade adicionada como favorito' }
      ];

      console.log($scope.previsao.resultados);

      $scope.labels = [];
      $scope.series = [];
      $scope.data = [];

      $scope.colors = ["#ff0202", "#1f02ff"]
      
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      
      $scope.options = {
        responsive: true
      };


    console.log($scope.previsao);
    $scope.buscaCidade = function(callback){
        $http.get("http://www.geonames.org/childrenJSON?geonameId="+$scope.previsao.estado.geonameId+"&style=long")
        .then(function(response){
            $scope.cidades = response.data.geonames;

            if (callback) {
                callback()
            }
        })
    };

    $scope.getPrevisao = function(callback, force){
        let estado = $scope.previsao.estado.adminCodes1.ISO3166_2;
        let cidade = $scope.previsao.cidade.name;

        $scope.data = [[], []]

        $http.get("http://apiadvisor.climatempo.com.br/api/v1/locale/city?name="+cidade+"&state="+estado+"&token=16a7cfd9f7e671ad33b7b980cf56f8f4")
        .then(function(response){
            $private.previsao = response.data;
            let idCity = response.data[0].id;

            $http.get("http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/"+idCity+"/days/15?token=16a7cfd9f7e671ad33b7b980cf56f8f4")
            .then(function(responseClima){
                $private.previsao = responseClima.data;
                $scope.previsao.resultados = responseClima.data;
                console.log($scope.previsao.resultados)

                var dias = []
                var temperaturas = [[],[]]
                
                angular.forEach(responseClima.data.data, function (item, key) {
                    console.log(2, item)
                    dias.push(item.date_br)
                    temperaturas[0].push(item.temperature.max)
                    temperaturas[1].push(item.temperature.min)
                })
                
                                   
                console.log(dias, temperaturas)
                $scope.labels = dias;
                $scope.series = ['Max', 'Min'];
                $scope.data = temperaturas;
            });
        });
    };

    console.log($scope.previsao)
    console.log($scope.previsao.resultados)
    
    if (!$scope.previsao.estado && !$scope.previsao.cidade) {
        $http.get("estado-default.json")
        .then(function (response){
            $scope.previsao.estado = response.data;

            $scope.buscaCidade(function () {
                $http.get("cidade-default.json")
                .then(function (response){
                    $scope.previsao.cidade = response.data;

                    if ($scope.previsao.cidade && $scope.previsao.cidade.toponymName) {
                        $scope.getPrevisao()
                    }
                })                
            });
        })
    }
    else {
        $scope.buscaCidade(function () {
            if ($scope.previsao.cidade && $scope.previsao.cidade.toponymName) {
                $scope.getPrevisao()
            }
        });        
    }

    
    // $scope.init = function () {
    //     $http.get("http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/5090/days/15?token=90bcb2e00c73d14de7f3c392edaf16d0").then(function(response){
    //         $private.previsao = response.data;
    //         //callback(response.data);
    //         let tempMin = response.data.data[0].temperature.min;
    //         let tempMax = response.data.data[0].temperature.max;
    //     });
    // };

    // $scope.init();
    $scope.getState = function(){
        $http.get("estados.json")
        .then(function (response){
            $scope.estados = response.data;
        })
    };

    $scope.salvarCidade = function(){
        localStorage.setItem("cidade", JSON.stringify(angular.copy($scope.previsao.cidade)));
        localStorage.setItem("estado", JSON.stringify(angular.copy($scope.previsao.estado)));

        $('#alert-save').show()
            setTimeout(function () {
                $('#alert-save').hide()
            }, 5000)

    };

    $scope.getState();
    
}]);