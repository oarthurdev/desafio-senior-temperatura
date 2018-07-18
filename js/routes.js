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
}]);
