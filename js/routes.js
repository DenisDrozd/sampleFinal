app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'template/spinner.html',
            controller  : 'preloadPage'
        })
        .when('/home', {
            templateUrl : 'template/home.html',
            controller  : 'AppCtrl'
        })

});