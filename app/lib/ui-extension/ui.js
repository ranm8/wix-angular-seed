/**
 * @TODO write file description
 */
(function(window) {
    'use strict';

    /**
     * @name Ui
     * @description
     * Provides a collections of tools that manipulate the DOM to create interactive and engaging applications.
     *
     * This module is dependent on jQueryUI, Chosen and ColorPicker but it will not throw any errors if these
     * dependencies are not provided.
     */
    window.angular.module('Ui', [])
        /**
         * Emits events when ajax operations starts and when it ends (successfully or not). It's used by the ajax
         * loader directive.
         */
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.responseInterceptors.push(['$q', '$rootScope', function($q, $rootScope) {
                return function(promise) {
                    $rootScope.$emit('ajaxStart');

                    return promise.then(
                        function(response) {
                            $rootScope.$emit('ajaxFinish');
                            return response;
                        },
                        function(response) {
                            $rootScope.$emit('ajaxFinish');
                            $q.reject(response);
                        }
                    );
                };
            }]);
        }])

        /**
         * @name Ui.uiChosen
         * @description
         * Activates a DOM select element as a Chosen element. Requires the Chosen plugin to be loaded into the page
         * for any effect to take place.
         */
        .directive('uiChosen', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.chosen) {
                        return;
                    }

                    elm.chosen({
                        disable_search: attr.uiDisableSearch === 'true',
                        allow_single_deselect: attr.uiAllowSingleDeselect === 'true'
                    });

                    ctrl.$render = function() {
                        elm.trigger('liszt:updated');
                    };

                    setTimeout(function() { elm.trigger('liszt:updated'); }, 1);
                }
            };
        }])

        /**
         * @name Ui.uiColorpicker
         * @description
         * Activates a DOM input element as a color picker element. Requires the ColorPicker plugin to be loaded for the
         * directive to do have an effect.
         */
        .directive('uiColorpicker', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.ColorPicker) {
                        return;
                    }

                    elm.ColorPicker();
                }
            };
        })

        /**
         * @name Ui.uiSlider
         * @description
         * Makes a DOM div element to work as a slider element. It requires jQueryUI slider component to work but it
         * will not throw any exceptions if it's not available.
         *
         * It can be configured with the following HTML attributes:
         *   ui-range: whether the slider represents a range.
         *   min: the minimum value of the slider.
         *   max: the maximum value of the slider.
         *   disabled: controls whether the slider should be disabled.
         *
         * @example
         *   The following HTML tag would be turned into a slider element:
         *     <div data-ui-slider min="1" max="10" data-ng-model="user.searchBackgroundOpacity"
         *          data-ng-disabled="!user.searchBackground"></div>
         */
        .directive('uiSlider', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.slider) {
                        return;
                    }

                    ctrl.$render = function() {
                        elm.slider('option', 'value', ctrl.$viewValue);
                    };

                    elm.on('slidechange', function(event, ui) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(ui.value);
                        });
                    });

                    scope.$watch(function() { return attr.disabled; }, function(value) {
                        elm.slider('option', 'disabled', value);
                    });

                    elm.slider({
                        range: attr.uiRange,
                        min: parseInt(attr.min),
                        max: parseInt(attr.max)
                    });
                }
            };
        })

        /**
         * @name Ui.uiDatePicker
         * @description
         * Makes a DOM input element with type text to work as a date picker element. It requires jQueryUI datepicker
         * component to work but it will not throw any exceptions if it's not available.
         *
         * It can be configured with the following HTML attributes:
         *   ui-change-month: whether the month should be rendered as a dropdown instead of text.
         *   ui-change-year: whether the year should be rendered as a dropdown instead of text. Use the ui-year-range
         *     option to control which years are made available for selection.
         *   ui-year-range: The range of years displayed in the year drop-down: either relative to today's year
         *     ("-nn:+nn"), relative to the currently selected year ("c-nn:c+nn"), absolute ("nnnn:nnnn"), or
         *     combinations of these formats ("nnnn:-nn"). Note that this option only affects what appears in the
         *     drop-down, to restrict which dates may be selected use the minDate and/or maxDate options.
         *
         * @example
         *   The following HTML tag would be turned into a date picker element:
         *     <input type="text" ui-datepicker ng-model="model" ui-change-month="false" ui-change-year="true"
         *            ui-year-range="2000-2010" />
         */
        .directive('uiDatepicker', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.datepicker) {
                        return;
                    }

                    function toBool(input) {
                        if (typeof input === 'string') {
                            return input.toLowerCase() === 'true';
                        }

                        return !!input;
                    }

                    elm.datepicker({
                        changeMonth: toBool(attr.uiChangeMonth),
                        changeYear: toBool(attr.uiChangeYear),
                        yearRange: attr.uiYearRange,
                        onSelect: function(date) {
                            ctrl.$setViewValue(date);
                        }
                    });
                }
            };
        }])

        /**
         * @name Ui.uiDraggable
         * @description
         * Activates a DOM element as a draggable element. It requires jQueryUI to be loaded into the page for
         * it to have any effect.
         */
        .directive('uiDraggable', [function() {
            return {
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.draggable) {
                        return;
                    }

                    elm.draggable({
                        axis: attr.uiAxis,
                        delay: parseInt(attr.uiDelay)
                    });
                }
            };
        }])

        /**
         * @name Ui.uiAccordion
         * @description
         * Activates a DOM element as an accordion element. It requires jQueryUI to be loaded into the page for
         * it to have any effect.
         */
        .directive('uiAccordion', function() {
            return {
                link: function(scope, elm, attr) {
                    if (!elm.accordion) {
                        return;
                    }

                    elm.accordion({
                        header: attr.uiHeader,
                        heightStyle: attr.uiHeightStyle
                    });
                }
            };
        })

        /**
         * @name Ui.uiDialog
         * @requires $http
         * @requires $compile
         * @requires $rootScope
         * @description
         * Provides an API to open jQueryUI dialog modals. Each method requires a partial URL. That partial will then
         * be fetched, compiled and displayed as the dialog. You can have an ng-controller tag on that partial to put
         * controller logic relevant for that dialog.
         *
         * @example
         */
        .factory('uiDialog', ['$http', '$compile', '$rootScope', function($http, $compile, $rootScope) {
            return {
                /**
                 * @name Ui.uiDialog#open
                 * @methodOf Ui.uiDialog
                 * @description
                 * Opens a dialog window that functions similarly to an alert.
                 * @param {string} templateUrl A URL for a template to populate the dialog.
                 * @param {Object} options A configuration object, currently there are no options to configure.
                 */
                open: function(templateUrl, options) {
                    options = options || {};

                    $http.get(templateUrl).success(function(response) {
                        var scope = $rootScope.$new();

                        $compile(response)(scope, function(elm) {
                            elm.dialog({
                                modal: true
                            });

                            elm.on('dialogclose', function() {
                                elm.remove();
                            });
                        });
                    });
                }
            };
        }])

        /**
         * @name Ui.uiLoader
         * @description
         * Hides a DOM element and shows it only when loading take place. The element is being shown whenever an AJAX
         * takes place or when a route change happens.
         */
        .directive('uiLoader', ['$rootScope', function($rootScope) {
            return {
                link: function(scope, elm, attr, ctrl) {
                    var duration = parseInt(attr.uiDuration, 10) || 'fast';

                    elm.hide();

                    function hide() {
                        elm.fadeOut(duration);
                    }

                    function show() {
                        elm.fadeIn(duration);
                    }

                    $rootScope.$on('ajaxStart', show);
                    $rootScope.$on('ajaxFinish', hide);
                    $rootScope.$on('$routeChangeStart', show);
                    $rootScope.$on('$routeChangeSuccess', hide);
                }
            };
        }]);
}(window));