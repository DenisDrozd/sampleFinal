app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange', {
            'default': '400',
            'hue-1': '300'
        });
});