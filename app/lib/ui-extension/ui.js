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
         * will not throw any exceptions if it's not available. See @link { http://jqueryui.com/slider } for more
         * information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-min: The minimum value of the slider.
         *   ui-max: The maximum value of the slider.
         *   ui-orientation: Determines whether the slider handles move horizontally (min on left, max on right) or
         *     vertically (min on bottom, max on top). Possible values: "horizontal", "vertical".
         *   ui-step: Determines the size or amount of each interval or step the slider takes between the min and max.
         *     The full specified value range of the slider (max - min) should be evenly divisible by the step.
         *   disabled: Controls whether the element should be disabled.
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
                        min: parseInt(attr.uiMin),
                        max: parseInt(attr.uiMax),
                        orientation: attr.uiOrientation,
                        step: parseInt(attr.uiStep)
                    });
                }
            };
        })

        /**
         * @name Ui.uiDatePicker
         * @description
         * Makes a DOM input element with type text to work as a date picker element. It requires jQueryUI datepicker
         * component to work but it will not throw any exceptions if it's not available. See @link
         * { http://jqueryui.com/datepicker } for more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-alt-format: The dateFormat to be used for the altField option. This allows one date format to be shown
         *     to the user for selection purposes, while a different format is actually sent behind the scenes. For a
         *     full list of the possible formats see the formatDate function.
         *   ui-auto-size: Set to true to automatically resize the input field to accommodate dates in the current
         *     dateFormat.
         *   ui-button-image: The URL for the popup button image. If set, the ui-button-text option becomes the alt value
         *     and is not directly displayed.
         *   ui-button-image-only: Whether the button image should be rendered by itself instead of inside a button
         *     element.
         *   ui-button-text: The text to display on the trigger button. Use in conjunction with the ui-show-on option
         *     set to "button" or "both".
         *   ui-change-month: Whether the month should be rendered as a dropdown instead of text.
         *   ui-change-year: Whether the year should be rendered as a dropdown instead of text. Use the ui-year-range
         *     option to control which years are made available for selection.
         *   ui-close-text: The text to display for the close link. Use the showButtonPanel option to display this
         *     button.
         *   ui-constrain-input: When true, entry in the input field is constrained to those characters allowed by the
         *     current ui-date-format option.
         *   ui-current-text: The text to display for the current day link. Use the ui-show-button-panel option to
         *     display this button.
         *   ui-date-format: The format for parsed and displayed dates.
         *   ui-day-names: The list of long day names, starting from Sunday, for use as requested via the ui-date-format
         *     option.
         *   ui-day-names-min: The list of minimised day names, starting from Sunday, for use as column headers within
         *     the datepicker.
         *   ui-day-names-short: The list of abbreviated day names, starting from Sunday, for use as requested via the
         *     dateFormat option.
         *   ui-duration: Control the speed at which the datepicker appears, it may be a time in milliseconds or a
         *     string representing one of the three predefined speeds ("slow", "normal", "fast").
         *   ui-first-day: Set the first day of the week: Sunday is 0, Monday is 1, etc.
         *   ui-goto-current: When true, the current day link moves to the currently selected date instead of today.
         *   ui-hide-if-no-prev-next: Normally the previous and next links are disabled when not applicable
         *     (see the minDate and maxDate options). You can hide them altogether by setting this attribute to true.
         *   ui-is-rtl: Whether the current language is drawn from right to left.
         *   ui-max-date: The maximum selectable date. When set to null, there is no maximum.
         *   ui-min-date: The minimum selectable date. When set to null, there is no minimum.
         *   ui-month-names: The list of full month names, for use as requested via the ui-date-format option.
         *   ui-month-names-short: The list of abbreviated month names, as used in the month header on each datepicker
         *     and as requested via the ui-date-format option.
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
                        altFormat: attr.uiAltFormat,
                        autoSize: toBool(attr.uiAutoSize),
                        buttonImage: attr.uiButtonImage,
                        buttonImageOnly: toBool(attr.uiButtonImageOnly),
                        buttonText: attr.uiButtonText,
                        changeMonth: toBool(attr.uiChangeMonth),
                        changeYear: toBool(attr.uiChangeYear),
                        closeText: attr.uiCloseText,
                        constrainInput: toBool(attr.uiConstrainInput),
                        currentText: attr.uiCurrentText,
                        dateFormat: attr.uiDateFormat,
                        dayNames: scope.$eval(attr.uiDayNames),
                        dayNamesMin: scope.$eval(attr.uiDayNamesMin),
                        dayNamesShort: scope.$eval(attr.uiDayNamesShort),
                        duration: attr.uiDuration,
                        firstDay: parseInt(attr.uiFirstDay),
                        gotoCurrent: toBool(attr.uiGotoCurrent),
                        hideIfNoPrevNext: toBool(attr.uiHideIfNoPrevNext),
                        isRTL: toBool(attr.uiIsRtl),
                        maxDate: attr.uiMaxDate,
                        minDate: attr.uiMinDate,
                        monthNames: scope.$eval(attr.uiMonthNames),
                        monthNamesShort: scope.$eval(attr.uiMonthNamesShort),
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
         * Makes a DOM element of any type to work as a draggable element. It requires jQueryUI draggable component to
         * work but it will not throw any exceptions if it's not available. See @link { http://jqueryui.com/draggable }
         * for more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-axis: Constrains dragging to either the horizontal (x) or vertical (y) axis. Possible values: "x", "y".
         *   ui-cursor: The CSS cursor during the drag operation.
         *   ui-delay: Time in milliseconds after mousedown until dragging should start. This option can be used to
         *     prevent unwanted drags when clicking on an element.
         *   disabled: Controls whether the element should be disabled.
         *
         * @example
         *   The following HTML tag would be turned into a draggable element:
         *     <div ui-draggable ui-axis="x" ui-delay="100"></div>
         */
        .directive('uiDraggable', [function() {
            return {
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.draggable) {
                        return;
                    }

                    scope.$watch(function() { return attr.disabled; }, function(value) {
                        elm.draggable('option', 'disabled', value);
                    });

                    elm.draggable({
                        axis: attr.uiAxis,
                        cursor: attr.uiCursor,
                        delay: parseInt(attr.uiDelay)
                    });
                }
            };
        }])

        /**
         * @name Ui.uiAccordion
         * @description
         * Makes a DOM div element to work as an accordion element. It requires jQueryUI accordion component to work
         * but it will not throw any exceptions if it's not available. See @link { http://jqueryui.com/accordion } for
         * more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-active: Which panel is currently open.
         *   ui-animate: If and how to animate changing panels.
         *   ui-collapsible: Whether all the sections can be closed at once. Allows collapsing the active section.
         *   ui-event: The event that accordion headers will react to in order to activate the associated panel.
         *     Multiple events can be specificed, separated by a space.
         *   ui-header: Selector for the header element, applied via .find() on the main accordion element. Content
         *     panels must be the sibling immedately after their associated headers.
         *   ui-height-style: Controls the height of the accordion and each panel.
         *   disabled: Controls whether the element should be disabled.
         *
         * @example
         *   The following HTML tag would be turned into a draggable element:
         *     <div data-ui-accordion data-ui-height-style="auto" data-ui-header="div > h2"></div>
         */
        .directive('uiAccordion', function() {
            return {
                link: function(scope, elm, attr) {
                    if (!elm.accordion) {
                        return;
                    }

                    scope.$watch(function() { return attr.disabled; }, function(value) {
                        elm.accordion('option', 'disabled', value);
                    });

                    elm.accordion({
                        active: attr.uiAction,
                        animate: attr.uiAnimate,
                        collapsible: attr.uicollapsible,
                        event: attr.uiEvent,
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
         * Hides a DOM element and shows it only when loading take place. The element will only be shown during AJAX
         * calls or during route changes.
         *
         * It can be configured with the following HTML attributes:
         *   ui-duration: Determines how fast the element should be hidden and shown. Can be 'fast', 'medium' or
         *     'slow'.
         *
         * @example
         *   The following HTML tag would be turned into a draggable element:
         *     <div data-ui-loader data-ui-duration="slow">loading...</div>
         */
        .directive('uiLoader', ['$rootScope', function($rootScope) {
            return {
                link: function(scope, elm, attr, ctrl) {
                    var duration = parseInt(attr.uiDuration) || 'fast';

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