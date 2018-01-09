(function($, window, undefined) {

    $(window).on('resize', function() {
        $.ww = $(window).width();
        $.wh = window.innerHeight ? window.innerHeight : $(window).height();
    }).trigger('resize');
    $(window).on('scroll', function() {
        $.sc = $(window).scrollTop();
    }).trigger('scroll');
    $.sl = $(window).scrollLeft();

    $.isUA = (function(){
        var r = {
                ios: false,
                attention: false
            },
            ua = navigator.userAgent;
        var iPhone = (ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') == -1),
            iPad = ua.indexOf('iPad') > 0,
            iPod =ua.indexOf('iPod') > 0,
            android = ua.indexOf('Android') > 0;

        if (iPhone || iPad || iPod) {
            r.ios = true;
        }
        if (iPhone || iPod || android) {
            r.attention = true
        }

        return r;
    }());

    $(function() {
        initializer();
        smoothScroll();
        snsPopup();
        rollover();
        opacityRollover();
    });

    // initialize
    function initializer() {
        $('#header-nav').css('opacity', 0);
    }

    // popup
    function snsPopup() {
        $('.share').find('a').on('click', function(e) {
            var that = this;
            e.preventDefault();
            popup(e, that);
        });
        function popup(e, that) {
            window.open(that.href, '', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
        }
    }

    //smooth scroll
    function smoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            var duration = 700,
                easing = 'easeOutQuart',
                href = $(this).attr("href"),
                targetPos = $(href === "#" || href === "" ? 'html' : href).offset(),
                position = (function() {
                    var bh = $('body').height(),
                        pos = bh <= targetPos.top + $.wh ? bh - $.wh : targetPos.top;
                    //console.log(targetPos.top, pos);
                    return href.length ? (targetPos) ? targetPos.top : 0 : 0;
                }());
            if (targetPos) {
                $(window).trigger('resize.spy');
                $('html, body').stop().animate({scrollTop: position}, duration, easing);
            }
        });
    }

    // image loader
    window.imageLoader = function(images, callback) {
        var isIE = window.navigator.userAgent.toLowerCase().indexOf('msie') != -1,
            n = images.length,
            imgArray = [],
            cache = (new Date()).getTime();
        for (var i = -1; ++i < n;) {
            imgArray[i] = new Image();
            imgArray[i].src = images[i];
        }

        (function update() {
            var comp = 0;
            for(var i = -1; ++i < n;) {
                if (isIE) {
                    if (imgArray[i].readyState === 'complete' || imgArray[i].readyState === 'loaded') {
                        comp += 1;
                    }
                } else {
                    if (imgArray[i].complete) {
                        comp += 1;
                    }
                }
            }
            if (comp === n) {
                if (callback) {
                    callback();
                }
                return false;
            } else if (comp < n) {
                setTimeout(update, 50);
            }
        }());
    };

    // rollover
    function rollover() {
        var $target = $('.ro').find('a'),
            images = [],
            imgArray = [];

        $target.find('img').each(function(elem, i) {
            var src = this.src;
            if (!src.match(/_on./)) {
                images[i] = src.replace(/\.(png|jpg|gif)$/, '_on.' + '\$1');
                imgArray[i] = new Image();
                imgArray[i].src = images[i];
            }
        });

        $target.on({
            'mouseenter': function() {
                var $img = $(this).find('img'),
                    src = $img.attr('src');
                if (!src.match(/_on./) && $.ww >= $.border) {
                    $img.attr('src', src.replace(/\.(png|jpg|gif)$/, '_on.' + '\$1'));
                }
            },
            'mouseleave': function() {
                var $img = $(this).find('img'),
                    src = $img.attr('src');
                if (!$img.parent().parent().hasClass('current') && $.ww >= $.border) {
                    $img.attr('src', src.replace(/_on\.(png|jpg|gif)$/, '.\$1'));
                }
            }
        });
    }

    // opacity rollover
    function opacityRollover() {
        var $target = $('.oro').find('a'),
            duration = 250, easing = 'swing';
        $target.on({
            'mouseenter': function() {
                var $img = $(this).find('img');
                if ($.ww >= $.border) {
                    $img.eq(0).stop().animate({
                        'opacity': 0
                    }, duration, easing);
                    $img.eq(1).stop().animate({
                        'opacity': 1
                    }, duration, easing);
                }
            },
            'mouseleave': function() {
                var $img = $(this).find('img');
                if ($.ww >= $.border) {
                    $img.eq(0).stop().animate({
                        'opacity': 1
                    }, duration, easing);
                    $img.eq(1).stop().animate({
                        'opacity': 0
                    }, duration, easing);
                }
            }
        });
    }
}(jQuery, window));