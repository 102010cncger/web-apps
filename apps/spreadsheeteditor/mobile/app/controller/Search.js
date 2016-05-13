/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html).
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute.
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
Ext.define('SSE.controller.Search', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            nextResult      : '#id-btn-search-prev',
            previousResult  : '#id-btn-search-next',
            searchField     : '#id-field-search'
        },

        control: {
            '#id-btn-search-prev': {
                tap: 'onPreviousResult'
            },
            '#id-btn-search-next': {
                tap: 'onNextResult'
            },
            '#id-field-search': {
                keyup: 'onSearchKeyUp',
                change: 'onSearchChange',
                clearicontap: 'onSearchClear'
            }
        }
    },

    _step: -1,

    init: function() {
    },

    setApi: function(o) {
        this.api = o;
        this.findOptions = new Asc.asc_CFindOptions();
        this.findOptions.asc_setScanForward(true);
        this.findOptions.asc_setIsMatchCase(false);
        this.findOptions.asc_setIsWholeCell(false);
        this.findOptions.asc_setScanOnOnlySheet(true);
        this.findOptions.asc_setScanByRows(true);
        this.findOptions.asc_setLookIn(Asc.c_oAscFindLookIn.Formulas);
    },

    onNextResult: function(){
        var searchField = this.getSearchField();
        if (this.api && searchField){
            this.findOptions.asc_setFindWhat(searchField.getValue());
            this.findOptions.asc_setScanForward(true);
            this.api.asc_findText(this.findOptions);
        }
    },

    onPreviousResult: function(){
        var searchField = this.getSearchField();
        if (this.api && searchField){
            this.findOptions.asc_setFindWhat(searchField.getValue());
            this.findOptions.asc_setScanForward(false);
            this.api.asc_findText(this.findOptions);
        }
    },

    onSearchKeyUp: function(field, e){
        var keyCode = e.event.keyCode,
            searchField = this.getSearchField();

        if (keyCode == 13 && this.api) {
            this.findOptions.asc_setFindWhat(searchField.getValue());
            this.findOptions.asc_setScanForward(true);
            this.api.asc_findText(this.findOptions);
        }
        this.updateNavigation();
    },

    onSearchChange: function(field, newValue, oldValue){
        this.updateNavigation();
    },

    onSearchClear: function(field, e){
        this.updateNavigation();

        // workaround blur problem in iframe (bug #12685)
        window.focus();
        document.activeElement.blur();
    },

    updateNavigation: function(){
        var searchField = this.getSearchField(),
            nextResult = this.getNextResult(),
            previousResult = this.getPreviousResult();

        if (searchField && nextResult && previousResult){
            nextResult.setDisabled(searchField.getValue() == '');
            previousResult.setDisabled(searchField.getValue() == '');
        }
    }
});
