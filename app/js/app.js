/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/6/13, 6:27 PM
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
                .route('user', {
                    url: 'data/user.json'
                })
                .route('hello', {
                    url: 'data/world.json'
                })
                .route('world', {
                    url: 'data/hello.json'
                });

            routerProvider.urlTransformers.push('wixTransformer');
        }]);
}(window));
