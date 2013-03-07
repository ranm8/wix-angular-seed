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
         * Activates a DOM select element as a Chosen element. It requires Chosen plugin to work but it will not throw
         * any exceptions if it's not available. See @link { http://harvesthq.github.com/chosen } for more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-disable-search: Disables the search option.
         *   ui-allow-single-deselect: Allows a single deselect.
         *
         * @example
         *   <select data-ui-chosen data-ng-model="model"
         *           data-ui-disable-search="true"
         *           data-ng-options="object for object in array">
         *   </select>
         */
        .directive('uiChosen', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.chosen) {
                        return;
                    }

                    elm.chosen({
                        disable_search: scope.$eval(attr.uiDisableSearch),
                        allow_single_deselect: scope.$eval(attr.uiAllowSingleDeselect)
                    });

                    ctrl.$render = function() {
                        elm.trigger('liszt:updated');
                    };

                    setTimeout(function() { elm.trigger('liszt:updated'); }, 1);
                }
            };
        }])

        /**
         * @name Ui.uiColorPicker
         * @description
         * Activates a DOM select element as a Chosen element. It requires Chosen plugin to work but it will not throw
         * any exceptions if it's not available. See @link { http://harvesthq.github.com/chosen } for more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-disable-search: Disables the search option.
         *   ui-allow-single-deselect: Allows a single deselect.
         *
         * @example
         *   <select data-ui-chosen data-ng-model="model"
         *           data-ui-disable-search="true"
         *           data-ng-options="object for object in array">
         *   </select>
         */
        .directive('uiColorPicker', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.ColorPicker) {
                        return;
                    }

                    elm.on('colorChanged', function(event, data) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(data.selected_color);
                        });
                    });

                    ctrl.$render = function() {
                        elm.ColorPicker({
                            startWithColor: ctrl.$viewValue
                        });
                    };
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

                    elm.on('slidestop', function(event, ui) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(ui.value);
                        });
                    });

                    scope.$watch(function() { return attr.disabled; }, function(value) {
                        elm.slider('option', 'disabled', value);
                    });

                    elm.slider({
                        min: scope.$eval(attr.uiMin),
                        max: scope.$eval(attr.uiMax),
                        orientation: attr.uiOrientation,
                        step: scope.$eval(attr.uiStep)
                    });
                }
            };
        })

        /**
         * @name Ui.uiDatePicker
         * @description
         * Makes a DOM input element with type text to work as a date picker element. It requires jQueryUI datepicker
         * component to work but it will not throw any exceptions if it's not available. See @link { http://jqueryui.com/datepicker }
         * for more information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-auto-size: Set to true to automatically resize the input field to accommodate dates in the current
         *     dateFormat.
         *   ui-button-image: The URL for the popup button image. If set, the ui-button-text option becomes the alt
         *     value and is not directly displayed.
         *   ui-button-text: The text to display on the trigger button. Use in conjunction with the ui-show-on option
         *     set to "button" or "both".
         *   ui-change-month: Whether the month should be rendered as a dropdown instead of text.
         *   ui-change-year: Whether the year should be rendered as a dropdown instead of text. Use the ui-year-range
         *     option to control which years are made available for selection.
         *   ui-close-text: The text to display for the close link. Use the showButtonPanel option to display this
         *     button.
         *   ui-current-text: The text to display for the current day link. Use the ui-show-button-panel option to
         *     display this button.
         *   ui-date-format: The format for parsed and displayed dates.
         *   ui-day-names: The list of long day names, starting from Sunday, for use as requested via the ui-date-format
         *     option.
         *   ui-duration: Control the speed at which the datepicker appears, it may be a time in milliseconds or a
         *     string representing one of the three predefined speeds ("slow", "normal", "fast").
         *   ui-first-day: Set the first day of the week: Sunday is 0, Monday is 1, etc.
         *   ui-goto-current: When true, the current day link moves to the currently selected date instead of today.
         *   ui-is-rtl: Whether the current language is drawn from right to left.
         *   ui-max-date: The maximum selectable date. When set to null, there is no maximum.
         *   ui-min-date: The minimum selectable date. When set to null, there is no minimum.
         *   ui-month-names: The list of full month names, for use as requested via the ui-date-format option.
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

                    elm.datepicker({
                        autoSize: scope.$eval(attr.uiAutoSize),
                        buttonImage: attr.uiButtonImage,
                        buttonImageOnly: scope.$eval(attr.uiButtonImageOnly),
                        buttonText: attr.uiButtonText,
                        changeMonth: scope.$eval(attr.uiChangeMonth),
                        changeYear: scope.$eval(attr.uiChangeYear),
                        closeText: attr.uiCloseText,
                        currentText: attr.uiCurrentText,
                        dateFormat: attr.uiDateFormat,
                        dayNames: scope.$eval(attr.uiDayNames),
                        duration: attr.uiDuration,
                        firstDay: scope.$eval(attr.uiFirstDay),
                        gotoCurrent: scope.$eval(attr.uiGotoCurrent),
                        isRTL: scope.$eval(attr.uiIsRtl),
                        maxDate: attr.uiMaxDate,
                        minDate: attr.uiMinDate,
                        monthNames: scope.$eval(attr.uiMonthNames),
                        showOn: attr.uiShowOn,
                        yearRange: attr.uiYearRange
                    });

                    elm.datepicker('option', 'onSelect', function(date) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(date);
                        });
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
                        delay: scope.$eval(attr.uiDelay)
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
                link: function(scope, elm, attr, ctrl) {
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
         * @description
         * Makes a DOM div element to work as a dialog element. It requires jQueryUI dialog component to work but it
         * will not throw any exceptions if it's not available. See @link { http://jqueryui.com/dialog } for more
         * information.
         *
         * It can be configured with the following HTML attributes:
         *   ui-auto-open: If set to true, the dialog will automatically open upon initialization. If false, the dialog
         *     will stay hidden until the open() method is called.
         *   ui-close-on-escape: Specifies whether the dialog should close when it has focus and the user presses the
         *     esacpe (ESC) key.
         *   ui-close-text: Specifies the text for the close button. Note that the close text is visibly hidden when
         *     using a standard theme.
         *   ui-dialog-class: The specified class name(s) will be added to the dialog, for additional theming.
         *   ui-draggable: If set to true, the dialog will be draggable by the title bar. Requires the jQuery UI
         *     Draggable widget to be included.
         *   ui-height: The height of the dialog.
         *   ui-max-height: The maximum height to which the dialog can be resized, in pixels.
         *   ui-max-width: The maximum width to which the dialog can be resized, in pixels.
         *   ui-min-height: The minimum height to which the dialog can be resized, in pixels.
         *   ui-min-width: The minimum width to which the dialog can be resized, in pixels.
         *   ui-modal: If set to true, the dialog will have modal behavior; other items on the page will be disabled,
         *     i.e., cannot be interacted with. Modal dialogs create an overlay below the dialog but above other page
         *     elements.
         *   ui-resizeable: If set to true, the dialog will be resizable. Requires the jQuery UI Resizable widget to be
         *     included.
         *   ui-title: Specifies the title of the dialog. If the value is null, the title attribute on the dialog
         *     source element will be used.
         *   ui-width: The width of the dialog, in pixels.
         *
         * @example
         *   The following HTML tag would be turned into a dialog element that would show itself as soon as it's
         *   compiled:
         *   <div title="Dialog!" data-ui-dialog>
         *       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor accumsan hendrerit. Nulla
         *       dictum dignissim iaculis. Mauris in eros diam. Duis auctor rhoncus massa at commodo.
         *   </div>
         */
        .directive('uiDialog', function() {
            return {
                link: function(scope, elm, attr, ctrl) {
                    if (!elm.dialog) {
                        return;
                    }

                    elm.dialog({
                        autoOpen: scope.$eval(attr.uiAutoOpen),
                        closeOnEscape: scope.$eval(attr.uiCloseOnEscape),
                        closeText: attr.uiCloseText,
                        dialogClass: attr.uiDialogClass,
                        draggable: scope.$eval(attr.uiDraggable),
                        height: scope.$eval(attr.uiHeight),
                        MaxHeight: scope.$eval(attr.uiMaxHeight),
                        MaxWidth: scope.$eval(attr.uiMaxWidth),
                        MinHeight: scope.$eval(attr.uiMinHeight),
                        MinWidth: scope.$eval(attr.uiMinWidth),
                        modal: scope.$eval(attr.uiModal),
                        resizable: scope.$eval(attr.uiResizeable),
                        title: attr.uiTitle,
                        width: scope.$eval(attr.uiWidth)
                    });
                }
            };
        })

        /**
         * @name Ui.partialLoader
         * @requires $http
         * @requires $compile
         * @requires $rootScope
         * @description
         * Allows the controller to dynamically load a partial and compile it. Any directives on that partial will go
         * off. Useful for opening a new dialog window.
         */
        .provider('partialLoader', function() {
            this.$get = ['$http', '$compile', '$rootScope', function($http, $compile, $rootScope) {
                return {
                    load: function(templateUrl, options) {
                        $http.get(templateUrl).success(function(response) {
                            $compile(response)($rootScope.$new());
                        });
                    }
                };
            }];
        })

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
                    var duration = scope.$eval(attr.uiDuration) || 'fast';

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