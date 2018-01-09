(function ($, window, undefined) {
    'use strict';

    var
        OreoreSlider,
        pluginName = 'oreoreSlider',
        defaults = {
            'elem': {
                'target': 'ul',
                'item': 'li'
            },
            "imgPreLoad": true,
            'duration': 500,
            'easing': 'swing',
            'action': 'fade',
            'thumbnails': false, // 鏈疅瑁�
            'autoPlay': true,
            'interval': 5000,
            'extension': {
                'numNav': true,
                'arrow': true
            },
            'isHorizontal': true,
            'loop': false,
            'active': 0,
            'numNavClick': true,
            'initCallback': function() {}
        };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new OreoreSlider(this, options));
            }
        });
    };

    OreoreSlider = function(node, options) {
        this.$self = $(node);
        this.options = $.extend(false, defaults, options);
        this.$target = this.$self.find(this.options.elem.target);
        this.$list = this.$self.find(this.options.elem.item);
        this.num = this.$list.length;
        this.activePosition = this.options.active;
        this.boxSize = this.options.isHorizontal ? this.$target.outerWidth(true) : this.$target.outerHeight(true);
        this.parentWidth = this.boxSize * this.num;
        this.$nav = undefined;
        this.$prev = undefined;
        this.$next = undefined;
        this.timer = undefined;
        this.action = new this.Action();
        this.extension = new this.Extension();
        this.isInit = false;
        this.init();
    };

    OreoreSlider.prototype = {

        init: function() {
            var self = this;
            // fade/slide銇ч仼鐢ㄣ仚銈婥SS銈掑銇堛倠
            this.$self.addClass(self.options.action);

            // 鍚勫嫊浣溿伄鍒濇湡瑷畾
            if (this.action[this.options.action].init) {
                this.action[this.options.action].init.call(this);
            }

            this.$list.css('opacity', 0);

            // 鐢诲儚銇儣銉儹銉笺儔銇偑銉炽偑銉�
            if (this.options.imgPreLoad) {
                this.imgLoader();
            } else {
                this.options.initCallback();
                this.initAction();
            }

            //銆€鑷嫊鍐嶇敓銇ō瀹�
            //if (this.options.autoPlay) {
            //  this.$self.on({
            //    mouseenter: function() {
            //      clearTimeout(self.timer);
            //      self.activePosition -= 1;
            //    },
            //    mouseleave: function() {
            //      self.autoPlay();
            //    }
            //  });
            //}

        },

        initAction: function() {
            this.$list.eq(this.options.active).show().css('opacity', 1);

            if (this.options.extension.numNav) {
                this.extension.numNav.init.call(this);
            }

            if (this.options.extension.arrow) {
                this.extension.arrow.init.call(this);
            }

            if (this.options.autoPlay) {
                this.autoPlay();
            }
        },

        imgLoader: function() {
            var
                self = this,
                $imgObj = this.$list.find('img'),
                num = $imgObj.length,
                imgList = [];

            for(var i=-1;++i<num;) {
                imgList[i] = new Image();
                imgList[i].src = $imgObj.eq(i).attr('src');
            }

            (function update() {
                var comp = 0;
                for(var i=-1;++i<num;) {
                    if (imgList[i].complete) {
                        comp += 1;
                    }
                }
                if (comp === num) {
                    // 銉兗銉夊畬浜嗘檪銇疅琛屻仚銈嬮枹鏁�
                    self.options.initCallback();
                    self.initAction();
                    return false;
                } else if (comp < num) {
                    setTimeout(update, 100);
                }
            }());
        },

        autoPlay: function(){
            var self = this;
            this.activePosition = (this.activePosition < this.num) ? this.activePosition : 0;
            this.operation();
            this.activePosition = this.activePosition + 1;
            this.timer = setTimeout(function(){self.autoPlay()}, this.options.interval);
        },

        // 鐘舵厠銇屽鍖栥仐銇熼殯銇嫊浣�
        operation: function() {
            if (this.action[this.options.action].action) {
                this.action[this.options.action].action.call(this);
            }
            if (this.options.extension.numNav) {
                this.extension.numNav.operation.call(this);
            }
            if (this.options.extension.arrow) {
                this.extension.arrow.operation.call(this);
            }
        },

        Extension: function() {},
        Action: function() {}

    };

    OreoreSlider.prototype.Extension.prototype = {
        numNav: {
            init: function() {
                var n = this.num + 1,
                    content = '',
                    self = this;
                for(var i=0;++i<n;) {
                    content += '<li>'+ i +'</li>';
                }
                this.$self.append('<div class="num-nav"><ol>'+ content +'</ol></div>');

                this.$nav = this.$self.find('.num-nav').find('li');

                if (!self.options.numNavClick) {
                    this.$nav.css({
                        'cursor': 'default'
                    })
                }

                if (this.options.action === 'overlap') {
                    this.$nav.eq(this.options.active).addClass('active');
                } else {
                    this.$nav.on({
                        mouseenter: function() {
                            $(this).addClass('hover');
                        },
                        mouseleave: function() {
                            $(this).removeClass('hover');
                        },
                        click: function(e) {
                            e.preventDefault();
                            if (self.options.numNavClick) {
                                var index = $(this).index();
                                if (index !== self.activePosition) {
                                    self.activePosition = index;
                                    self.operation(index);
                                }
                            }
                        }
                    }).eq(this.options.active).addClass('active');
                }
            },
            operation: function() {
                for(var i=-1;++i<this.num;) {
                    if (this.activePosition !== i) {
                        this.$nav.eq(i).removeClass('active');
                    } else {
                        this.$nav.eq(i).addClass('active');
                    }
                }
            }
        },
        arrow: {
            init: function() {
                var $arrow, self = this;

                this.$self.append('<ul class="arrow"><li class="prev">&lt;</li><li class="next">&gt;</li></ul>');
                $arrow = this.$self.find('.arrow');
                this.$prev = $arrow.find('.prev');
                this.$next = $arrow.find('.next');

                if (!this.options.loop) {
                    switch (this.activePosition) {
                        case 0:
                            this.$prev.hide();
                            break;
                        case this.num-1:
                            this.$next.hide();
                            break;
                        default:
                            break;
                    }
                }

                $arrow.find('li').on({
                    click: function(e){
                        e.preventDefault();
                        self.state = !!$(this).index();
                        if (!self.options.loop) {
                            self.activePosition = self.state ? self.activePosition + 1 : self.activePosition - 1;
                        } else {
                            self.activePosition =
                                self.state ?
                                    (self.activePosition !== self.num - 1) ? self.activePosition + 1 : 0 :
                                    (self.activePosition !== 0) ? self.activePosition - 1 : self.num - 1 ;
                        }
                        self.operation(self.activePosition);
                    }
                })
            },
            operation: function() {
                if(!this.options.loop) {
                    switch (this.activePosition) {
                        case 0:
                            this.$prev.hide();
                            this.$next.show();
                            break;
                        case this.num - 1:
                            this.$prev.show();
                            this.$next.hide();
                            break;
                        default:
                            this.$prev.show();
                            this.$next.show();
                            break;
                    }
                }
            }
        }
    };

    OreoreSlider.prototype.Action.prototype = {
        fade: {
            init: function() {
                this.$list.eq(this.activePosition).css({
                    'opacity': 1
                })
            },
            action: function() {
                var self = this;
                for(var i = - 1; ++i < this.num;) {
                    if (this.activePosition !== i) {
                        this.$list.eq(i).stop().animate({
                            'opacity': 0
                        }, self.options.duration, self.options.easing);
                    } else {
                        this.$list.eq(i).stop().animate({
                            'opacity': 1
                        }, self.options.duration, self.options.easing);
                    }
                }
            }
        },
        slide: {
            init: function() {
                this.$target.css({
                    'width': this.parentWidth+'px',
                    'margin-left': -this.boxSize * this.options.active
                });
            },
            action: function() {
                var pos = this.boxSize * this.activePosition;
                this.$target.stop().animate({
                    'margin-left': -pos
                }, this.options.duration, this.options.easing);
            }
        },
        overlap: {
            init: function() {
                this.options.autoPlay = false;
                this.options.loop = false;
                var
                    count = this.num,
                    z = 0;
                while(count--) {
                    this.$list.eq(count).css({
                        'z-index': z += 1
                    });
                }
                this.$list.css({
                    'left': 0
                });
            },
            action:  function() {
                var
                    self = this,
                    animateFunc = (this.state || this.options.autoPlay) ? 'animate' : 'css',
                    cssFunc = !this.state ? 'animate' : 'css';
                for (var i=-1;++i<this.num;) {
                    switch (i) {
                        case this.activePosition - 1:
                            this.$list.eq(i).stop()[animateFunc]({
                                'left': -self.boxSize
                            }, this.options.duration, this.options.easing);
                            break;
                        case this.activePosition:
                            this.$list.eq(i)[cssFunc]({
                                'left': 0
                            }, this.options.duration, this.options.easing);
                            break;
                    }
                }
            }
        }
    };

}(jQuery, window));