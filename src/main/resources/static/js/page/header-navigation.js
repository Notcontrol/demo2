(function($, window, undefined) {
    $(function() {
        var $nav = $('#header-nav'),
            $gnav = $('#gnav'),
            $li = $gnav.find('li'),
            $target = $('.navigation-target'),
            targetHeight = 85,
            num = $target.length,
            offsetsTop = [],
            state = '',
            narrowState = false,
            isFixed = false,
            current = 0,
            _current = -1;

        var memberHeight = $('#member-area').outerHeight(),
            footerHeight = $('#site-footer').outerHeight();

        function init() {

            $(window).on('resize.spy', function() {
                getOffsetTop();
                //if ($.ww <= 1100 && !narrowState) {
                //  $li.stop().animate({
                //    'margin-right': 15,
                //    'margin-left': 15
                //  }, 200, 'swing');
                //  narrowState = true;
                //} else if ($.ww > 1100 && narrowState) {
                //  $li.stop().animate({
                //    'margin-right': 19,
                //    'margin-left': 19
                //  }, 200, 'swing');
                //  narrowState = false;
                //}
                $(window).trigger('scroll.spy');
            }).trigger('resize.spy');


            $(window).on('scroll.spy', function() {

                if ($.ww >= $.border) {
                    var bl =  $.wh > 800 ? $.wh : 800;
                    if (bl <= $.st && state !== 'fixed') {
                        $nav.css('height', 0);
                        isFixed = true;
                        $nav.addClass('scrolled').stop().animate({
                            'height': 85
                        }, 300, 'swing', function() {
                            $nav.find('.logo').delay(400).stop().animate({
                                'opacity': 1
                            }, 400, 'swing')
                        });
                        state = 'fixed';
                    } else if (bl > $.st && state === 'fixed') {
                        $nav.stop().animate({
                            'height': 0
                        }, 300, 'swing', function() {
                            isFixed = false;
                            $nav.removeClass('scrolled').css('height', 72);
                            $nav.find('.logo').css('opacity', 0);
                        });
                        state = '';
                    }

                    if (isFixed) {
                        var br = 1000 - $(window).width(),
                            sl = $(window).scrollLeft();
                        if (sl >= 0 && sl <= br) {
                            $nav.css({
                                'left': -sl
                            })
                        }
                    } else {
                        $nav.css({
                            'left': 0
                        })
                    }

                    if (offsetsTop[num-2] + memberHeight / 2 < $.st && offsetsTop[num-1] - $.wh + memberHeight <= $.st) {
                        for (var i = -1; ++i < num;) {
                            var c = num - 1,
                                $img = $li.eq(i).find('img'),
                                src = $img.attr('src');
                            if (i === c) {
                                $li.eq(i).addClass('current');
                                if (!src.match(/_on./)) {
                                    $img.attr('src', src.replace(/\.(png|jpg|gif)$/, '_on.' + '\$1'));
                                }
                            } else {
                                $li.eq(i).removeClass('current');
                                $img.attr('src', src.replace(/_on\.(png|jpg|gif)$/, '.\$1'));
                            }
                        }
                        _current = c;
                    } else {
                        for (var j = -1; ++j < num;) {
                            if (offsetsTop[j] <= $.st) {
                                current = j;
                            }
                        }
                        for (var i = -1; ++i < num;) {
                            if (_current !== current) {
                                var $img = $li.eq(i).find('img'),
                                    src = $img.attr('src');
                                if (current === i) {
                                    $li.eq(i).addClass('current');
                                    if (!src.match(/_on./)) {
                                        $img.attr('src', src.replace(/\.(png|jpg|gif)$/, '_on.' + '\$1'));
                                    }
                                } else {
                                    $li.eq(i).removeClass('current');
                                    $img.attr('src', src.replace(/_on\.(png|jpg|gif)$/, '.\$1'));
                                }
                            }
                        }
                        _current = current;
                    }

                } else {

                    $.state = '';

                    $nav.attr('style', '').css('opacity', '1');
                    if ($.wh < $.st && $.state !== 'fixed') {
                        $nav.find('.logo').stop().animate({
                            'opacity': 1
                        }, 200, 'swing');
                        $nav.stop().animate({
                            'opacity': 1
                        }, 200, 'swing');
                        $nav.addClass('scrolled');
                        $.state  = 'fixed';
                    } else if ($.wh >= $.st && $.state !== 'absolute') {
                        $nav.find('.logo').stop().animate({
                            'opacity': 0
                        }, 200, 'swing');
                        $nav.removeClass('scrolled');
                        $.state = 'absolute';
                    }

                }

            }).trigger('scroll.spy');

            $nav.css('opacity', 1);


            var clickState = '';

            if ($.ww >= $.border && clickState !== 'pc') {
                $gnav.find('a').off('click.spNav');
                clickState = 'pc';
            } else if ($.ww < $.border && clickState !== 'sp') {
                $gnav.find('a').on('click.spNav', function(e) {
                    var $wrapper = $('.header-navigation');
                    if (!$wrapper.hasClass('open')) {
                        $wrapper.addClass('open');
                    } else {
                        $wrapper.removeClass('open');
                        $('#gnav-overlay').remove();
                    }
                    clickState = 'sp';
                });
            }

        }

        //init();

        $.headerNavInit = init;

        function getOffsetTop() {
            for (var i = -1; ++i < num;) {
                offsetsTop[i] = $target.eq(i).offset().top - 50;
            }
        }
    })
}(jQuery, window));