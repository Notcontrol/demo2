(function($, window, undefined) {

    $(function(){
        var $parent = $('#kv-slide'),
            $target = $parent.find('.slide-wrapper'),
            $imgs = $parent.find('img'),
            num = $target.length,
            parallaxSpeed = 1.15;

        (function beforeInit() {
            $parent.css({
                'height': $.wh
            });
            $target.css({
                'visibility': 'hidden',
                'opacity': 0
            })
        }());

        var parallaxValue = {
            'ww': 0,  // window width
            'wh': 0,  // window height
            'bt': 0, // borderLine top
            'bb': 0, // borderLine bottom
            'ot': 0  // offset top
        };

        var defaultImageSize = {
            'width': 0,
            'height': 0
        };

        var parentSize = {
            'width': 0,
            'height': 0
        };

        var targetHeight, current;

        //imageLoader([
        //  'assets/img/pc/bg_kv.jpg',
        //  'assets/img/pc/kv02.jpg',
        //  'assets/img/pc/kv03.jpg',
        //  'assets/img/pc/kv04.jpg'
        //], init);


        function init() {
            $target.css({
                'visibility': 'visible',
                'opacity': 1
            });
            getDefaultImageSize();
            $(window).on('resize.kv', resizeHandler).trigger('resize.kv');
            //if (Modernizr.csstransforms3d && !$.isUA.ios) {
            //  $(window).on('scroll.kv', scrollHandler).trigger('scroll.kv');
            //}
            //if ($.isUA.ios) {
            //  $target.css({
            //    'position': 'fixed'
            //  })
            //}

            $('#kv-slide').oreoreSlider({
                "imgPreLoad": false,
                'duration': 1800,
                'easing': 'easeInCubic',
                'interval': 7000,
                'extension': {
                    'numNav': true,
                    'arrow': false
                },
                'numNavClick': false,
                initCallback: function() {
                    //$('.header-inner, #site-header .update').delay(2400).animate({
                    //  'opacity': 1
                    //}, 1000, 'swing');
                }
            });

        }

        $.kvInit = init;

        function resizeHandler() {
            $parent.css('height', $.wh);
            getParentSize();
            //makeParallaxValue();
            fitImage();
        }

        function scrollHandler() {
            parallaxEffect();
        }

        function getDefaultImageSize() {
            defaultImageSize.width = $imgs.width();
            defaultImageSize.height = $imgs.height();
        }

        function getParentSize() {
            var $_parent = $('#kv-slide');
            parentSize.width = $_parent.outerWidth();
            parentSize.height = $_parent.outerHeight();
        }

        function fitImage() {
            var delta, deltaW, deltaH, newWidth, newHeight, adjustSize;
            for (var i = -1; ++i < num;) {

                deltaW = defaultImageSize.width / parentSize.width;
                deltaH = defaultImageSize.height / parentSize.height;

                if (deltaW < deltaH) {
                    newWidth = parentSize.width;
                    adjustSize = newWidth / defaultImageSize.width;
                    newHeight = Math.round(adjustSize * defaultImageSize.height);
                    $imgs.css({
                        'width': newWidth,
                        'height': newHeight,
                        'margin-top': -(newHeight - $.wh) / 2,
                        'margin-left': 0
                    });
                } else {
                    newHeight = parentSize.height;
                    adjustSize = newHeight / defaultImageSize.height;
                    newWidth = Math.round(adjustSize * defaultImageSize.width);
                    $imgs.css({
                        'width': newWidth,
                        'height': newHeight,
                        'margin-top': 0,
                        'margin-left': -(newWidth - $.ww) / 2
                    });
                }
            }
        }

        function makeParallaxValue() {
            parallaxValue.bt = parallaxValue.ot - $.wh;
            parallaxValue.bb = parallaxValue.ot + $parent.height();
        }

        function parallaxEffect() {
            var move;
            if (parallaxValue.bt < $.st && $.st < parallaxValue.bb) {
                move = parseInt(($.st - parallaxValue.ot) / parallaxSpeed, 10);
                $target.css({
                    'transform': 'translate3d(0, ' + move + 'px, 0)'
                });
            }
        }
    });
}(jQuery, window));