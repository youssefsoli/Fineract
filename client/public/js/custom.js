$(function () {

    "use strict";
    
     $('body').scrollspy({
        target: '#bs-example-navbar-collapse-1'
    });
    // for navbar background color when scrolling
    $(window).scroll(function () {
        var $scrolling = $(this).scrollTop();
        var bc2top = $("#back-top-btn");
        var stickytop = $(".nav_area");
        if ($scrolling >= 10) {
            stickytop.addClass('navcss');
        } else {
            stickytop.removeClass('navcss');
        }
        
        if ($scrolling > 150) {
            bc2top.fadeIn(2000);
        } else {
            bc2top.fadeOut(2000);
        }
    });
    
    // this is for back to top js
    var bc2top = $('#back-top-btn');
    bc2top.on('click', function () {
        html_body.animate({
            scrollTop: 0
        }, 1500);
    });
    //==================Preloader Start==================

    $(".loading").delay(3000).fadeOut(1000);

    //==================Preloader End==================

    //==================Sticky Menu Start==================

    $(window).on("scroll", function () {
        var scrolling = $(this).scrollTop();
        if (scrolling >= 250) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }
    });

    //==================Sticky Menu Part End==================
    

    
    // ================== Testimonials JS Slick ==================
    $('.testimonial-slick').slick({
      infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        prevArrow: '<i class="fas fa-long-arrow-alt-left slidprev"></i>',
        nextArrow: '<i class="fas fa-long-arrow-alt-right slidNext"></i>',
        dots: false,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 791,
                settings: {
                   arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
			}
		  ]
    }); 
    // ================== Why choose us JS Slick ==================
    $('.choose-slick').slick({
      infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        dots: false,
        autoplaySpeed: 3500,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                   
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
			},
            {
                breakpoint: 767,
                settings: {
                    
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
			}
		  ]
    });
    

   // ================== Pricing JS Slick ==================

   $('.price-slick').slick({
      infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        dots: false,
        autoplaySpeed: 3500,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                   
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
			},
            {
                breakpoint: 767,
                settings: {
                    
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
			}
		  ]
    });

    //==================Animated Scroll Start==================

    var html_body = $('html, body');
    $('nav a').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                html_body.animate({
                    scrollTop: target.offset().top - 50
                }, 1500);
                return false;
            }
        }
    });

    //==================Animated Scroll End==================

    

});