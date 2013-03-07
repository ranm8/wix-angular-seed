/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 3:20 PM
 */
(function(window) {
    'use strict';

    describe('Routing', function() {
        beforeEach(module('Routing'));

        /**
         * Router tests
         */
        describe('router', function() {
            it('should generate a URL from configuration values', function() {
                var $location = {
                    host: function() {
                        return 'http://base.host/';
                    }
                };

                module(function(routerProvider) {
                    routerProvider.endpoint('path', {
                        url: 'path/to/:test'
                    });
                });

                module(function($provide) {
                    $provide.value('$location', $location);
                });

                inject(function(router) {
                    expect(router.path('path', { 'a': 'b' })).toEqual('path/to/?a=b');
                    expect(router.path('path', { 'test': 'unit' })).toEqual('path/to/unit');
                    expect(router.url('path', { 'test': 'unit' })).toEqual('http://base.host/path/to/unit');
                });
            });
        });

        /**
         * URL encoder tests
         */
        describe('urlEncoder', function() {
            var $location = {
                host: function() {
                    return 'http://base.host/';
                }
            };

            beforeEach(function() {
                module(function($provide) {
                    $provide.value('$location', $location);
                });
            });

            it('should encode URLs with parameters', function() {
                inject(function(urlEncoder) {
                    expect(urlEncoder('url/to/encode', { a: 'b', c: 'd' })).toEqual('url/to/encode?a=b&c=d');
                    expect(urlEncoder('url/to/encode', { a: 'b', c: 'd' }, true)).toEqual('http://base.host/url/to/encode?a=b&c=d');
                });
            });
        });
    });
}(window));