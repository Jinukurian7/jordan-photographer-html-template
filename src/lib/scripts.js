(function ($) {
    'use strict';

    var JORDAN = {
        init: function () {
            this.onLoad();
            this.winLoad();
            this.scrollListner();
            this.togglers();
            this.loadAnim();
            this.lazyLoad();
            this.detectAnimation();
            this.featuredSlider();
            this.mouseCursor();
            this.textAnim();
            this.changeBg();
            this.footerParallax();
            this.mouseCursor();
        },
        settings: {
            desktop: 1200,
            tab: 1024,
            mobile: 768,
            scrollTimerId: 1,
            windowWidth: $(window).width(),
            windowheight: $(window).height(),
            scrollClassTrigger: $(window).height(),
            scrollBarWidth: 0
        },

        onLoad: function () {
            $(document).ready(function () {
                $('body').addClass('page-loaded');
            });
        },

        winLoad: function () {
            $(window).on('load', function () {
                $('body').addClass('contents-loaded');
            });
        },

        resizeListner: function () {
            $(window).on('load resize', function () {
                JORDAN.settings.windowWidth = $(window).width();
            });
        },

        // ScrollListner
        scrollListner: function () {
            $(window).scroll(function () {
                if ($(window).scrollTop() > $('.banner').height()) {
                    $('.site__header').addClass('active');
                } else {
                    $('.site__header').removeClass('active');
                }
               
                if (JORDAN.settings.scrollTimerId)
                    $('body').removeClass('scrolled').addClass('scrolling');
                    clearTimeout(JORDAN.settings.scrollTimerId);
                JORDAN.settings.scrollTimerId = setTimeout(function () {
                    $('body').removeClass('scrolling').addClass('scrolled');
                    clearTimeout(JORDAN.settings.scrollTimerId);
                }, 300);
            });

            $(window).on('mousewheel DOMMouseScroll', function (event) {
                var wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                if (wd < 0) {
                    $('body').removeClass('scrollingUp').addClass('scrollingDown');
                    $('.site__header').removeClass('fixed');
                } else {
                    $('body').removeClass('scrollingDown').addClass('scrollingUp');
                    $('.site__header').addClass('fixed');
                }
            });
        },

        // Only mobile
        onlyMobile: function () {
            if (JORDAN.settings.windowWidth < JORDAN.settings.mobile) {

            }
        },

        // Tabs and largescreens
        onlyTabDesktop: function () {
            if (JORDAN.settings.windowWidth > JORDAN.settings.tab) {

            }
        },

        // Only largescreens
        onlyDesktop: function () {
            if (JORDAN.settings.windowWidth > JORDAN.settings.desktop) {
                this.scrollBarWidth();
            }
        },

        // Scrollbarwidth
        scrollBarWidth: function () {
            this.settings.scrollBarWidth = window.innerWidth - document.getElementsByTagName('body')[0].clientWidth;
        },

        togglers: function () {
            var s, triggerObjects = {
                settings: {},
                init: function () {
                    s = this.settings;
                },
            };

            triggerObjects.init();
        },

        loadAnim: function() {
            $('.o-title').html(function(index, html) {
                return html.replace(/\S/g, '<span>$&</span>');
            });

            var tl = new TimelineMax();
            tl.to($('#mask'), 0.75, {
                y: '-100%',
                delay: 0.75,
                ease: Back.easeOut.config(1.7)
            })
            .fromTo($('.banner figure'), 1, {
                scale: 1.15,
                rotation:0.01,
                ease: Power1.ease0ut
            },
            {
                scale: 1
            }, '-=0.75')
            .staggerFrom($('.navbar-nav'), 0.75, { 
                autoAlpha: 0, 
                y: -50, 
                ease: Power1.ease0ut,
            }, 0.25, '-=0.5' )
            .from($('.navbar-brand'), 0.75, { 
                scale: 1.1, 
                autoAlpha: 0 
            }, '-=0.25')
            .staggerFromTo($('.banner .title > span'), 0.5, { y: 300, ease: Power2.ease0ut }, { y: 0, }, 0.075, '-=0.75')
            .from('.banner .u-text', 0.5, { autoAlpha: 0 })
        },

        // Lazy load images 
        lazyLoad: function () {
            var $imgElem = $('img[data-src]');
            var $srcsetElem = $('[data-srcset]');
            var $desktopImgElem = $('img[data-desktop-src]');
            var $backgroundElem = $('[data-background]');

            function processImage(figure) {
                var src = $(figure).data('src');
                var srcset = $(figure).data('srcset');
                var desktopsrc = $(figure).data('desktop-src');
                var backgroundImg = $(figure).data('background');
                if (src) {
                    var img = $('<img />').attr('src', src)
                        .on('load', function () {
                            $(figure).attr({
                                'src': src
                            });
                            $(figure).addClass('loaded');
                            $(figure).data('src', '');
                        });
                } else if (desktopsrc) {
                    if (Modernizr.mq('only all and (min-width: 640px)')) {
                        var imgDesktop = $('<img />').attr('src', desktopsrc)
                            .on('load', function () {
                                $(figure).attr({
                                    'src': desktopsrc
                                });
                                $(figure).addClass('loaded');
                                $(figure).data('src', '');
                            });
                    }
                } else if (backgroundImg) {
                    $(figure).css('background-image', 'url(' + backgroundImg + ')');
                    $(figure).addClass('loaded');
                    $(figure).attr('data-background', '');
                }
            }
            var controller = new ScrollMagic.Controller();
            $imgElem.each(function () {
                var elem = this;
                new ScrollMagic.Scene({
                        triggerElement: elem,
                        triggerHook: 'onEnter',
                        reverse: false
                    })
                    .on('enter', function () {
                        if ($(this.triggerElement()).data('src')) {
                            processImage(this.triggerElement());
                        }
                    })
                    .addTo(controller);
            });

            $srcsetElem.each(function () {
                var elem = this;
                new ScrollMagic.Scene({
                        triggerElement: elem,
                        triggerHook: 'onEnter',
                        reverse: false
                    })
                    .on('enter', function () {
                        if ($(this.triggerElement()).data('srcset')) {
                            // processImage(this.triggerElement());
                            var srcset = $(this.triggerElement()).data('srcset');
                            $(this.triggerElement()).attr({
                                'srcset': srcset
                            });
                        }
                    })
                    .addTo(controller);
            });

            $desktopImgElem.each(function () {
                var elem = this;
                new ScrollMagic.Scene({
                        triggerElement: elem,
                        triggerHook: 'onEnter',
                        reverse: false
                    })
                    .on('enter', function () {
                        if ($(this.triggerElement()).data('desktop-src')) {
                            processImage(this.triggerElement());
                        }
                    })
                    .addTo(controller);
            });

            $backgroundElem.each(function () {
                var elem = this;
                new ScrollMagic.Scene({
                        triggerElement: elem,
                        triggerHook: 'onEnter',
                        reverse: false
                    })
                    .on('enter', function () {
                        if ($(this.triggerElement()).data('background')) {
                            processImage(this.triggerElement());
                        }
                    })
                    .addTo(controller);
            });
        },

        detectAnimation: function () {
            if (Modernizr.mq('only all and (min-width: 640px)')) {
                var controller = new ScrollMagic.Controller();
                var elem = $('.detect-animate');
                elem.each(function () {
                    var elem = this;
                    var triggerElem = $(elem).data('top') ? $(elem).data('top') : elem;
                    var elementAnimation = $(elem).data('animation');
                    var delay = $(elem).data('delay') ? $(elem).data('delay') : 0;
                    var speed = $(elem).data('speed') ? $(elem).data('speed') : 1;
                    var hook = $(elem).data('hook') ? $(elem).data('hook') : 'onEnter';
                    var offset = $(elem).data('offset') ? $(elem).data('offset') : 0;
                    var reverse = $(elem).data('reverse') ? true : false;
                    var tween = '';
                    var duration = $(elem).data('duration') ? $(elem).data('duration') : 0;
                    TweenLite.set($(elem), {
                        autoAlpha: 1
                    });
                    switch (elementAnimation) {
                        case "from-bottom":
                            tween = TweenMax.from(elem, speed, {
                                y: '100px',
                                opacity: 0,
                                ease: Ease.ease,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "from-left":
                            tween = TweenMax.from(elem, speed, {
                                x: '-100px',
                                opacity: 0,
                                ease: Ease.ease,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "from-right":
                            tween = TweenMax.from(elem, speed, {
                                x: '100px',
                                opacity: 0,
                                ease: Ease.ease,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "from-bottom-elements-lazy":
                            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, {
                                y: '100px',
                                autoAlpha: 0,
                                ease: Ease.ease,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            }, 0.25);
                            break;
                        case "from-bottom-items-lazy":
                            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, {
                                y: '100px',
                                opacity: 0,
                                ease: Ease.ease,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            }, 0.25);

                            break;
                        case "fade-in":
                            tween = TweenMax.from($(elem), speed, {
                                autoAlpha: 0,
                                yoyo: true,
                                delay: delay,
                                ease: Power0.easeNone,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "scaleX":
                            tween = TweenMax.from($(elem), speed, {
                                width: "0px",
                                transformOrigin: "0% 0%",
                                ease: Power0.easeNone,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "fade-in-up":
                            tween = TweenMax.from($(elem), speed, {
                                autoAlpha: 0,
                                y: '50px',
                                yoyo: true,
                                delay: delay,
                                ease: Power0.easeNone,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        case "fade-in-elements-lazy":
                            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, {
                                autoAlpha: 0,
                                yoyo: true,
                                delay: delay,
                                ease: Ease.ease,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            }, 0.25);
                            break;
                        case "fade-in-items-lazy":
                            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, {
                                autoAlpha: 0,
                                yoyo: true,
                                delay: delay,
                                ease: Ease.ease,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            }, 0.2);
                            break;
                        case "defaultAnim":
                            tween = TweenMax.from($(elem), speed, {
                                autoAlpha: 0,
                                delay: delay,
                                onComplete: function () {
                                    $(elem).removeClass('animating').addClass('animated');
                                }
                            });
                            break;
                        default:
                            tween = '';
                    }
                    new ScrollMagic.Scene({
                            triggerElement: triggerElem,
                            triggerHook: hook,
                            offset: offset,
                            duration: duration,
                            reverse: reverse,
                        })
                        .on('enter', function (event) {
                            $(elem).addClass('animating');
                        })
                        .setTween(tween)
                        .addTo(controller);
                });
            }
        },

        changeBg: function () {
            var controller = new ScrollMagic.Controller();
            var scene = new ScrollMagic.Scene({
                    triggerElement: '.parallax-container',
                    triggerHook: 0.5,
                    reverse: true
                })
                .setClassToggle('body', 'dark-bg')
                .addTo(controller);
        },
        
        featuredSlider: function () {
            $('.featured-section .slider').slick({
                lazyLoad: 'ondemand',
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                speed: 1200,
                cssEase: 'cubic-bezier(0.75, 0, 0.125, 1)',
                arrows: false,
                autoplay: true,
                centerMode: true
            });

            var $el = $('.tab-slider');
            $el.slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                cssEase: 'cubic-bezier(0.75, 0, 0.125, 1)',
                arrows: false,
                autoplay: true,
                centerMode: true
              });
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $('.tab-slider').slick('refresh');
            })
        },

        mouseCursor : function() {
            var $cursor = $('.drag-cursor'),
            $section = $('.featured-section'); 

            function moveCircle(e) {
                TweenLite.to($cursor, 0.3, {
                css: {
                    left: e.pageX,
                    top: e.pageY
                }
                });
            }

            var flag = false;
            $($section).mouseover(function(){
            flag = true;
            TweenLite.to($cursor,0.4,{scale:1,autoAlpha:1})
            $($section).on('mousemove', moveCircle);
            });
            $($section).mouseout(function(){
                flag = false;
                TweenLite.to($cursor,0.4,{scale:0.1,autoAlpha:0})
            });
        },

        textAnim: function() {
            
            var $title = $('.section .title');
            var controller = new ScrollMagic.Controller();
            $title.each(function() {
                var tween = TweenMax.staggerFromTo($(this).find('span'), 0.5, {
                    y: 300,
                    ease: Power2.ease0ut
                },
                {
                    y: 0,
                }, 0.075);
                var scene = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 1,
                    reverse: false
                })
                .setTween(tween)
                .addTo(controller);
            });
        },

        footerParallax: function() {
			var tween = TweenMax.to('.jordan-image', 1,{ marginBottom: 0 }
            );

            var controller = new ScrollMagic.Controller();
            var scene = new ScrollMagic.Scene({
                triggerElement: '.parallax-container', 
                triggerHook: 0.2,
                duration: '75%'
            })
            .setPin('.text-parallax')
            .setClassToggle('.footer', 'active')
            .setTween(tween)
            .addTo(controller);
        },
        
    };
    JORDAN.init();
}(jQuery));


// const scroller = new LocomotiveScroll({
//     el: document.querySelector('[data-scroll-container]'),
//     smooth: true
// })


