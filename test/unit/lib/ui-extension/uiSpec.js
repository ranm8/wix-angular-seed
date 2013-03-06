/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 10:42 AM
 */
(function(window) {
    'use strict';

    describe('Ui extension', function() {
        var compile, rootScope;

        beforeEach(function() {
            module('Ui');
        });

        beforeEach(inject(function($compile, $rootScope) {
            compile = $compile;
            rootScope = $rootScope;
        }));

        /**
         * Chosen directive
         */
        describe('Chosen directive', function() {
            beforeEach(function() {
                angular.element.prototype.chosen = jasmine.createSpy('chosen');
                angular.element.prototype.trigger = jasmine.createSpy('trigger');
            });

            it('should not do anything if the Chosen plugin is not available', function() {
                delete angular.element.prototype.chosen;

                function $compile() {
                    compile('<select ui-chosen ng-model="model"></select>')(rootScope);
                }

                expect($compile).not.toThrow();
            });

            it('should throw an error if no model has been provided', function() {
                function $compile() {
                    compile('<select ui-chosen></select>')(rootScope);
                }

                expect($compile).toThrow();
            });

            it('should trigger Chosen change events when the model is changed', function() {
                var scope = rootScope.$new();
                scope.model = "model";
                compile('<select ui-chosen ng-model="model"></select>')(scope);

                scope.$apply(function() {
                    scope.model = "another model";
                });

                expect(angular.element.prototype.trigger).toHaveBeenCalledWith('liszt:updated');
            });

            it('should turn a select element into a Chosen element', function() {
                compile('<select ui-chosen ng-model="model"></select>')(rootScope);
                expect(angular.element.prototype.chosen).toHaveBeenCalledWith({ disable_search : undefined, allow_single_deselect : undefined });

                compile('<select ui-chosen ng-model="model" ui-disable-search="false" ui-allow-single-deselect="true"></select>')(rootScope);
                expect(angular.element.prototype.chosen).toHaveBeenCalledWith({ disable_search : false, allow_single_deselect : true });
            });
        });

        /**
         * Draggable directive
         */
        describe('jQueryUI draggable directive', function() {
            beforeEach(function() {
                angular.element.prototype.draggable = jasmine.createSpy('draggable');
            });

            it('should not do anything if the jQueryUI draggable plugin is not available', function() {
                delete angular.element.prototype.draggable;

                function $compile() {
                    compile('<div ui-draggable></div>')(rootScope);
                }

                expect($compile).not.toThrow();
            });

            it('should turn any DOM element into a draggable element', function() {
                compile('<div ui-draggable ui-axis="x" ui-delay="100"></div>')(rootScope);
                expect(angular.element.prototype.draggable).toHaveBeenCalledWith({ axis: 'x', delay: 100 });

            });
        });

        /**
         * Accordion directive
         */
        describe('jQueryUI accordion directive', function() {
            beforeEach(function() {
                angular.element.prototype.accordion = jasmine.createSpy('accordion');
            });

            it('should not do anything if the jQueryUI accordion plugin is not available', function() {
                delete angular.element.prototype.accordion;

                function $compile() {
                    compile('<div ui-accordion></div>')(rootScope);
                }

                expect($compile).not.toThrow();
            });

            it('should turn a div into an accordion element', function() {
                compile('<div data-ui-accordion data-ui-height-style="auto" data-ui-header="div > h2"></div>')(rootScope);
                expect(angular.element.prototype.accordion).toHaveBeenCalledWith({ heightStyle: 'auto', header: 'div > h2' });
            });
        });

        /**
         * Datepicker directive
         */
        describe('jQueryUI datepicker directive', function() {
            beforeEach(function() {
                angular.element.prototype.datepicker = jasmine.createSpy('datepicker');
            });

            it('should not do anything if the jQueryUI datepicker plugin is not available', function() {
                delete angular.element.prototype.datepicker;

                function $compile() {
                    compile('<select ui-datepicker ng-model="model"></select>')(rootScope);
                }

                expect($compile).not.toThrow();
            });

            it('should throw an error if no model has been provided', function() {
                function $compile() {
                    compile('<input type="text" ui-datepicker />')(rootScope);
                }

                expect($compile).toThrow();
            });

            it('should turn a text input element into a datepicker element', function() {
                compile('<input type="text" ui-datepicker ng-model="model" ui-change-month="false" ui-change-year="true" ui-year-range="2000-2010" />')(rootScope);
//                expect(angular.element.prototype.datepicker).toHaveBeenCalledWith({ changeMonth: false, changeYear: true, yearRange: '2000-2010' });
            });
        });

        /**
         * Colorpicker directive
         */
        describe('Colorpicker directive', function() {
            beforeEach(function() {
                angular.element.prototype.ColorPicker = jasmine.createSpy('colorPicker');
            });

            it('should not do anything if the Colorpicker plugin is not available', function() {
                delete angular.element.prototype.ColorPicker;

                function $compile() {
                    compile('<select ui-colorpicker ng-model="model"></select>')(rootScope);
                }

                expect($compile).not.toThrow();
            });

            it('should throw an error if no model has been provided', function() {
                function $compile() {
                    compile('<select ui-colorpicker></select>')(rootScope);
                }

                expect($compile).toThrow();
            });

            it('should turn a text input element into a colorPicker element', function() {
                compile('<input type="text" ng-model="model" ui-colorpicker />')(rootScope);
                expect(angular.element.prototype.ColorPicker).toHaveBeenCalled();
            });
        });

        /**
         * Loader directive
         */
        describe('Loader directive', function() {
            beforeEach(function() {
                angular.element.prototype.hide = jasmine.createSpy('hide');
                angular.element.prototype.fadeIn = jasmine.createSpy('fadeIn');
                angular.element.prototype.fadeOut = jasmine.createSpy('fadeOut');
            });

            it('should be hidden', function() {
                var elm = compile('<div ui-loader></div>')(rootScope);
                expect(elm.hide).toHaveBeenCalled();
            });

            it('should hide and reveal itself when loading operations take place', function() {
                var elm = compile('<div ui-loader ui-duration="300"></div>')(rootScope);
                rootScope.$emit('$routeChangeStart');
                expect(elm.fadeIn).toHaveBeenCalledWith(300);

                rootScope.$emit('$routeChangeSuccess');
                expect(elm.fadeOut).toHaveBeenCalledWith(300);
            });
        });
    });
}(window));