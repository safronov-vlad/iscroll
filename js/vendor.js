$(document).ready(function(){
    //вкл выкл скролл
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    preventDefault = function(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }

    preventDefaultForScrollKeys = function(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    disableScroll = function() {
      if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault; // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    }

    enableScroll = function() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }
/*
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        iscroll = function(e){
            params = {
                windowH : $(window).height(),
                scroll_to_delay : 250,
                speed : 250,
            }

            $($( e + ' > section')[0]).addClass('active')

            document.addEventListener('scroll', function (event) {
                //change data-current
                if( $( e + ' > section.active').offset().top < - ( params.windowH / 2 ) ){
                    $( e + ' > section.active').removeClass('active').next().addClass('active');
                    $(e).css('background',$(e + ' > section.active').data('color'));
                }
                else if ( $(e + ' > section.active').offset().top > params.windowH / 2 ){
                    $( e + ' > section.active').removeClass('active').prev().addClass('active');
                    $(e).css('background',$(e + ' > section.active').data('color'));
                }
            }, true)
        }
        $(window).resize(function(){
            params.windowH = $(window).height()
        })
        $($('.slick > .slick__item')[0]).addClass('slick-active')
    }
    else {
*/
        iscroll = function (e) {
            //параметры
            params = {
                windowH: $(window).height(), // ширина окна
                scroll_to_delay: 250, // делей срабатывания прилипания
                speed: 250, // скорость прилипания
                color_speed: 500, // скорость смены цвета
                change_color: false, // вкл смена цвета
                paralax_fogging: true, // вкл паралакс
                maximum_opacity: .5, //максимальный % затемнения ( от 0 до 1 )
                maximum_paralax: .33, //максимальный % затемнения ( от 0 до 1 )
            }
            one_percent = params.windowH / 100
            $(e).wrap('<div class="wrap"></div>')
            //выставление параметров при загрузке страницы
            $($(e + ' > section')[0]).addClass('active')
            $($('.header_fixed__top_bar li')[0]).addClass('active')
            for (i = 0; i < $(e + ' > section').length; i++) {
                $($(e + ' > section')[i]).attr('data-id', i)
                if (!$($(e + ' > section')[i]).attr('data-color')) {
                    $($(e + ' > section')[i]).append('<div class="fogged"></div>')
                }
                else if ($($(e + ' > section')[i]).attr('data-color')) {
                    if (!$($($(e + ' > section')[i]).next()[0]).attr('data-color')) {
                        $($(e + ' > section')[i]).append('<div class="fogged"></div>')
                    }
                }
            }
            $(e + ' > section[data-color]').css('background', $($(e + ' > section[data-color]')[0]).data('color'))
            flag = false
            curr_position = 0
            //функция прокрутки
            move = function () {
                //фиксирование стандартного блока
                if ($(e + ' > section.active').height() == params.windowH) {
                    len = 0
                    for (i = 0; i < $(e + ' > section').length; i++) {
                        if (!$($(e + ' > section')[i]).hasClass('active')) {
                            len += $($(e + ' > section')[i]).height()
                        }
                        else {
                            disableScroll()
                            $.when($('.wrap').animate({scrollTop: len}, params.speed)).then(function () {
                                enableScroll();
                                return
                            })
                        }
                    }
                }
                else {
                    //если видно следующий блок, делаем так чтобы видно не было
                    if ($(e + ' > section.active').next()[0]) {
                        //фиксирование расширенного блока: true = низ блока / else = верх блока
                        if ($(e + ' > section.active').next().offset().top - params.windowH < 0) {
                            len = 0
                            for (i = 0; i < $(e + ' > section').length; i++) {
                                if (!$($(e + ' > section')[i]).hasClass('active')) {
                                    len += $($(e + ' > section')[i]).height()
                                }
                                else {
                                    disableScroll()
                                    $.when($('.wrap').animate({scrollTop: len + $(e + ' > section.active').height() - params.windowH}, params.speed)).then(function () {
                                        enableScroll();
                                        return
                                    })
                                }
                            }
                        }
                        else if ($(e + ' > section.active').offset().top > 0) {
                            len = 0
                            for (i = 0; i < $(e + ' > section').length; i++) {
                                if (!$($(e + ' > section')[i]).hasClass('active')) {
                                    len += $($(e + ' > section')[i]).height()
                                }
                                else {
                                    disableScroll()
                                    $.when($('.wrap').animate({scrollTop: len}, params.speed)).then(function () {
                                        enableScroll();
                                        return
                                    })
                                }
                            }
                        }
                    }
                    else {
                        //если видно предыдущий блок, делаем так чтобы видно не было
                        if ($(e + ' > section.active').offset().top > 0) {
                            len = 0
                            for (i = 0; i < $(e + ' > section').length; i++) {
                                if (!$($(e + ' > section')[i]).hasClass('active')) {
                                    len += $($(e + ' > section')[i]).height()
                                }
                                else {
                                    disableScroll()
                                    $.when($('.wrap').animate({scrollTop: len}, params.speed)).then(function () {
                                        enableScroll();
                                        return
                                    })
                                }
                            }
                        }
                    }
                }
            }

            //проверка что прокрутка еще идет
            check_scroll = function () {
                if (curr_position != $('.wrap').scrollTop()) {
                    curr_position = $('.wrap').scrollTop()
                    setTimeout(function () {
                        check_scroll()
                    }, params.scroll_to_delay)
                }
                else {
                    move()
                    flag = false
                }
            }

            //обраобтичк прокрутки
            document.addEventListener('scroll', function (event) {
                //переключение авктивного блока
                if ($(e + ' > section.active').offset().top < -(($(e + ' > section.active').height() - params.windowH) + params.windowH / 2 )) {
                    $(e + ' > section.active').removeClass('active').next().addClass('active')
                    if ($(e + ' > section.active').data('color')) {
                        $(e + ' > section[data-color]').css('background', $(e + ' > section.active').data('color'))
                    }
                }
                else if ($(e + ' > section.active').offset().top > params.windowH / 2) {
                    $(e + ' > section.active').removeClass('active').prev().addClass('active');
                    if ($(e + ' > section.active').data('color')) {
                        $(e + ' > section[data-color]').css('background', $(e + ' > section.active').data('color'))
                    }
                }
                //паралкс + затемнение
                if (params.paralax_fogging) {
                    if ($(e + ' > section.active').next()[0]) {
                        if ($(e + ' > section.active').offset().top > 0) {
                            $(e + ' > section.active').prev().find('.fogged').css({'opacity': params.maximum_opacity * ( ( params.windowH - $(e + ' > section.active').offset().top ) / one_percent ) / 100})
                            $(e + ' > section.active').prev().find('.paralaxed').css('transform', 'translateY(' + params.maximum_paralax * ( ( params.windowH - $(e + ' > section.active').offset().top ) / one_percent ) + 'vh)')
                        }
                        else if ($(e + ' > section.active').offset().top < 0) {
                            if (( $(e + ' > section.active').offset().top + ( $(e + ' > section.active').height() - params.windowH ) ) < 0) {
                                $(e + ' > section.active').find('.fogged').css({'opacity': (( -( $(e + ' > section.active').height() - params.windowH + $(e + ' > section.active').offset().top ) / one_percent ) * params.maximum_opacity) / 100})
                                $(e + ' > section.active').find('.paralaxed').css('transform', 'translateY(' + (( -( $(e + ' > section.active').height() - params.windowH + $(e + ' > section.active').offset().top ) / one_percent ) * params.maximum_paralax) + 'vh)')
                            }
                            else {
                                $(e + ' > section.active').find('.fogged').css({'opacity': 0})
                                $(e + ' > section.active').find('.paralaxed').css({'transform': 'translateY(0%)'})
                            }
                        }
                        else {
                            $(e + ' > section.active').find('.fogged').css({'opacity': 0})
                            $(e + ' > section.active').find('.paralaxed').css({'transform': 'translateY(0%)'})
                        }
                    }
                    else{
                        if ($(e + ' > section.active').offset().top > 0) {
                            $(e + ' > section.active').prev().find('.fogged').css({'opacity': params.maximum_opacity * ( ( params.windowH - $(e + ' > section.active').offset().top ) / one_percent ) / 100})
                            $(e + ' > section.active').prev().find('.paralaxed').css('transform', 'translateY(' + params.maximum_paralax * ( ( params.windowH - $(e + ' > section.active').offset().top ) / one_percent ) + 'vh)')
                        }
                    }
                }
                //прилипалка
                if (!flag) {
                    check_scroll()
                    flag = true
                }
            }, true)
        }
//     }
    iscroll('.container')
})