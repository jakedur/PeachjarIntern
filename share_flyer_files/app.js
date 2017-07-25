//$ scripts
// for in and out of school svg tooltip
window.onbeforeunload = function() {
    $.removeCookie('region');
    $.removeCookie('redirect');
};
$(document).ready(function() {
    'use strict';

    if ($.cookie('redirect') || $.cookie('region') != null) {
        $('.nav-module').find('.btn--primary').attr('href', 'index.php?a=4').find('.btn__text').text('My Account');
        $('.nav-module').find('.btn--light').hide();
    }
    //only use below for geocore special sales
    //intial ajax call to grab values
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "AJAX.php?controller=addon_credits_balance&action=chooseCreditsDisplay", //Relative or absolute path to response.php file
        data: "",
        error: function() {
            console.error('no ajax data');
        },
        success: function(data) {
            // console.info(data);
            var cyberMonActive = data.active_holiday_sale;
            var cyberMonEnd = data.sale_end_date;
            // console.log(cyberMonActive);

            if (cyberMonActive === 1) {
                //dom munipulation
                $('.modal-container').hide().removeClass('modal-active');
                $('.btn--peachjar-color').removeClass('hide').addClass('showInLine');
                $('.growl-notice').addClass('notification--reveal');
                $('.pricing--title, .pricing-calc, .reg--price').addClass('hide');
                $('.Cyber--Banner, .pricing-calc-cyber, .cyber--price').removeClass('hide');
                $('.pricing-calc-cyber').on('change keyup', '#numOfSchoolsCyber, #durationCyber, #numOfCampaignsCyber, #creditNeedCyber', function(event) {
                    event.preventDefault();
                    var numSchoolCyber = $('#numOfSchoolsCyber').val();
                    var durationCyber = $('#durationCyber').val();
                    var numFlyerCyber = $('#numOfCampaignsCyber').val();

                    $('#numOfSchoolsCyber').val(numSchoolCyber);
                    $('#numOfCampaignsCyber').val(numFlyerCyber);
                    var totalCyber = parseInt(numSchoolCyber * 5 * numFlyerCyber) + parseInt(numSchoolCyber * 3 * numFlyerCyber * (durationCyber - 1));
                    // console.log(totalCyber);
                    $('#creditNeedCyber').val(totalNeedCyber);
                    var totalNeedCyber = getCyberPrice(totalCyber);
                    $('#creditNeedCyber').val(totalCyber);

                    $('#calculatedPriceCyber').val('$' + totalNeedCyber.totalCyber.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
                    $('#calculatedPriceCyber').focus();
                });

                function getCyberPrice(enterCyberPrice) {
                    var $i = 0;
                    var priceCyber = [];
                    var $targetElm = '.square-input';
                    var $targetTextChg = '.savings';
                    var unitPriceCyber = ["5.0", "4", "3.75", "3.5", "3.0", "2.5"];
                    if (enterCyberPrice >= 0 && enterCyberPrice < 50) {
                        $i = 0;
                        $($targetElm).find($targetTextChg).html('&ndash;');
                    } else if (enterCyberPrice > 49 && enterCyberPrice < 400) {
                        $i = 1;
                        $($targetElm).find($targetTextChg).text('Save 20%');
                    } else if (enterCyberPrice > 399 && enterCyberPrice < 1200) {
                        $i = 2;
                        $($targetElm).find($targetTextChg).text('Save 25%');
                    } else if (enterCyberPrice > 1199 && enterCyberPrice < 9999999) {
                        $i = 3;
                        $($targetElm).find($targetTextChg).text('Save 30%');
                    }
                    /*else if (enterCyberPrice > 999 && enterCyberPrice < 2500) {
                           $i = 4;
                       } else if (enterCyberPrice > 2499 && enterCyberPrice < 999999) {
                           $i = 5;
                       }*/
                    else {
                        $i = 3;
                    }
                    priceCyber.totalCyber = enterCyberPrice === 0 ? 0 : enterCyberPrice * unitPriceCyber[$i];
                    priceCyber.unitPriceCyber = unitPriceCyber[$i] * 5;
                    return priceCyber;
                }


                if ($.cookie('CyberSale') == null) {
                    $('.modal-container').show().addClass('modal-active');
                    $('body').find('.modal-close').on('click', function(event) {
                        event.preventDefault();
                        console.info('clicked modal cross');
                        $('body').find('.btn--peachjar-color').removeClass('hide').addClass('showInline')
                        $('body').find('.growl-notice').addClass('notification--reveal');
                    })
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: "AJAX.php?controller=addon_credits_balance&action=chooseCreditsDisplay", //Relative or absolute path to response.php file
                        data: "",
                        success: function(data) {
                            console.info(data);
                            var cyberMonActive = data.active_holiday_sale;
                            var cyberMonEnd = data.sale_end_date
                                // console.log(cyberMonActive);

                            // set cookie
                            $.cookie('CyberSale', cyberMonEnd, {
                                expires: 1,
                                path: '/'
                            });
                            if (cyberMonActive === 0) {
                                console.log('it = 0 ')

                            } else if (cyberMonActive === 1) {
                                console.log('it = 1');
                            }
                        }
                    });

                } else if ($.cookie('CyberSale') != null) {
                    //lets you no cookie is set 
                    console.info("cookie set")

                } else {
                    if ($.cookie('CyberSale')) {
                        //cleans cookie
                        $.removeCookie("CyberSale", { path: '/' });
                    }
                }
            } else if (cyberMonActive === 0) {
                if ($.cookie('CyberSale')) {
                    //cleans cookie
                    $.removeCookie("CyberSale", { path: '/' });
                }
            }
        }
    });
    //end code for cyber monday
    // console.log(location.pathname.split("/")[1]);
    $('nav').find('.menu li a[href^="' + location.pathname.split("/")[1] + '"]').parent().addClass('active');

    $('#hours-graph').on('mouseenter', '.dark-background, .blue-gradiant', function() {
        // console.log(this);
        var toShow = $(this).attr('id'); // get the hovered section's id
        // console.log(toShow);
        $(toShow).stop();
        var elemHide = $('#' + toShow + 'Tip');
        var elemShow = $('#' + toShow + 'Tip');
        // console.log(elemHide.attr('class'));
        // console.log(elemShow.prop( 'class' ,function(index,currentvalue){}));
        elemHide.hide();
        elemShow.attr('class', 'show animated hinge--Tip fadeInDown--Tip');
    }).on('mouseleave', '.dark-background, .blue-gradiant', function() {
        // console.log(this);

        var toShow = $(this).attr('id'); // get the hovered section's id
        // console.log(toShow);
        $(toShow).stop();
        var elemHide = $('#' + toShow + 'Tip');
        // console.log(elemHide);
        elemHide.attr('class', 'show animated hinge--Tip--out fadeOut');
    });


    $('.jump-to-section').on('click', function(evt) {
        evt.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing');

    });

    $('.pricing-calc').on('change keyup', '#numOfSchools, #duration, #numOfCampaigns, #creditNeed', function(event) {
        event.preventDefault();
        var numSchool = $('#numOfSchools').val();
        var duration = $('#duration').val();
        var numFlyer = $('#numOfCampaigns').val();

        $('#numOfSchools').val(numSchool);
        $('#numOfCampaigns').val(numFlyer);
        var total = parseInt(numSchool * 5 * numFlyer) + parseInt(numSchool * 3 * numFlyer * (duration - 1));
        console.log(total);
        $('#creditNeed').val(totalNeed);
        var totalNeed = getEnterPrice(total);
        $('#creditNeed').val(total);

        $('#calculatedPrice').val('$' + totalNeed.total.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
    });


    function getEnterPrice(enterPrice) {
        var $i = 0;
        var price = [];
        var $targetElm = '.square-input';
        var $targetTextChg = '.savings';
        var unitPrice = ["5.0", "4.5", "4.25", "4.0", "3.0", "2.5"];
        if (enterPrice >= 0 && enterPrice < 100) {
            $i = 0;
            $($targetElm).find($targetTextChg).html('&ndash;');
        } else if (enterPrice > 99 && enterPrice < 300) {
            $i = 1;
            $($targetElm).find($targetTextChg).text('Save 10%');
        } else if (enterPrice > 299 && enterPrice < 750) {
            $i = 2;
            $($targetElm).find($targetTextChg).text('Save 15%');
        } else if (enterPrice > 749 && enterPrice < 9999999) {
            $i = 3;
            $($targetElm).find($targetTextChg).text('Save 20%');
        }
        /*else if (enterPrice > 999 && enterPrice < 2500) {
               $i = 4;
           } else if (enterPrice > 2499 && enterPrice < 999999) {
               $i = 5;
           }*/
        else {
            $i = 3;
        }
        price.total = enterPrice === 0 ? 0 : enterPrice * unitPrice[$i];
        price.unitPrice = unitPrice[$i] * 5;
        return price;
    }
});
$('.question').on('mouseenter', function() {
    console.log('touched')
        /* Act on the event */
    $(this).parents('.square-input').find('.dontShow').addClass('show');
}).on('mouseleave', function() {
    /* Act on the event */
    $(this).parents('.square-input').find('.dontShow').removeClass('show');

});
// Vanilla js not $ 
// for wordpress feed 

function showFeed(data) {
    'use strict';
    var wpLink;
    var wpTitle;
    var wpDate;
    var wpMonthSplit;
    var wpCollection;
    var wpMonth;
    var wpMonthCollection;
    var wpOutput;
    var wpMonthJoin;
    var wp_title = document.getElementById('wps-feed');
    if (wp_title !== 'undefined' && wp_title !== null) {
        // console.log(data);
        if (data.status === 'ok') {
            for (var i = 0; i < data.items.length; ++i) {
                wpLink = data.items[0].link;
                wpTitle = data.items[0].title.toString().substr(0, 186);
                wpDate = data.items[0].pubDate.toString().substr(0, 17);
                wpMonthSplit = wpDate.split(" ");
            }
            var wpDateSplit = wpDate.split(" ");
            var wpYearDayMonthSplit = wpDateSplit[0].split("-");
            var wpYearFromDate = wpYearDayMonthSplit[0];
            var monthFromYear = wpYearDayMonthSplit[1];
            var dayFromDate = wpYearDayMonthSplit[2];

            switch (monthFromYear) {

                case "01":
                    monthFromYear = 'January';
                    break;
                case '02':
                    monthFromYear = 'February';
                    break;
                case '03':
                    monthFromYear = 'March';
                    break;
                case '04':
                    monthFromYear = 'April';
                    break;
                case '05':
                    monthFromYear = 'May';
                    break;
                case '06':
                    monthFromYear = 'June';
                    break;
                case '07':
                    monthFromYear = 'July';
                    break;
                case '08':
                    monthFromYear = 'August';
                    break;
                case '09':
                    monthFromYear = 'September';
                    break;
                case '10':
                    monthFromYear = 'October';
                    break;
                case '11':
                    monthFromYear = 'November';
                    break;
                case '12':
                    monthFromYear = 'December';
                    break;

            }


        }
        wpOutput = '<a href="' + wpLink + '" class="webinar-link" target="_blank"><h5 class="blog-title">' + wpTitle + '</h5> <p class="small"><i class="fa fa-calendar-o"></i><span class="date">' + monthFromYear + ' ' + dayFromDate + ' ' + wpYearFromDate + '</span></p></a>';
        wp_title.innerHTML = wpOutput;
    }
}
//fontawesome check
function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}
window.onload = function() {
    var span = document.createElement('span');

    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);

    if ((css(span, 'font-family')) !== 'FontAwesome') {
        // add a local fallback
        // console.log('not loaded');
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "bower_components/font-awesome/font-awesome.min.css";
        $("head").append(l);
    } else {
        // console.log('loaded')
    }
    document.body.removeChild(span);
};

function swithcMonths(day) {
    var day;

    switch (day) {

        case "01":
            day = 'January';
            break;
        case '02':
            day = 'February';
            break;
        case '03':
            day = 'March';
            break;
        case '04':
            day = 'April';
            break;
        case '05':
            day = 'May';
            break;
        case '06':
            day = 'June';
            break;
        case '07':
            day = 'July';
            break;
        case '08':
            day = 'August';
            break;
        case '09':
            day = 'September';
            break;
        case '10':
            day = 'October';
            break;
        case '11':
            day = 'November';
            break;
        case '12':
            day = 'December';
            break;

    }
    return day;
};


