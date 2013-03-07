/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 3:20 PM
 */
(function(window) {
    'use strict';

    describe('Wix', function() {
        beforeEach(module('Wix'));

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
                location: { search: '' },
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
         * Wix transformer tests
         */
        describe('wixTransformer', function() {
            var queryParams = {
                    instance: 'instance',
                    compId: 'compId',
                    origCompId: 'origCompId',
                    'section-url': 'section-url',
                    cacheKiller: 'cacheKiller',
                    target: 'target',
                    width: 'width'
                },
                urlEncoder = jasmine.createSpy('urlEncoder');

            beforeEach(function() {
                module(function($provide) {
                    $provide.value('queryParams', queryParams);
                    $provide.value('urlEncoder', urlEncoder);
                });
            });

            it('should transform a url and add wix specific parameters to it', function() {
                inject(function(wixTransformer) {
                    wixTransformer('url/to/add/wix/params/to');
                    expect(urlEncoder).toHaveBeenCalledWith('url/to/add/wix/params/to', { instance : 'instance', compId : 'compId', origCompId : 'origCompId', 'section-url': 'section-url', cacheKiller: 'cacheKiller', target: 'target', width: 'width' });
                });
            });
        });
    });
}(window));