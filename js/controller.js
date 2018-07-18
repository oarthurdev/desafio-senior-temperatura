angular
.module("desafioSenior.controller", ['chart.js'], 'desafioSenior')
.controller("desafioSeniorCtrl", ['$scope', '$http', '$state', '$timeout', function($scope, $http, $state, $timeout){
    $scope.app = "Desafio Sênior";
    
    $scope.previsao = {};
    $scope.previsao.cidade = JSON.parse(localStorage.getItem("cidade"));
    $scope.previsao.estado = JSON.parse(localStorage.getItem("estado"));
    $scope.estados = [];
    $scope.cidades = [];
    $scope.error = ""

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];

    $scope.colors = ["#ff0202", "#1f02ff"]

    $scope.options = {
        responsive: true
    };

    $scope.buscaCidade = function(callback, clear){

        if (clear) {
            $scope.cidades = []
            $scope.previsao.cidade = null
        }
        
        $http.get("http://www.geonames.org/childrenJSON?geonameId="+$scope.previsao.estado.geonameId+"&style=long")
        .then(function(response){
            $scope.cidades = response.data.geonames;
            if (callback) {
                callback()
            }
        })
        .catch(function(e){
            $scope.error = "Estamos com algum problema na conexão, tente novamente mais tarde."
            $timeout(function () {
                $scope.error = ""
            }, 5000)

        });
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

                var dias = []
                var temperaturas = [[],[]]
                
                angular.forEach(responseClima.data.data, function (item, key) {
                    dias.push(item.date_br)
                    temperaturas[0].push(item.temperature.max)
                    temperaturas[1].push(item.temperature.min)
                })
                
                $scope.labels = dias;
                $scope.series = ['Max', 'Min'];
                $scope.data = temperaturas;
            })
            .catch(function(e){
                $scope.error = "Estamos com algum problema na conexão, tente novamente mais tarde."
                $timeout(function () {
                        $scope.error = ""
                    }, 5000)
            });
        })
        .catch(function(e){
            $scope.error = "Estamos com algum problema na conexão, tente novamente mais tarde."
            $timeout(function () {
                $scope.error = ""
            }, 5000)
        });
    };

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
                .catch(function(e){
                    $scope.error = "Estamos com algum problema na conexão, tente novamente mais tarde."
                    $timeout(function () {
                        $scope.error = ""
                    }, 5000)
        
                });                
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