angular
.module("desafioSenior.controller", ['desafioSenior.service'])
.controller("desafioSeniorCtrl", ['$scope', 'consultaService','$http', '$state', function($scope, consultaService, $http, $state){
    $scope.app = "Desafio Sênior";
    $scope.pagination = {currentPage: 1, pageSize: 2};

    $scope.previsao = {};
    $scope.previsao.cidade = JSON.parse(localStorage.getItem("cidade"));
    $scope.previsao.estado = JSON.parse(localStorage.getItem("estado"));
    $scope.estados = [];
    $scope.cidades = [];

    $scope.buscaCidade = function(callback){
        $http.get("http://www.geonames.org/childrenJSON?geonameId="+$scope.previsao.estado.geonameId+"&style=long")
        .then(function(response){
            $scope.cidades = response.data.geonames;

            if (callback) {
                callback()
            }
        })
    };

    $scope.getPrevisao = function(callback){
        let estado = $scope.previsao.estado.adminCodes1.ISO3166_2;
        let cidade = $scope.previsao.cidade.name;

        console.log('getPrevisao')

        $http.get("http://apiadvisor.climatempo.com.br/api/v1/locale/city?name="+cidade+"&state="+estado+"&token=90bcb2e00c73d14de7f3c392edaf16d0")
        .then(function(response){
            $private.previsao = response.data;
            let idCity = response.data[0].id;

            $http.get("http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/"+idCity+"/days/15?token=90bcb2e00c73d14de7f3c392edaf16d0")
            .then(function(response){
                $private.previsao = response.data;
                $scope.previsao.resultados = response.data;                console.log($scope.previsao.name);
                // console.log($scope.previsao);
                    // let tempMinCity = response.data.data[0].temperature.min;
                    // let tempMaxCity = response.data.data[0].temperature.max;
                    // let tempMinCity1 = response.data.data[1].temperature.min;
                    // let tempMaxCity1 = response.data.data[1].temperature.max;
                    // let tempMinCity2 = response.data.data[2].temperature.min;
                    // let tempMaxCity2 = response.data.data[2].temperature.max;
                    // let tempMinCity3 = response.data.data[3].temperature.min;
                    // let tempMaxCity3 = response.data.data[3].temperature.max;
                    // let tempMinCity4 = response.data.data[4].temperature.min;
                    // let tempMaxCity4 = response.data.data[4].temperature.max;
                    // let tempMinCity5 = response.data.data[5].temperature.min;
                    // let tempMaxCity5 = response.data.data[5].temperature.max;
                    // let tempMinCity6 = response.data.data[6].temperature.min;
                    // let tempMaxCity6 = response.data.data[6].temperature.max;
            });
        });
    };

    console.log($scope.previsao.estado, $scope.previsao.cidade)
    if($scope.previsao.estado && $scope.previsao.estado.adminName1) {
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

        console.log('Cidade Salva: ', $scope.previsao.cidade)
    };

    $scope.getState();
    
}]);
