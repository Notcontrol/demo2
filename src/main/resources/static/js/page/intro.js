(function($, window) {

    var manifest = $('body').attr('id') !== 'lang-en' ? [
        'img/pc/bg_kv.jpg',
        'img/pc/kv02.jpg',
        '/edosakaba/assets/img/pc/kv03.jpg',
        '/edosakaba/assets/img/pc/kv04.jpg',
        '/edosakaba/assets/img/pc/kv05.jpg',
        '/edosakaba/assets/img/pc/kv06.jpg',
        '/edosakaba/assets/img/pc/kv-typography.png',
        '/edosakaba/assets/img/pc/bg_kv.jpg',
        '/edosakaba/assets/img/pc/site-name-typography.png',
        '/edosakaba/assets/img/pc/clone.png'
    ] : [
        '/edosakaba/assets/img/pc/bg_kv.jpg',
        '/edosakaba/assets/img/pc/kv02.jpg',
        '/edosakaba/assets/img/pc/kv03.jpg',
        '/edosakaba/assets/img/pc/kv04.jpg',
        '/edosakaba/assets/img/pc/kv05.jpg',
        '/edosakaba/assets/img/pc/kv06.jpg',
        '/edosakaba/assets/img/pc/kv-typography-en.png',
        '/edosakaba/assets/img/pc/bg_kv.jpg',
        '/edosakaba/assets/img/pc/site-name-typography.png',
        '/edosakaba/assets/img/pc/clone-en.png'
    ];

    var loading = function(images, callback, callback2, isIntro) {
        var isIE = window.navigator.userAgent.toLowerCase().indexOf('msie') != -1,
            n = images.length,
            repeat = 0,
            imgArray = [],
            cache = (new Date()).getTime();
        for (var i = -1; ++i < n;) {
            imgArray[i] = new Image();
            imgArray[i].src = images[i];
        }
        (function update() {
            var comp = 0, per = 0;
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
            if (repeat === 0 && comp === n) {
                callback2();
                return false;
            }
            if (comp === n) {
                if (callback) {
                    callback();
                }
                return false;
            } else if (comp < n) {
                setTimeout(update, 50);
                repeat = repeat + 1;
            }
        }());
    };


    $(function() {
        if ($.ww > $.border) {
            var $header = $('#kv'),
                $inner = $('#site-header-inner'),
                $opacityDOM = $inner.find('.header-inner, .update'),
                $clone = $('#clone-kv'),
                $sub = $('.clone-text'),
                $main = $('.site-name');

            //$('html').css({
            //  'overflow': 'hidden'
            //});
            $header.css({
                'width': 0
            });
            $sub.css({
                'opacity': 0
            });
            $main.css({
                'opacity': 0
            });


            function introCallback() {
                //window.scrollTo(0, 0);
                //$('html').css({
                //  'overflow': 'visible'
                //});
                $(window).trigger('resize');
                typoAnimation();
                $main.css({
                    "-webkit-filter": "grayscale(100%)",
                    "filter": "grayscale(100%)"
                });
            }

            function typoAnimation() {
                $({alpha: 0}).animate({alpha: 1}, {
                    duration: 1800,
                    easing: 'easeInCubic',
                    step: function() {
                        $main.css({
                            opacity: this.alpha
                        });
                    },
                    done: function() {
                        $({gray: 100}).delay(400).animate({gray: 0}, {
                            duration: 1800,
                            easing: 'easeInCubic',
                            step: function() {
                                $main.css({
                                    "-webkit-filter": "grayscale("+this.gray+"%)",
                                    "filter": "grayscale("+this.gray+"%)"
                                });
                            }
                        });
                        $sub.delay(400).animate({
                            'opacity': 1
                        }, 1800, 'easeInCubic');
                        setTimeout(function() {
                            $('.header-inner').css({
                                'position': 'absolute',
                                'top':0,
                                'left': 0,
                                'width': $.ww
                            });
                            if ($('#snow').length) {
                                $('#snow').snowfall({
                                    flakeCount : 30,
                                    minSize : 20,
                                    maxSize : 50,
                                    minSpeed : 1,
                                    maxSpeed : 6,
                                    image   : '/edosakaba/assets/img/img_momiji2.png'
                                });
                                $('#snow2').snowfall({
                                    flakeCount : 30,
                                    minSize : 30,
                                    maxSize : 60,
                                    minSpeed : 6,
                                    maxSpeed : 10,
                                    image   : '/edosakaba/assets/img/img_momiji.png'
                                });
                            }
                            $.kvInit();
                            coverAnimation();
                        }, 2400);
                    }
                });
            }

            function coverAnimation() {
                var d = 1600,
                    e = 'easeInOutExpo';
                $opacityDOM.css('opacity', 1);
                $header.delay(1000).animate({
                    'width': '100%'
                }, d, e, function() {
                    $(this).css({
                        'position': 'static',
                        'overflow': 'visible',
                        'min-width': 1000,
                        'min-height': 880,
                        'z-index': 3
                    });
                    $inner.css({
                        'position': 'relative',
                        'width': 'auto',
                        'height': 'auto'
                    });
                    $clone.remove();
                    $('#kv, .header-inner').attr('style', '');
                    $(window).trigger('resize');
                    $.headerNavInit();
                });
            }

            function skipCallBack() {
                $('html').css({
                    'overflow': 'visible'
                });
                $main.css({
                    'opacity': 0,
                    "-webkit-filter": "grayscale(100%)",
                    "filter": "grayscale(100%)"
                });
                typoAnimation();
                $(window).trigger('resize');
            }

            loading(manifest, introCallback, skipCallBack);

        } else {
            $.headerNavInit();
        }
    });


}(jQuery, window));