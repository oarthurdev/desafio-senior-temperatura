app
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'page': {
                    templateUrl: 'templates/consultas.html',
                    controller: 'desafioSeniorCtrl'
                }
            }
        })
        .state('incluir-pessoa', {
            url: '/incluir-pessoa',
            views: {
                'page': {
                    templateUrl: 'templates/incluir-pessoa.html',
                    controller: 'desafioSeniorCtrl'
                }
            }
        })
}]);
