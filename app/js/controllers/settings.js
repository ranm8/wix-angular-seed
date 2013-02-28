/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/13/13, 6:51 PM
 */

(function(window) {
    'use strict';

    /**
     * Simple settings control that can be used as a starting place.
     */
    var SettingsCtrl = function($scope, $http, router, sdk, user) {
        /**
         * User model. Holds data on the active user.
         */
        $scope.user = user;

        sdk.Settings.getSiteInfo(function(info) {
            console.log(info);
        });

        sdk.Settings.getSiteInfo().then(function(info) {
            console.log(info);
        });

        /**
         * Watching the user model and making a call to our backend whenever it changes.
         */
        $scope.$watch('user', function(user, oldUser) {
            if (user === oldUser) {
                return;
            }

            $http.post(router.path('user'), user)
                .success(function() {
                    sdk.Settings.refreshCurrentApp();
                });
        }, true);
    };

    /**
     * These promises will be resolved before the page is loaded and rendered to a user.
     */
    SettingsCtrl.resolve = {
        /**
         * Fetching a user model from the backend to make it available to this controller.
         */
        user: ['$http', '$q', 'router', function($http, $q, router) {
            var user = $q.defer();

            $http.get(router.path('user')).success(function(response) {
                user.resolve(response);
            });

            return user.promise;
        }]
    };

    /**
     * Concrete injections
     */
    SettingsCtrl.$inject = ['$scope', '$http', 'router', 'sdk', 'user'];

    /**
     * Import to global scope
     */
    window.SettingsCtrl = SettingsCtrl;
}(window));