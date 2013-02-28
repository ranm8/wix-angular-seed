/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 3:20 PM
 */
(function(window) {
    'use strict';

    describe('Wix', function() {
        beforeEach(module('Wix'));

        /**
         * Symfony2 router tests
         */
        describe('symfony2Router', function() {
            it('should generate a URL to a symfony2 backend', function() {
                var $window = {
                    Routing: { generate: jasmine.createSpy('Routing') },
                    navigator: {} // remove
                };

                module(function($provide) {
                    $provide.value('$window', $window);
                });

                inject(function(symfony2Router) {
                    symfony2Router.path('route', { a: 'b' });
                    expect($window.Routing.generate).toHaveBeenCalledWith('route', { a: 'b' }, false);

                    symfony2Router.url('another route', { c: 'd', e: 'f' });
                    expect($window.Routing.generate).toHaveBeenCalledWith('another route', { c: 'd', e: 'f' }, true);
                });
            });
        });

        /**
         * Wix sdk tests
         */
        describe('sdk', function() {
            var $window = {
                Wix: {
                    Settings: {
                        refreshAppByCompIds: jasmine.createSpy('refreshAppByCompIds')
                    },
                    Utils: {
                        getOrigCompId: function() {
                            return '1';
                        }
                    }
                },
                navigator: {} // remove
            };

            beforeEach(function() {
                module(function($provide) {
                    $provide.value('$window', $window);
                });
            });

            describe('#refreshCurrentApp', function() {
                it('should call refreshAppByCompIds() with an array with origCompId or compId if it is not available', inject(function(sdk) {
                    sdk.Settings.refreshCurrentApp();
                    expect($window.Wix.Settings.refreshAppByCompIds).toHaveBeenCalledWith(['1']);
                }));
            });
        });

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

        /**
         * Wix transformer tests
         */
        describe('wixTransformer', function() {
            var $location = {
                    search: function() {
                        return {
                            instance: 'instance',
                            compId: 'compId',
                            origCompId: 'origCompId'
                        };
                    }
                },
                urlEncoder = jasmine.createSpy('urlEncoder');

            beforeEach(function() {
                module(function($provide) {
                    $provide.value('$location', $location);
                    $provide.value('urlEncoder', urlEncoder);
                });
            });

            it('should transform a url and add wix specific parameters to it', function() {
                inject(function(wixTransformer) {
                    wixTransformer('url/to/add/wix/params/to');
                    expect(urlEncoder).toHaveBeenCalledWith('url/to/add/wix/params/to', { instance : 'instance', compId : 'compId', origCompId : 'origCompId' });
                });
            });
        });
    });
}(window));