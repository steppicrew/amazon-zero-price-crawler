'use strict';

jQuery(function( $ ) {
    var $content= $('.content');
    var $body= $('body');
    var $document= $(document);

    var amazonResult= window.amazonResult;

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
    ;

    for ( var asin in amazonResult ) {
        var prod= amazonResult[asin];
        var $div= $('<div class="prod"/>');
        var $a= $('<a href="' + prod.url + '" asin="' + asin + '" target="_blank"/>');
        $div.append($a);
        $a.append('<img src="' + prod.image + '">');
        $a.append(prod.title);

        $content.append($div)
    }
});
