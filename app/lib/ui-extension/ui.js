/**
 * @TODO write file description
 */
(function(window) {
    'use strict';

    /**
     * @name ngUi
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
         * @name ngUi.uiChosen
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
         * @name ngUi.uiColorpicker
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
         * @name ngUi.uiDatePicker
         * @description
         * Activates a DOM input element as a date picker element. It requires jQueryUI to be loaded into the page for
         * it to have any effect.
         */
        .directive('uiDatepicker', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.datepicker) {
                        return;
                    }

                    elm.datepicker({
                        changeMonth: attr.uiChangeMonth === 'true',
                        changeYear: attr.uiChangeYear === 'true',
                        yearRange: attr.uiYearRange
                    });

                    elm.datepicker('option', 'onSelect', function(date){
                        ctrl.$setViewValue(date);
                    });
                }
            };
        }])

        /**
         * @name ngUi.uiDraggable
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
         * @name ngUi.uiAccordion
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
         * @name ngUi.uiDialog
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
                 * @name ngUi.uiDialog#alert
                 * @methodOf ngUi.uiDialog
                 * @description
                 * Opens a dialog window that functions similarly to an alert.
                 * @param {string} templateUrl A URL for a template to populate the dialog.
                 * @param {Object} options A configuration object, currently there are no options to configure.
                 */
                alert: function(templateUrl, options) {
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
         * @name ngUi.uiLoader
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