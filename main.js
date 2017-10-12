'use strict';

jQuery(function( $ ) {
    var $content= $('.content');
    var $body= $('body');
    var $document= $(document);

    var amazonResult= window.amazonResult;

    var undoHistory= [];

    var updateSeen= function( seenAsins ) {
        $('.prod', $content).removeClass('seen');
        seenAsins.forEach(function( asin ) {
            if ( asin in amazonResult ) $('.prod[asin="' + asin + '"]', $content).addClass('seen');
        })
    };

    var update= function( asin, del ) {
        var url= 'seenList.php';
        if ( asin ) {
            url+= '?' + (del ? 'del' : 'add') + '=' + asin;

            // filter asin from undoHistory
            undoHistory= undoHistory.filter(function( a ) { return a != asin; });

            // add asin for undo on add
            if ( asin && !del ) undoHistory.push(asin);
        }

        $.getJSON(url, function( result ) {
            if ( $.isArray(result) ) {
                updateSeen(result);
            }
            updateImages();
            updateCounter();
        });
    };

    var updateCounter= function() {
        var sum= $('.prod', $content).length;
        var seen= $('.prod.seen', $content).length;
        $('.counter.all').html(sum);
        $('.counter.seen').html(seen);
        $('.counter.unseen').html(sum -seen);
        $('button.undo').prop('disabled', !undoHistory.length);
    };

    var updateImages= function() {
        var $imgs= $();
        if ( $body.hasClass('show-new') ) {
            $imgs= $imgs.add($('.prod:not(.seen) img:not([src])', $content));
        }
        if ( $body.hasClass('show-old') ) {
            $imgs= $imgs.add($('.prod.seen img:not([src])', $content));
        }
        $imgs.each(function() {
            var $img= $(this);
            $img.attr('src', $img.data('src'));
        });
    };

    $document
        .on('click', 'button.all', function() {
            $body.addClass('show-new').addClass('show-old');
            updateImages();
        })
        .on('click', 'button.new', function() {
            $body.addClass('show-new').removeClass('show-old');
            updateImages();
        })
        .on('click', 'button.old', function() {
            $body.removeClass('show-new').addClass('show-old');
            updateImages();
        })
        .on('click', 'button.undo', function() {
            update(undoHistory.pop(), true);
        })
        .on('click', '.prod a', function( ev ) {
            var $this= $(this);
            var $prod= $this.closest('.prod');
            var seen= $prod.hasClass('seen');
            var asin= $prod.attr('asin');
            update(asin, seen);
        })
    ;

    for ( var asin in amazonResult ) {
        var prod= amazonResult[asin];
        var $div= $('<div class="prod"/>');
        $div.attr('asin', asin).attr('title', prod.title).addClass('seen');
        var $a= $('<a href="' + prod.url + '" target="_blank"/>');
        $div.append($a);
        var $img= $('<img/>');
        $img.data('src', prod.image);
        $a.append($img);
        $a.append(prod.title);

        $content.append($div)
    }

    updateImages();
    update();
});
