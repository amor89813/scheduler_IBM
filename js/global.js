/// <reference path="~/js/spop.js" />
(function ($) {
    var touchEnabled = Modernizr.touch;
    var clientLogin;

    $(function () {
        silverpop = new SPApp();
        spEngageTracking = new SPEngage();
        initMegaNav();
        initSidebar();
        initClientLogin();

        var addthis_config =
        {
            data_track_addressbar: false
        }

        var $msgblock = $('div.siteMsg').css('opacity', 0);
        var msgblockHeight = $msgblock.outerHeight();
        var delayedMsgShow, delayedMsgHide;

        $msgblock.find('.close').on('click', hideMsg);
        delayedMsgShow = setTimeout(showMsg, 1500);
        delayedMsgHide = setTimeout(hideMsg, 31500);

        function showMsg() {
            if (silverpop.getCookie("PopUpCookiesMessage2")!="false"&&$('#ShouldPopUp').val()=="yes") {
                $msgblock.animate({ marginTop: msgblockHeight * -1, opacity: 1 }, 400, 'easeOutQuart');
                clearShowTimeout();
            }
        }

        function hideMsg() {
            $msgblock.animate({ marginTop: 0, opacity: 0 }, 400, 'easeInOutCirc', function () {
                $(this).hide();
            });
            clearHideTimeout();
            silverpop.setCookie("PopUpCookiesMessage2", "false",10);
        }

        function clearShowTimeout() {
            clearTimeout(delayedMsgShow);
        }

        function clearHideTimeout() {
            clearTimeout(delayedMsgHide);
        }

        $('.commentPost').click(function () {
            $(this).val('Saving...');
            $(this).addClass('disabled');
            $(this).unbind('click').on('click', function (evt) {
                evt.preventDefault();
            });
        });

    });

    if (typeof Sys !== "undefined") {
        Sys.Application.add_load(enhanceFormElements);
    }


    $(window).load(function () {
        initSlider();

        var slides;

        $('.featureImagery').each(function () {

            slides = $(this).find('li').length;

            if (slides <= 1) {
                $(this).parent().next('.bx-controls').hide();
            }

        });

    });


    window.onbeforeunload = function (e) {
        $.cookie("SP_EPi_Last_Visited_Page", $('#hfEPiPageID').val(), { path: '/' });
    };



    function equalizeHeight(group) {
        var tallest = 0;
        group.each(function () {
            var thisHeight = $(this).height();
            if (thisHeight > tallest) {
                tallest = thisHeight;
            }
        });
        group.height(tallest);
    }

    function initSidebar() {
        var contentScroller = $('#contentScroll');

        if (contentScroller.length) {
            if (!touchEnabled) {
                contentScroller.hoverscroll({
                    width: 220,
                    height: 220,
                    vertical: true,
                    fixedArrows: true
                });
            } else {
                contentScroller.bxSlider({
                    mode: 'vertical',
                    infiniteLoop: false,
                    pager: false,
                    minSlides: 2,
                    maxSlides: 2
                });
            }
        }
    }

    var cl = [];
    function initClientLogin() {

        cl.wrap = $('#loginDrop');
        cl.triggers = cl.wrap.find('> a').add(cl.wrap.find('.collapse'));
        cl.dropBox = cl.wrap.find('div.clientLoginDrop');
        cl.instances = cl.wrap.find('li.instanceOption');
        cl.selects = cl.wrap.find('select');
        cl.appSelect = cl.selects.eq(0);

        cl.triggers.on('click', toggleClientDropBox);
        cl.appSelect.on('change', updateInstances);
    }

    function toggleClientDropBox(e) {
        e.preventDefault();

        if (cl.dropBox.is(':visible')) {
            resetSelects(cl.selects);
        }
        cl.wrap.toggleClass('open');
        cl.dropBox.toggle('blind', 250);
    }

    function updateInstances() {
        var index = parseInt($(this).find('option:selected').attr('data-instance-opts'));
        var match = cl.instances.eq(index - 1);
        var nonMatch = cl.instances.not(match);

        if (index) {
            match.slideDown(300);
            nonMatch.slideUp(300);
        } else {
            cl.instances.slideUp(300);
        }
        resetSelects(nonMatch.find('select'));
    }

    function resetSelects(els) {
        els.find('option:eq(0)').prop('selected', true);
        $.uniform.update();
    }

    function initSlider() {
        var imgRotator = $('.featureImagery');

        if (imgRotator.children('li').length > 1) {
            imgRotator.bxSlider({
                controls: false,
                infiniteLoop: false
            });
        }
    }

    function initMegaNav() {
        if ($("#navMain").length) {
            $("#navMain").adageMegamenu({
                duration: 300,
                easing: 'easeOutCubic',
                hoverIntentDelay: 30
            });
        }
    }

    function enhanceFormElements() {

        // Enhance selects to look like text inputs
        $('select').each(function () {
            var $this = $(this);
            var selectedValue = $this.find('[selected]').val();
            var selectWidth = $this.width();
            $this.uniform();
            $this.find('[value="' + selectedValue + '"]').attr('selected', 'selected');
            $this.css("width", "100%");
        });


        // Allow autogrow width on inline text inputs
        //    $('#sidebarPanels input:text').autoGrowInput({ comfortZone: 10, minWidth: 20, maxWidth: 170 });
        //    sizeInlineInput($('#sidebarPanels input:text'));

    }

    //function sizeInlineInput(input) {
    //    input.keydown();
    //}



} (jQuery));


// Linked In Async

//$(window).load(function () {
//    $.getScript("http://platform.linkedin.com/in.js?async=true", function () {
//        IN.init();
//    });
//});


if (_(window.chrome).isUndefined()) {
    console = {};
    console.log = function () { return this; };
    console.group = function () { return this; };
    console.groupCollapsed = function () { return this; };
    console.groupEnd = function () { return this; };
    console.time = function () { return this; };
    console.timeEnd = function () { return this; };
    console.trace = function () { return this; };
    console.count = function () { return this; };
    console.info = function () { return this; };
    console.warn = function () { return this; };
    console.dirxml = function () { return this; }
    console.error = function () { return this; };
}