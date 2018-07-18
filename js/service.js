angular
.module("desafioSenior.service", [])
.factory("consultaService", ['$http', function($http){
  $public = {};
  $private = {pessoas: [], previsao: []};

  $public.getPessoas = function(callback){
      if($private.pessoas.length == 0){
          $http.get("pessoas.json").then(function (response) {
              $private.pessoas = response.data;
              callback(response.data);
          },
          function (data, status) {
              alert("Erro ao carregar dados");
          });
      }
      else{
          callback($private.pessoas);
      }
  };

  $public.adicionarPessoa = function (pessoa) {
      $private.pessoas.data.push(pessoa);
  };

  $public.adicionarprevisao = function (previsao) {
      var temprevisaog = false;
      for (var i = 0; i < $private.previsao.data.length; i++) {
          if ($private.previsao.data[i].pessoa.documento == previsao.pessoa.documento) {
              $private.previsao.data[i] = previsao;
              temprevisaog = true;
          }
      }

      if (!temprevisaog) {
          $private.previsao.data.push(previsao);
      }
  };


  return $public;

}]);
