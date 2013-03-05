/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 2:11 PM
 */
(function(window) {
    'use strict';

    describe('Demo Ctrl', function() {
        var user = {
                name: 'Ronen',
                job: 'Developer'
            },
            router = {
                path: function() {
                    return '/path/to/save/a/user';
                }
            },
            sdk = {
                Settings: {
                    refreshCurrentApp: jasmine.createSpy('refreshCurrentApp')
                }
            },
            uiDialog = {
                open: jasmine.createSpy('open')
            },
            ctrl,
            scope,
            httpBackend;

        beforeEach(inject(function($rootScope, $http, $httpBackend) {
            httpBackend = $httpBackend;

            scope = $rootScope.$new();
            ctrl = new DemoCtrl(scope ,$http , router, sdk, uiDialog, user);

            scope.$digest();
        }));

        it('should put the user model on the provided scope', function() {
            expect(scope.user).toEqual(user);
        });

        it('should put the font families and sizes on the provided scope', function() {
            expect(scope.fontFamily.length).toEqual(3);
            expect(scope.fontSize.length).toEqual(3);
        });

        it('should open a dialog when connect() is called', function() {
            scope.connect();

            expect(uiDialog.open).toHaveBeenCalled();
        });

        it('should watch user model changes and fire http requests', function() {
            httpBackend.expectPOST('/path/to/save/a/user', { name: 'Ronen', job: 'Student' }).respond(200);

            scope.$apply(function() {
                user.job = 'Student';
            });

            httpBackend.flush();

            expect(sdk.Settings.refreshCurrentApp).toHaveBeenCalled();
        });
    });
}(window));