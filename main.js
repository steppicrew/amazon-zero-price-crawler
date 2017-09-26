'use strict';

jQuery(function( $ ) {
    var storage= window.localStorage;
    var amazonHistory= {};
    (storage.getItem('amazonHistory') || '').split(',').forEach(function( asin ) { if ( asin ) amazonHistory[asin]= undefined });

    var writeHistory= function() {
        storage.setItem('amazonHistory', Object.keys(amazonHistory).join(','));
    };
    var setHistory= function( asin ) {
        amazonHistory[asin]= undefined;
        writeHistory();
    };
    var unsetHistory= function( asin ) {
        delete amazonHistory[asin];
        writeHistory();
    };

    var $content= $('.content');
    var $body= $('body');
    var $document= $(document);

    var amazonResult= window.amazonResult;

    var openNewTab= function ( url ) {
        chrome.tabs.create({ url: url, selected: false, }); 
    };

    $document
        .on('click', 'a.all', function() {
            $body.addClass('show-new').addClass('show-old');
        })
        .on('click', 'a.new', function() {
            $body.addClass('show-new').removeClass('show-old');
        })
        .on('click', 'a.old', function() {
            $body.removeClass('show-new').addClass('show-old');
        })
        .on('click', '.prod a[asin]', function( ev ) {
            var $this= $(this);
            var asin= $this.prop('asin');
            var alreadySeen= asin in amazonHistory;
            if ( alreadySeen ) {
                setHistory(asin);
            }
            else {
                unsetHistory(asin);
            }
            $this.closest('.prod').toggleClass('is-old', !alreadySeen).toggleClass('is-new', alreadySeen);
            openNewTab($this.prop('href'));
            ev.preventDefault();
        })
    ;

    for ( var asin in amazonResult ) {
        var prod= amazonResult[asin];
        var $div= $('<div class="prod"/>');
        var $a= $('<a href="' + prod.url + '" asin="' + asin + '" target="_blank"/>');
        $div.append($a);
        $a.append('<img src="' + prod.image + '">');
        $a.append(prod.title);

        $div.addClass(asin in amazonHistory ? 'is-old' : 'is-new');

        $content.append($div)
    }
});
