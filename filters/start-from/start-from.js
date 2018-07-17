angular
.module("desafioSenior.filter.startFrom", [])
.filter("startFrom", function(){
  return function (dados, start) {
      if (dados) {
          start = +start;
          return dados.slice(start);
      }
  }
});
