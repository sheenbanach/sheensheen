$(document).ready(function () {

    // Hide empty .more hyperlinks
    $('a.more[href=], a.more:not([href])').hide();
    $('a.more').filter(function () {
        return $.trim($(this).html()) == '';
    }).hide();

    // Events tooltip
    if ( typeof jQuery().tooltip != 'undefined' ) {
        // JQuery ui is loaded, initialize tooltip
        $('a.event-tooltip').tooltip();
    } 

    // Hide breadcrumb based on whether there's a banner image 
    if ($('#imageBanner').length == 0) {
        if ($("#content .col-lg-26 > .breadcrumb").length > 0) {
            // Hide the first breadcrumb
            $("#content > .breadcrumb").hide();
            $("#content .col-lg-26 > .breadcrumb").show();
        }
    } else {
        // Image banner exists, hide 2nd breadcrumb
        $("#content .col-lg-26 > .breadcrumb").hide();
    }

    // Replace &amp; in content
    var match = '&amp;';
    $('#content li:contains(' + match + ')').each(function () {
        // $(this).text($(this).text().replace(match, '&'));
    });

    // Academic Program rearranging 
    $(".academic-programs .oneRow .alignleft").each(function () {
        // Get the html we need to move
        oldval = $(this).html();
        // Delete it
        $(this).html('');
        // Now move it
        $(this).next('div').prepend(oldval);

    });

    // Main nav spacing
    $("#sfmenu > li:last-child > a").html(function (i, oldVal) {
        return oldVal.replace(/ .*/, function (match) {
            return "<br>" + match + "";
        });
    });

    // Admissions page bannermenu dropdowns 
    if ($('.admissions-landing .bannerMenu ul').closest("li").children("ul").length) {
        // the clicked on <li> has a <ul> as a direct child
        $('.admissions-landing .bannerMenu ul').closest("li").children("ul").closest("li").addClass('nested');
    }


    // Hide grey bar in one column if no left-hand content
    if ($(".col-lg-8").children().length <= 1) {
        $("#content").css('border-left', '0');
    }

    // Faculty Page toggle class
    $('.faculty .browse-results input[type="submit"]').click(function () {
        $(this).toggleClass("browse-selected");
    });

    // Sitemap detection
    if ($("ul.sitemap").length > 0) {
        $('div#content').css('border-left', '0');
    }

    // Scroll up functionality
    // Only if #content.backtotop exists
    if ($("div#content").hasClass("interim-backtotop")) {

        var eTop = $('#footer').offset().top; //get the offset top of the element
        //log(eTop - $(window).scrollTop()); //position of the ele w.r.t window

        $(window).scroll(function () { //when window is scrolled
            var scrollPosition = eTop - $(window).scrollTop();
            //log(scrollPosition); 
        });

        // Position of fixed element from top of the document
        var fixedElementOffset = $('.scrollup').offset().top;
        // Position of footer element from top of the document.
        // You can add extra distance from the bottom if needed,
        // must match with the bottom property in CSS
        var footerOffset = $('#footer').offset().top - 36;

        var fixedElementHeight = $('.scrollup').height();

        $(window).scroll(function (event) {
            if ($(this).scrollTop() > 1050) {
                $('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }

            if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {

                var scrollPosition = eTop - $(window).scrollTop();

                if (scrollPosition < 600) {
                    //alert('yourein the footer');
                    var footerHeight = $("#footer").outerHeight();
                    var arrowOffset = (footerHeight - scrollPosition) + 320;
                    // (footer height - scroll position) + 80 = bottom
                    $('.scrollup').css('bottom', arrowOffset + 'px');
                }

            } else {
                //$('.scrollup').css('position', 'fixed').css('bottom', '80px').css('top', auto);
                $('.scrollup').css('position', 'fixed').css('bottom', '80px');
            }


        });



    };

    $('.scrollup').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    // Hide empty ul tags
    //$('ul#sfmenu').not('.leftNavigationMenu').not(':has(li)').remove();
    $('ul#sfmenu').not(':has(li)').remove();

    // Search toggle
    var $searchlink = $('#searchtoggle i');
    var $searchbar = $('#searchbar-wrapper');

    // Main nav hovers 
    $('#menu_wrapper #sfmenu > li').hover(

            // if invisible we allow hovers
            function () {
                //$('ul', this).stop().slideDown(100);
                if (!$searchbar.is(":visible")) {
                    $('ul', this).stop().show();
                    $(this).css('background-color', '');
                } else {
                    $(this).css('background-color', '#fff');
                }

            },
            function () {
                //$('ul', this).stop().slideUp(100);
                if (!$searchbar.is(":visible")) {
                    $('ul', this).stop().hide();
                    $(this).css('background-color', '');
                } else {
                    $(this).css('background-color', '#fff');
                }
            }

     );

    $('#search a').on('click', function (e) {

        e.preventDefault();

        if ($(this).attr('id') == 'searchtoggle') {

            if (!$searchbar.is(":visible")) {
                // if invisible we switch the icon to appear collapsable
                //$searchlink.removeClass('fa-search').addClass('fa-search-minus');

                $('#search').addClass('active');
                $("body.home #main").animate({ "top": "78px" }, 300);

                // Focus the input field
                setTimeout(function () {
                    $("input.gsInput").focus();
                }, 300);

            } else {
                // if visible we switch the icon to appear as a toggle
                //$searchlink.removeClass('fa-search-minus').addClass('fa-search');
                $('#search').removeClass('active');
                $("body.home #main").animate({ "top": "0px" }, 300);
            }

            $searchbar.slideToggle(300, function () {
                // callback after search bar animation
            });
        }
    });

    // Placeholder persistence for Safari and IE

    // Featured Publications add class to every odd div with class
    $('div.featuredPublicationsContainer:even').css('clear', 'both');


    //Since Corporate Connection has no sub items, remove the ul to make the design not so nasty
    $(".Corporate.Connection ul").remove();

});
