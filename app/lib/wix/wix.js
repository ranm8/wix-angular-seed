/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 08/02/13 10:22
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
    window.angular.module('Wix', [])
        /**
         * Pushes URL changes to Wix's editor. The next time a user visits that URL the same page of your application
         * will be displayed (page applications only).
         */
        .run(['$rootScope', '$location', '$document', 'sdk', function ($rootScope, $location, $document, sdk) {
            $rootScope.$watch(function () { return $location.path(); }, function (path) {
                sdk.pushState(path);
            });
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
                 * Refreshes the single application instance that's related to this settings page.
                 * @returns {*} The settings object itself (chaining).
                 */
                sdk.Settings.refreshCurrentApp = function () {
                    var compId = wix.Utils.getOrigCompId();
                    wix.Settings.refreshAppByCompIds([compId]);

                    return this;
                };

                /**
                 * Takes a function and returns a new function that performs the operation of the provided function and
                 * returns a deferred. It also runs a callback for convenience.
                 * @param func An asynchronous function to return a deferred for.
                 * @returns {Function} A new function that returns a deferred.
                 */
                function defer(func) {
                    var f = function(callback) {
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

                    return f;
                }

                /**
                 * Works just like wix's regular method, but returns a deferred for convenience. A callback can still
                 * be passed to it.
                 * @param {function} callback A callback to run when the information has been fetched. That callback
                 * will receive the information as it's first parameter.
                 * @returns {promise}
                 */
                sdk.getSiteInfo = sdk.Settings.getSiteInfo = defer(wix.getSiteInfo);

                /**
                 * Works just like wix's regular method, but returns a deferred for convenience. A callback can still
                 * be passed to it.
                 * @param {function} callback A callback to run when the information has been fetched. That callback
                 * will receive the information as it's first parameter.
                 * @returns {promise}
                 */
                sdk.requestLogin = sdk.Settings.requestLogin = defer(wix.requestLogin);

                /**
                 * Works just like wix's regular method, but returns a deferred for convenience. A callback can still
                 * be passed to it.
                 * @param {function} callback A callback to run when the information has been fetched. That callback
                 * will receive the information as it's first parameter.
                 * @returns {promise}
                 */
                sdk.currentMember = sdk.Settings.currentMember = defer(wix.currentMember);

                return sdk;
            }];
        })

        /**
         * @name Wix.symfony2Router
         * @requires $window
         * @requires $injector
         * @description
         * Generates routes for a Symfony2 backend using FriendsOfSymfony JS Routing bundle.
         *
         * @example
         */
        .provider('symfony2Router', function() {
            var providerUrlTransformers;

            /**
             * @name Wix.symfony2RouterProvider#urlTransformers
             * @propertyOf Wix.symfony2RouterProvider
             * @description
             * An array of URL transformers to allow outside changing of the URL.
             */
            this.urlTransformers = providerUrlTransformers = [];

            this.$get = ['$window', '$injector', function($window, $injector) {
                var routing = $window.Routing,
                    urlTransformers = [];

                if (routing === undefined) {
                    throw new Error('Could not locate FOS js routing bundle.');
                }

                window.angular.forEach(providerUrlTransformers, function(transformer) {
                    urlTransformers.push(
                        window.angular.isString(transformer)
                            ? $injector.get(transformer)
                            : $injector.invoke(transformer)
                    );
                });

                /**
                 * Runs the URL through all of the URL transformers and returns the new URL.
                 * @param {string} url The URL to run through the registered transformers.
                 * @returns {string} The new URL.
                 */
                function handleTransformers(url) {
                    window.angular.forEach(urlTransformers, function(transformer) {
                        url = transformer(url);
                    });

                    return url;
                }

                /**
                 * Generates a URL to a Symfony2 backend.
                 * @param {boolean} absolute Whether or not the return an absolute URL.
                 * @param {string} route The name of the route to look for.
                 * @param {Object} params An object of parameters to add to the URL.
                 * @returns {string} A URL.
                 */
                function generate(absolute, route, params) {
                    var url = routing.generate(route, params, absolute);
                    return handleTransformers(url);
                }

                /**
                 * The return object has two methods: path() to generate a relative URL and url() to generate an
                 * absolute URL.
                 */
                return {
                    path: generate.bind(this, false),
                    url: generate.bind(this, true)
                };
            }];
        })

        /**
         * @name Wix.router
         * @requires $injector
         * @requires urlEncoder
         * @description
         * Generates routes to a backend from a predefined list of routes that can be defined during the config() phase.
         *
         * @example
         */
        .provider('router', function() {
            var endpoints = {},
                providerUrlTransformers;

            /**
             * @name Wix.routerProvider#endpoint
             * @methodOf Wix.routerProvider
             * @description
             * Adds a new endpoint to the backend routing.
             * @param endpoint The name of the endpoint as a way to reference to it
             * @param options An options objects for that endpoint. Currently the only supported option is url. It should
             * be the URL this endpoint should point to.
             * @returns {*} returns itself (chaining).
             */
            this.endpoint = function(endpoint, options) {
                endpoints[endpoint] = options;
                return this;
            };

            /**
             * @name Wix.routerProvider#urlTransformers
             * @propertyOf Wix.routerProvider
             * @description
             * An array of URL transformers to allow outside changing of the URL.
             */
            this.urlTransformers = providerUrlTransformers = [];

            this.$get = ['$injector', 'urlEncoder', function($injector, urlEncoder) {
                var urlTransformers = [];

                window.angular.forEach(providerUrlTransformers, function(transformer) {
                    urlTransformers.push(
                        window.angular.isString(transformer)
                            ? $injector.get(transformer)
                            : $injector.invoke(transformer)
                    );
                });

                /**
                 * Runs the URL through all of the URL transformers and returns the new URL.
                 * @param {string} url The URL to run through the registered transformers.
                 * @returns {string} The new URL.
                 */
                function handleTransformers(url) {
                    window.angular.forEach(urlTransformers, function(transformer) {
                        url = transformer(url);
                    });

                    return url;
                }

                /**
                 * Generates a URL based on endpoints configuration.
                 * @param {boolean} absolute Whether or not the return an absolute URL.
                 * @param {string} endpoint The name of the endpoint to look for.
                 * @param {Object} params An object of parameters to add to the URL. If these parameters exist on the
                 * endpoint definition they would be put in the URL in the right place (rather than be appended to the
                 * query string).
                 * @returns {string} A URL.
                 */
                function generate(absolute, endpoint, params) {
                    var url = (endpoints[endpoint] || {}).url;

                    if (url === undefined) {
                        throw new Error('route: ' + endpoint + ' could not be found.');
                    }

                    url =  handleTransformers(urlEncoder(url, params, absolute));

                    return url;
                }

                /**
                 * The return object has two methods: path() to generate a relative URL and url() to generate an
                 * absolute URL.
                 */
                return {
                    path: generate.bind(this, false),
                    url: generate.bind(this, true)
                };
            }];
        })

        /**
         * @name Wix.urlEncoder
         * @requires $location
         * @description
         * A simple service that encodes URLs. It allows wildcards (:wildcard notation) in the URL.
         *
         * @example
         */
        .provider('urlEncoder', function() {
            this.$get = ['$location', function($location) {
                /**
                 * Encodes an object into a URL format (key=value)
                 * @param {Object} params The params as an object.
                 * @returns {string} The output.
                 */
                function encodeParams(params) {
                    var parts = [],
                        param;

                    for (param in params) {
                        if (params.hasOwnProperty(param) && params[param]) {
                            parts.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
                        }
                    }

                    return parts.join("&");
                }

                /**
                 * Returns the separator for a URL ('?' or '&').
                 * @param {string} url The URL to get a separator for.
                 * @returns {string} The separator for the provided URL.
                 */
                function getUrlSeparator(url) {
                    return url.indexOf('?') === -1 ? '?' : '&';
                }

                /**
                 * Replaces wildcards (:wildcard) in a string with matching parameters.
                 * @param {string} string The string containing wildcards.
                 * @param {Object} params An that includes parameters.
                 * @returns {string} The output.
                 */
                function interpolate(string, params) {
                    var result = [];
                    window.angular.forEach((string||'').split(':'), function(segment, i) {
                        if (i === 0) {
                            result.push(segment);
                        } else {
                            var segmentMatch = segment.match(/(\w+)(.*)/),
                                key = segmentMatch[1];

                            result.push(params[key]);
                            result.push(segmentMatch[2] || '');
                            delete params[key];
                        }
                    });
                    return result.join('');
                }

                /**
                 * Encodes a URL with params added to it as query string parameters.
                 * @param {string} url A URL to add parameters to.
                 * @param {Object} params An object that includes the query string parameters to append to the URL.
                 * @returns {string} The output.
                 */
                function buildUrl(url, params) {
                    var query = encodeParams(params);

                    if (!query) {
                        return url;
                    }

                    return url + getUrlSeparator(url) + query;
                }

                /**
                 * Encodes a URL with params added to it as query string parameters.
                 * @param {string} url A URL to add parameters to.
                 * @param {Object} params An object that includes the query string parameters to append to the URL.
                 * @param {bool} absolute whether the URL should be an absolute URL or a relative URL.
                 * @returns {string} The output.
                 */
                function encode(url, params, absolute) {
                    url = interpolate(url, params);

                    if (absolute) {
                        url = $location.host() + url;
                    }

                    url = buildUrl(url, params);

                    return url;
                }

                return encode;
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
            this.$get = ['$location', 'urlEncoder', function($location, urlEncoder) {
                /**
                 * Returns an object with the wix required parameters.
                 *
                 * @returns {Object}
                 */
                function params() {
                    var query = $location.search();

                    return {
                        instance: query.instance || null,
                        compId: query.compId || null,
                        origCompId: query.origCompId || null
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