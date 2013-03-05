/**
 * @TODO write file description
 */
(function(window) {
    'use strict';

    /**
     * @todo docs
     */
    window.angular.module('Base', ['Base.filters', 'Base.services', 'Base.directives', 'Base.config', 'Wix', 'Text', 'Ui'])
        /**
         * @todo docs
         */
        .config(['$routeProvider', '$locationProvider', 'routerProvider', function($routeProvider, $locationProvider, routerProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/welcome.html'
                })
                .when('/demo', {
                    templateUrl: 'partials/demo.html'
                })
                .when('/settings', {
                    controller: window.SettingsCtrl,
                    resolve: window.SettingsCtrl.resolve,
                    templateUrl: 'partials/settings.html'
                })
                .when('/view', {
                    controller: window.ViewCtrl,
                    templateUrl: 'partials/view.html'
                })
                .otherwise({
                    redirectTo: '/'
                });

            $locationProvider.html5Mode(true);

            routerProvider
                .endpoint('user', {
                    url: 'data/user.json'
                })
                .endpoint('hello', {
                    url: 'data/world.json'
                })
                .endpoint('world', {
                    url: 'data/hello.json'
                });

            routerProvider.urlTransformers.push('wixTransformer');
        }]);
}(window));
