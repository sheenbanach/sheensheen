var northpoint = (function() {
    function targetedPostback(webformElementId, ret) {
        WebForm_DoPostBackWithOptions(
            new WebForm_PostBackOptions(webformElementId, "SuppressZoneUpdate", true, "", "", false, true));
        return ret;
    }

    function initSearchResultSelector(params) {
        var selectedStaffInput = params.selectedStaffInput,
            displayInput = params.displayInput;
        $("a.staffSearchResultName", params.container).each(function() {
            $(this).click(function () {
                selectedStaffInput.val($(this).next("input.staffSearchResultId").val());
                displayInput.text($(this).text());

                var li = $(this).parent('li');
                li.siblings().removeClass('selected');
                li.addClass("selected");
            });
        });
    }

    return {
        TargetedPostback: targetedPostback,
        InitSearchResultSelector: initSearchResultSelector
    }
})();