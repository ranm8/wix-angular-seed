/**
 * Ronen Amiel <ronena@codeoasis.com>
 * 2/17/13, 1:11 PM
 */
(function(window) {
    'use strict';

    describe('Text extension', function() {
        beforeEach(module('Text'));

        describe('truncate', function() {
            it('should truncate a string and append a prefix to it with or without preserving words', inject(function(truncateFilter) {
                expect(truncateFilter('hello world', 5)).toEqual('hello...');
                expect(truncateFilter('hello world', 8, true)).toEqual('hello...');
                expect(truncateFilter('hello world', 8, false)).toEqual('hello wo...');
                expect(truncateFilter('hello world', 8, true, '123')).toEqual('hello123');
            }));
        });

        describe('wordwrap', function() {
            it('should wrap a string to a given number of characters using a string break character', inject(function(wordwrapFilter) {
                expect(wordwrapFilter('hello world', 5)).toEqual('hello \nworld');
                expect(wordwrapFilter('hello world', 5, '123')).toEqual('hello 123world');
            }));
        });

        describe('nl2br', function() {
            it('should insert HTML line breaks before all newlines in a string', inject(function(nl2brFilter) {
                expect(nl2brFilter('hello\n world\n')).toEqual('hello<br /> world<br />');
                expect(nl2brFilter('hello\n world\n', 'BR')).toEqual('helloBR worldBR');
            }));
        });
    });
}(window));