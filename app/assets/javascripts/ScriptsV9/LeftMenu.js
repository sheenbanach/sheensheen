$(document).ready(function () {
    $("a.show-second-level").on("click", function() {
        var hideMenu = $(this).parent().find("a.hide-second-level");
        $(this).hide();
        hideMenu.show();
        $(this).parent().parent().find("ul.second-level").show();
    });

    $("a.hide-second-level").on("click", function () {
        var showMenu = $(this).parent().find("a.show-second-level");
        $(this).hide();
        showMenu.show();
        $(this).parent().parent().find("ul.second-level").hide();
    });
});

