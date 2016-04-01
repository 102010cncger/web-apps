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
var ApplicationController = new(function(){
    var me,
        api,
        config = {},
        docConfig = {},
        embedConfig = {},
        permissions = {},
        maxPages = 0,
        minToolbarWidth = 550,
        minEmbedWidth = 400,
        minEmbedHeight = 600,
        embedCode = '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="{embed-url}" width="{width}" height="{height}"></iframe>',
        maxZIndex = 9090,
        created = false,
        iframePrint = null;

    // Initialize analytics
    // -------------------------

//    Common.Analytics.initialize('UA-12442749-13', 'Embedded ONLYOFFICE Spreadsheet');


    // Check browser
    // -------------------------

    if (typeof isBrowserSupported !== 'undefined' && !isBrowserSupported()){
        Common.Gateway.reportError(undefined, 'Your browser is not supported.');
        return;
    }


    // Initialize ZeroClipboard
    // -------------------------

    ZeroClipboard.setMoviePath('../../../vendor/ZeroClipboard/ZeroClipboard10.swf');
    var clipShortUrl = new ZeroClipboard.Client();
    var clipEmbedObj = new ZeroClipboard.Client();
    clipShortUrl.zIndex = maxZIndex;
    clipEmbedObj.zIndex = maxZIndex;


    // Utils
    // -------------------------

    function emptyFn(){}

    function createBuffered(fn, buffer, scope, args) {
        return function(){
            var timerId;
            return function() {
                var me = this;
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function(){
                    fn.apply(scope || me, args || arguments);
                }, buffer);
            };
        }();
    }

    function updateSocial() {
        var $socialPanel = $('#id-popover-social-container');

        if ($socialPanel.length > 0) {
            if ($socialPanel.attr('data-loaded') == 'false') {
                typeof FB !== 'undefined' && FB.XFBML && FB.XFBML.parse();
                typeof twttr !== 'undefined' && twttr.widgets && twttr.widgets.load();

                $socialPanel.attr('data-loaded', 'true');
            }
        }
    }

    // Handlers
    // -------------------------

    function loadConfig(data) {
        config = $.extend(config, data.config);
        embedConfig = $.extend(embedConfig, data.config.embedded);

        $('#id-short-url').val(embedConfig.shareUrl || 'Unavailable');
        $('#id-textarea-embed').text(embedCode.replace('{embed-url}', embedConfig.embedUrl).replace('{width}', minEmbedWidth).replace('{height}', minEmbedHeight));

        if (typeof embedConfig.shareUrl !== 'undefined' && embedConfig.shareUrl != ''){
            (function(d, s, id) {
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(id)) return;
                  js = d.createElement(s); js.id = id;
                  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
                  fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

            if ($('#id-popover-social-container ul')){
                $('#id-popover-social-container ul').append('<li><div class="fb-like" data-href="' + embedConfig.shareUrl + '" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div></li>');
                $('#id-popover-social-container ul').append('<li class="share-twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="' + embedConfig.shareUrl + '">Tweet</a></li>'); //data-count="none"
                $('#id-popover-social-container ul').append('<li class="share-mail"><a class="btn btn-xs btn-default" href="mailto:?subject=I have shared a document with you: ' + embedConfig.docTitle + '&body=I have shared a document with you: ' + encodeURIComponent(embedConfig.shareUrl) + '"><span class="glyphicon glyphicon-envelope">Email</a></li>');
            }
        }
        if (typeof embedConfig.shareUrl === 'undefined')
            $('#id-btn-share').hide();

        if (typeof embedConfig.embedUrl === 'undefined')
            $('#id-btn-embed').hide();

        if (typeof embedConfig.fullscreenUrl === 'undefined')
            $('#id-btn-fullscreen').hide();

        if (config.canBackToFolder === false || !(config.customization && config.customization.goback && config.customization.goback.url))
            $('#id-btn-close').hide();


        // Docked toolbar
        if (embedConfig.toolbarDocked === 'top') {
            $('#toolbar').addClass('top');
            $('.viewer').addClass('top');
        } else {
            $('#toolbar').addClass('bottom');
            $('.viewer').addClass('bottom');
        }
    }

    function loadDocument(data) {
        docConfig = data.doc;

        if (docConfig) {
            permissions = $.extend(permissions, docConfig.permissions);

            var docInfo = new CDocInfo();
            docInfo.put_Id(docConfig.key);
            docInfo.put_Url(docConfig.url);
            docInfo.put_Title(docConfig.title);
            docInfo.put_Format(docConfig.fileType);
            docInfo.put_VKey(docConfig.vkey);

            if (api) {
                api.asc_registerCallback('asc_onGetEditorPermissions', onEditorPermissions);
                api.asc_setDocInfo(docInfo);
                api.asc_getEditorPermissions(config.licenseUrl, config.customerId);
                api.asc_enableKeyEvents(true);

                Common.Analytics.trackEvent('Load', 'Start');
            }

            if (docConfig.title && !embedConfig.docTitle) {
                var el = $('#id-popover-social-container ul .share-mail > a');
                if (el.length) {
                    el.attr('href', el.attr('href').replace(/:\sundefined&/, ': ' + docConfig.title + '&'));
                }
            }

            if (typeof embedConfig.saveUrl === 'undefined' && permissions.print === false)
                $('#id-btn-copy').hide();
            if (!$('#id-btn-copy').is(":visible") && !$('#id-btn-share').is(":visible") && !$('#id-btn-embed').is(":visible") )
                $('#toolbar .left .separator').hide();
        }
    }

    function onSheetsChanged(){
        if (api){
            maxPages = api.asc_getWorksheetsCount();

            var setActiveWorkSheet = function(index) {
                $.each($('#worksheets').children('li'), function(){
                    $(this).removeClass('active');
                });
                $('#worksheet-' + index).addClass('active');
                api.asc_showWorksheet(index);
            };

            var handleWorksheet = function(e){
                var $worksheet = $(this);
                var index = $worksheet.attr('id').match(/\d+/);

                if (index.length > 0) {
                    index = parseInt(index[0]);

                    if (index > -1 && index < maxPages)
                        setActiveWorkSheet(index);
                }
            };

            $.each($('#worksheets').children('li'), function(){
                $(this).unbind('click');
                $(this).remove();
            });

            for (var i = 0; i < maxPages; i++) {
                $('#worksheets').append('<li id="worksheet-' + i + '">' + api.asc_getWorksheetName(i).replace(/\s/g,'&nbsp;') + '</li>');
                var $worksheet = $('#worksheet-' + i);
                $worksheet && $worksheet.bind('click', handleWorksheet)
            }

            setActiveWorkSheet(api.asc_getActiveWorksheetIndex());
        }
    }

    function onHyperlinkClick(url) {
        if (url) {
            var newDocumentPage = window.open(url, '_blank');
            if (newDocumentPage)
                newDocumentPage.focus();
        }
    }

    function onDownloadUrl(url) {
        Common.Gateway.downloadAs(url);
    }

    function onPrint() {
        if (api && permissions.print!==false)
            api.asc_Print(undefined, $.browser.chrome || $.browser.safari || $.browser.opera);
    }

    function onPrintUrl(url) {
        if (!iframePrint) {
            iframePrint = document.createElement("iframe");
            iframePrint.id = "id-print-frame";
            iframePrint.style.display = 'none';
            iframePrint.style.visibility = "hidden";
            iframePrint.style.position = "fixed";
            iframePrint.style.right = "0";
            iframePrint.style.bottom = "0";
            document.body.appendChild(iframePrint);
            iframePrint.onload = function() {
                iframePrint.contentWindow.focus();
                iframePrint.contentWindow.print();
            };
        }
        if (url) iframePrint.src = url;
    }

    function hidePreloader() {
        $('#loading-mask').fadeOut('slow');
    }

    function onDocumentContentReady() {
        setVisiblePopover($('#id-popover-share'), false);
        setVisiblePopover($('#id-popover-embed'), false);

        handlerToolbarSize();
        hidePreloader();

        Common.Analytics.trackEvent('Load', 'Complete');
    }

    function onEditorPermissions(params) {
        if ( params.asc_getCanBranding() && (typeof config.customization == 'object') &&
            config.customization && config.customization.logo ) {

            var logo = $('#header-logo');
            if (config.customization.logo.imageEmbedded) {
                logo.html('<img src="'+config.customization.logo.imageEmbedded+'" style="max-width:124px; max-height:20px;"/>');
                logo.css({'background-image': 'none', width: 'auto', height: 'auto'});
            }

            if (config.customization.logo.url) {
                logo.attr('href', config.customization.logo.url);
            }
        }
        api.asc_setViewMode(true);
        api.asc_LoadDocument();
    }
    
    function showMask() {
        $('#id-loadmask').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideMask() {
        $('#id-loadmask').modal('hide');
    }

    function onOpenDocument(progress) {
        var proc = (progress.asc_getCurrentFont() + progress.asc_getCurrentImage())/(progress.asc_getFontsCount() + progress.asc_getImagesCount());
        $('#loadmask-text').html('Loading document: ' + Math.min(Math.round(proc * 100), 100) + '%');
    }

    function onLongActionBegin(type, id){
        var text = '';
        switch (id)
        {
            case c_oAscAsyncAction['Print']:
                text = 'Downloading document...';
                break;
            default:
                text = 'Please wait...';
                break;
        }

        if (type == c_oAscAsyncActionType['BlockInteraction']) {
            $('#id-loadmask .cmd-loader-title').html(text);
            showMask();
        }
    }

    function onLongActionEnd(type, id){
        if (type === c_oAscAsyncActionType.BlockInteraction) {
            switch (id) {
                case c_oAscAsyncAction.Open:
                    if (api) {
                        api.asc_Resize();
                    }

                    onDocumentContentReady();
                    onSheetsChanged();
                    break;
            }

            hideMask();
        }
    }

    function onError(id, level, errData) {
        hidePreloader();

        var message;

        switch (id)
        {
            case c_oAscError.ID.Unknown:
                message = me.unknownErrorText;
                break;

            case c_oAscError.ID.ConvertationTimeout:
                message = me.convertationTimeoutText;
                break;

            case c_oAscError.ID.ConvertationError:
                message = me.convertationErrorText;
                break;

            case c_oAscError.ID.DownloadError:
                message = me.downloadErrorText;
                break;

            default:
                message = me.errorDefaultMessage.replace('%1', id);
                break;
        }

        if (level == c_oAscError.Level.Critical) {

            // report only critical errors
            Common.Gateway.reportError(id, message);

            $('#id-critical-error-title').text(me.criticalErrorTitle);
            $('#id-critical-error-message').text(message);
            $('#id-critical-error-close').off();
            $('#id-critical-error-close').on('click', function(){
                window.location.reload();
            });
        }
        else {
            $('#id-critical-error-title').text(me.notcriticalErrorTitle);
            $('#id-critical-error-message').text(message);
            $('#id-critical-error-close').off();
            $('#id-critical-error-close').on('click', function(){
                $('#id-critical-error-dialog').modal('hide');
            });
        }

        $('#id-critical-error-dialog').modal('show');

        Common.Analytics.trackEvent('Internal Error', id.toString());
    }

    function onExternalError(error) {
        if (error) {
            hidePreloader();
            $('#id-error-mask-title').text(error.title);
            $('#id-error-mask-text').text(error.msg);
            $('#id-error-mask').css('display', 'block');

            Common.Analytics.trackEvent('External Error', error.title);
        }
    }

    function onProcessMouse(data) {
        if (data.type == 'mouseup') {
            var editor = document.getElementById('editor_sdk');
            if (editor) {
                var rect = editor.getBoundingClientRect();
                var event = window.event || arguments.callee.caller.arguments[0];
                api.asc_onMouseUp(event, data.x - rect.left, data.y - rect.top);
            }
        }
    }

    function onDownloadAs() {
        if (api) api.asc_DownloadAs(c_oAscFileType.XLSX, true);
    }

    // Helpers
    // -------------------------

    var handlerToolbarSize = createBuffered(function(size){
        var visibleCaption = function(btn, visible){
            if (visible){
                $(btn + ' button').addClass('no-caption');
                $(btn + ' button span').css('display', 'none');
            } else {
                $(btn + ' button').removeClass('no-caption');
                $(btn + ' button span').css('display', 'inline');
            }
        };

        var isMinimize = $('#toolbar').width() < minToolbarWidth;

        visibleCaption('#id-btn-copy',  isMinimize);
        visibleCaption('#id-btn-share', isMinimize);
        visibleCaption('#id-btn-embed', isMinimize);
    }, 10);

    function onDocumentResize() {
        if (api)
            api.asc_Resize();

        handlerToolbarSize();
    }

    function isVisiblePopover(popover){
        return popover.hasClass('in');
    }

    function setVisiblePopover(popover, visible, owner){
        api && api.asc_enableKeyEvents(!visible);

        if (visible){
            if (owner){
                popover.css('display', 'block');

                var popoverData     = owner.data('bs.popover'),
                    $tip            = popoverData.tip(),
                    pos             = popoverData.getPosition(false),
                    actualHeight    = $tip[0].offsetHeight,
                    placement       = (embedConfig.toolbarDocked === 'top') ? 'bottom' : 'top',
                    tp;

                $tip.removeClass('fade in top bottom left right');

                switch (placement) {
                    case 'bottom':
                        tp = {
                            top : pos.top + pos.height,
                            left: owner.position().left + (owner.width() - popover.width()) * 0.5
                        };
                        break;

                    default:
                    case 'top':
                        tp = {
                            top : pos.top - actualHeight,
                            left: owner.position().left + (owner.width() - popover.width()) * 0.5
                        };
                        break;

                }

                $tip
                    .css(tp)
                    .addClass(placement)
                    .addClass('in')
            }

            if (popover.hasClass('embed')) {
                clipEmbedObj.show();
            }

            if (popover.hasClass('share')) {
                clipShortUrl.show();
                updateSocial();
            }
        } else {
            popover.removeClass('in');
            popover.css('display', 'none');

            popover.hasClass('embed') && clipEmbedObj.hide();
            popover.hasClass('share') && clipShortUrl.hide();
        }
    }

    function updateEmbedCode(){
        var newWidth  = parseInt($('#id-input-embed-width').val()),
            newHeight = parseInt($('#id-input-embed-height').val());

        if (newWidth < minEmbedWidth)
            newWidth = minEmbedWidth;

        if (newHeight < minEmbedHeight)
            newHeight = minEmbedHeight;

        $('#id-textarea-embed').text(embedCode.replace('{embed-url}', embedConfig.embedUrl).replace('{width}', newWidth).replace('{height}', newHeight));

        $('#id-input-embed-width').val(newWidth + 'px');
        $('#id-input-embed-height').val(newHeight + 'px');
    }

    function openLink(url){
        var newDocumentPage = window.open(url);
        if (newDocumentPage)
            newDocumentPage.focus();
    }

    function createController(){
        if (created)
            return me;

        me = this;
        created = true;

        var documentMoveTimer;

        // Initialize clipboard objects

        clipShortUrl.addEventListener('mousedown', function() {
            if ($('#id-btn-copy-short').hasClass('copied'))
                return;

            $('#id-btn-copy-short').button('copied');
            $('#id-btn-copy-short').addClass('copied');

            clipShortUrl.setText($('#id-short-url').val());

            setTimeout(function(){
                $('#id-btn-copy-short').button('reset');
                $('#id-btn-copy-short').removeClass('copied');
            }, 2000);
        });

        clipEmbedObj.addEventListener('mousedown', function(){
            if ($('#id-btn-copy-embed').hasClass('copied'))
                return;

            $('#id-btn-copy-embed').button('copied');
            $('#id-btn-copy-embed').addClass('copied');

            clipEmbedObj.setText($('#id-textarea-embed').text());

            setTimeout(function(){
                $('#id-btn-copy-embed').button('reset');
                $('#id-btn-copy-embed').removeClass('copied');
            }, 2000);
        });

        clipShortUrl.glue('id-btn-copy-short');
        clipEmbedObj.glue('id-btn-copy-embed');


        // popover ui handlers

        $('#id-btn-copy').on('click', function(){
            var saveUrl = embedConfig.saveUrl;
            if (typeof saveUrl !== 'undefined' && saveUrl.length > 0){
                openLink(saveUrl);
            } else if (api && permissions.print!==false){
                api.asc_Print(undefined, $.browser.chrome || $.browser.safari || $.browser.opera);
            }

            Common.Analytics.trackEvent('Save');
        });

        $('#id-btn-share').on('click', function(event){
            setVisiblePopover($('#id-popover-share'), !isVisiblePopover($('#id-popover-share')), $('#id-btn-share'));
            setVisiblePopover($('#id-popover-embed'), false);

            event.preventDefault();
            event.stopPropagation();
        });

        $('#id-btn-embed').on('click', function(event){
            setVisiblePopover($('#id-popover-embed'), !isVisiblePopover($('#id-popover-embed')), $('#id-btn-embed'));
            setVisiblePopover($('#id-popover-share'), false);

            event.preventDefault();
            event.stopPropagation();
        });

        $('#id-input-embed-width').on('keypress', function(e){
            if (e.keyCode == 13)
                updateEmbedCode();
        });

        $('#id-input-embed-height').on('keypress', function(e){
            if (e.keyCode == 13)
                updateEmbedCode();
        });

        $('#id-input-embed-width').on('focusin', function(e){
            api && api.asc_enableKeyEvents(false);
        });

        $('#id-input-embed-height').on('focusin', function(e){
            api && api.asc_enableKeyEvents(false);
        });

        $('#id-input-embed-width').on('focusout', function(e){
            updateEmbedCode();
            api && api.asc_enableKeyEvents(true);
        });

        $('#id-input-embed-height').on('focusout', function(e){
            updateEmbedCode();
            api && api.asc_enableKeyEvents(true);
        });

        $('#id-btn-fullscreen').on('click', function(){
            openLink(embedConfig.fullscreenUrl);
        });

        $('#id-btn-close').on('click', function(){
            if (config.customization && config.customization.goback && config.customization.goback.url)
                window.parent.location.href = config.customization.goback.url;
        });

        $('#id-btn-zoom-in').on('click', function(){
            if (api){
                var f = Math.floor(api.asc_getZoom() * 10)/10;
                f += .1;
                f > 0 && !(f > 2.) && api.asc_setZoom(f);
            }
        });

        $('#id-btn-zoom-out').on('click', function(){
            if (api){
                var f = Math.ceil(api.asc_getZoom() * 10)/10;
                f -= .1;
                !(f < .5) && api.asc_setZoom(f);
            }
        });

        $(window).resize(function(){
            onDocumentResize();
        });

        $(document).click(function(event){
            if (event && event.target && $(event.target).closest('.popover').length > 0)
                return;

            setVisiblePopover($('#id-popover-share'), false);
            setVisiblePopover($('#id-popover-embed'), false);
        });

        $(document).mousemove(function(event){
            $('#id-btn-zoom-in').fadeIn();
            $('#id-btn-zoom-out').fadeIn();

            clearTimeout(documentMoveTimer);
            documentMoveTimer = setTimeout(function(){
                $('#id-btn-zoom-in').fadeOut();
                $('#id-btn-zoom-out').fadeOut();
            }, 2000);
        });

        api = new Asc.spreadsheet_api("editor_sdk");

        if (api){
            api.asc_SetFontsPath("../../../../sdkjs/fonts/");

            api.asc_registerCallback('asc_onStartAction',           onLongActionBegin);
            api.asc_registerCallback('asc_onEndAction',             onLongActionEnd);
            api.asc_registerCallback('asc_onError',                 onError);
            api.asc_registerCallback('asc_onOpenDocumentProgress',  onOpenDocument);
            api.asc_registerCallback('asc_onSheetsChanged',         onSheetsChanged);
            api.asc_registerCallback('asc_onHyperlinkClick',        onHyperlinkClick);
            api.asc_registerCallback('asc_onDownloadUrl',           onDownloadUrl);
            api.asc_registerCallback('asc_onPrint',                 onPrint);
            api.asc_registerCallback('asc_onPrintUrl',              onPrintUrl);

            // Initialize api gateway
            Common.Gateway.on('init',               loadConfig);
            Common.Gateway.on('opendocument',       loadDocument);
            Common.Gateway.on('showerror',          onExternalError);
            Common.Gateway.on('processmouse',       onProcessMouse);
            Common.Gateway.on('downloadas',         onDownloadAs);
            Common.Gateway.ready();
        }

        return me;
    }

    return {
        create                  : createController,
        errorDefaultMessage     : 'Error code: %1',
        unknownErrorText        : 'Unknown error.',
        convertationTimeoutText : 'Convertation timeout exceeded.',
        convertationErrorText   : 'Convertation failed.',
        downloadErrorText       : 'Download failed.',
        criticalErrorTitle      : 'Error',
        notcriticalErrorTitle   : 'Warning'
    }
})();