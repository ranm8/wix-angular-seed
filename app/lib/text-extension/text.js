/**
 * @TODO write file description
 */
(function(window) {
    'use strict';

    /**
     * @name ngText
     * @description
     * Provides a collections of tools that manipulate text and display it in different forms.
     */
    window.angular.module('Text', [])
        /**
         * @name ngText.truncate
         * @description
         * Truncates a string by a length and appends a separator to it if it has been truncated. Length defaults to 30,
         * preserve defaults to false and if set to true, words won't be cut. Separator defaults to '...'.
         */
        .filter('truncate', [function() {
            return function(text, length, preserve, separator) {
                text = text || '';
                length = length || 30;
                preserve = preserve || false;
                separator = separator || '...';

                if(text.length > length) {
                    text = text.substring(0, length);

                    if (preserve) {
                        text = text.substring(0, Math.min(text.length, text.lastIndexOf(" ")));
                    }

                    text = text + separator;
                }

                return text;
            };
        }])

        /**
         * @name ngText.wordwrap
         * @description
         * Wraps a string to a given number of characters using a string break character as a default.
         */
        .filter('wordwrap', [function() {
            return function(text, length, separator, preserve) {
                length = length || 80;
                separator = separator || '\n';
                preserve = preserve || false;

                var regex = '.{1,' + length + '}(\\s|$)' + (!preserve ? '|.{' + length + '}|.+$' : '|\\S+?(\\s|$)');

                text = text.match(new RegExp(regex, 'g') ).join( separator);

                return text;
            };
        }])

        /**
         * @name ngText.nl2br
         * @description
         * Inserts HTML line breaks before all newlines in a string.
         */
        .filter('nl2br', [function() {
            return function(text, separator) {
                separator = separator || '<br />';

                return text.replace(/\n/g, separator);
            };
        }])

        /**
         * @todo docs
         */
        .filter('timeago', [function() {
            return function(time) {
                // todo
            };
        }]);
}(window));