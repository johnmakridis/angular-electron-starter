
(function () {
    'use strict';
    
    var _templateBase = './scripts';
    var _pagesBase = './pages';
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'app.controllers'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _pagesBase + '/home.html' ,
                controller: 'homeController'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ])

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default').primaryPalette('indigo');
    })

    .config(function($mdIconProvider) {
        $mdIconProvider.fontSet('md', 'material-icons');
    })

})();