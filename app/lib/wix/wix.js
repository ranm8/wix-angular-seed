/**
 * @TODO write file description
 */
(function (window) {
    'use strict';

    /**
     * @name Wix
     * @description
     * Provides tools to quickly and easily develop applications for the Wix App Market (http://www.dev.wix.com).
     *
     * It's only dependency is AngularJS, it doesn't have any server-side dependencies or restrictions. It can be used
     * with every backend, but support currently only support for Symfony2 exists.
     */
    window.angular.module('Wix', ['Text', 'Ui', 'Routing'])
        /**
         * Pushes URL changes to Wix's editor. The next time a user visits that URL the same page of your application
         * will be displayed (page applications only).
         *
         * Please note that this feature only works when HTML5 mode is enabled.
         *
         * * currently disabled.
         */
        .run(['$rootScope', '$location', 'sdk', function ($rootScope, $location, sdk) {
//            $rootScope.$on('$routeChangeSuccess', function() {
//                sdk.pushState($location.path());
//            });
        }])

        /**
         * @name Wix.sdk
         * @requires $window
         * @description
         * Provides Wix's SDK as an enhanced service. It supports all the methods and properties the standard Wix's SDK
         * has.
         */
        .provider('sdk', function () {
            this.$get = ['$window', '$rootScope', '$q', function ($window, $rootScope, $q) {
                var wix = $window.Wix,
                    sdk = window.angular.extend({}, wix);

                if (!wix) {
                    return;
                }

                /**
                 * @name Wix.sdk#Settings.refreshCurrentApp
                 * @propertyOf Wix.sdk
                 * @description
                 * Refreshes the single application instance that's related to this settings page.
                 */
                sdk.Settings.refreshCurrentApp = function () {
                    var compId = wix.Utils.getOrigCompId();
                    wix.Settings.refreshAppByCompIds([compId]);

                    return this;
                };

                /**
                 * Takes an asynchronous function that accepts a callback and returns a new function that performs
                 * exactly the same as the original function (accepts a callback too, with the same parameters), but
                 * also returns a promise.
                 * @param func An asynchronous function that accepts a callback.
                 * @returns {Function} A new function.
                 */
                function defer(func) {
                    var transformedFunction = function(callback) {
                        var deferred = $q.defer();

                        func(function() {
                            var args = Array.prototype.slice.apply(arguments);

                            $rootScope.$apply(function() {
                                deferred.resolve.apply(deferred, args);
                            });
                        });

                        if (window.angular.isFunction(callback)) {
                            deferred.promise.then(callback);
                        }

                        return deferred.promise;
                    };

                    return transformedFunction;
                }

                /**
                 * @name Wix.sdk#getSiteInfo
                 * @propertyOf Wix.sdk
                 * @description
                 * Returns information about the host site in which the app is shown. The method accepts a single
                 * callback, that when called, will get an object with the following attributes:
                 *   siteTitle: the title of the site that is used for SEO..
                 *   pageTitle: the site current page title that is used for SEO.
                 *   siteDescription: the description of the site that is used for SEO.
                 *   siteKeywords: the keywords which were related to the site and are used for SEO.
                 *   referrer: the referrer header of the http request.
                 *   url: the full url taken from the location.href, include internal site state.
                 *   baseUrl: base url of the current site.
                 */
                sdk.getSiteInfo = sdk.Settings.getSiteInfo = defer(wix.getSiteInfo);

                /**
                 * @name Wix.sdk#requestLogin
                 * @propertyOf Wix.sdk
                 * @description
                 * The request login method requests the current user of the wix site to login or register (i.e. the user
                 * of site, not the owner of the site in the editor). After a successful login, the Wix site will
                 * reload including the app iframe and the new signed-instance parameter will contain the details of
                 * the logged in user.
                 * The method has an affect only for a published site. If called in the Wix editor, the method has no
                 * affect.
                 * The method accepts a single callback (since 1.6.0), that when called, will get an object with the
                 * following attributes:
                 *   authResponse: is the user authenticated or not	true / false.
                 *   data: member data.
                 */
                sdk.requestLogin = sdk.Settings.requestLogin = defer(wix.requestLogin);

                /**
                 * @name Wix.sdk#currentMember
                 * @propertyOf Wix.sdk
                 * @description
                 * Accepts a single callback that when called, will be initiated with the current logged-in member
                 * data.
                 */
                sdk.currentMember = sdk.Settings.currentMember = defer(wix.currentMember);

                return sdk;
            }];
        })

        /**
         * @name Wix.wixUrlTransformer
         * @requires $location
         * @requires urlEncoder
         * @description
         * A URL encoder that is meant to be used with the router service or the symfony2Service (or any similar service
         * that implements url transformers) to augment the URL to the way Wix URLs should be.
         *
         * @example
         */
        .provider('wixTransformer', function() {
            this.$get = ['queryParams', 'urlEncoder', function(queryParams, urlEncoder) {
                /**
                 * Returns an object with the wix required parameters.
                 *
                 * @returns {Object}
                 */
                function params() {
                    return {
                        'section-url': queryParams['section-url'] || null,
                        cacheKiller: queryParams.cacheKiller || null,
                        instance: queryParams.instance || null,
                        target: queryParams.target || null,
                        width: queryParams.width || null,
                        compId: queryParams.compId || null,
                        origCompId: queryParams.origCompId || null
                    };
                }

                /**
                 * Returns a URL with the wix required parameters.
                 *
                 * @param {string} url
                 * @returns {string}
                 */
                function transform(url) {
                    return urlEncoder(url, params());
                }

                return transform;
            }];
        });
}(window));