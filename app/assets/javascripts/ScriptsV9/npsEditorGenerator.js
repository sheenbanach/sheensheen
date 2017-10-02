(function ($) {
    $.fn.npsImageSelector = function () {
        var count = $(".npsImageSelector").length;
        var imageSelector = $('<span class="npsImageSelector nis' + (count) + '" ><table><tr colspan="2"><td class="currentFolder">Current Folder: <span>Root</span></td></tr><tr colspan="2"><td class="previousFolder">Previous Folder: <a>Go Back</a></td></tr><tr><td class="folderSelect"><div></div></td><td class="imageSelect" ><div></div></td></tr><tr colspan="2"><td class="selectedImage"><input class="changeVal" type="hidden" />Selected Image: <span></span></td></tr></table></span>');
        var currentFolderTitle = "Root";
        var currentFolderId = "0";
        var currentFolderTitleDisplay = imageSelector.find(".currentFolder span");
        var parentFolderDisplay = imageSelector.find(".previousFolder");
        var folderListDisplay = imageSelector.find(".folderSelect div");
        var imageListDisplay = imageSelector.find(".imageSelect div");
        var selectedImageDisplay = imageSelector.find(".selectedImage span");
        var changeWatch = imageSelector.find(".changeVal");

        var update = function () {
            var id = $(this).attr("data-id") || currentFolderId;
            var title = $(this).attr("data-title") || currentFolderTitle;
            var $that = $(this);
            $.get("/HandlersV9/imageSelector.ashx?id=" + id, function (data) {
                data = JSON.parse(data);
                updateHeadings(id, title, data.path);
                updateFolderList(data.folders);
                updateImageList(data.images);
                window.setTimeout(function () {
                    //set folder links
                    parentFolderDisplay.find("a").click(update);
                    folderListDisplay.find('a').click(update);
                    //set image links
                    imageListDisplay.find('a').click(setSelected);

                    imageSelector.find('a').css("cursor", "pointer");
                }, 100)
            });
        };

        var manualUpdate = function (selectedId, selectedTitle) {
            $.get("/HandlersV9/imageSelector.ashx?id=" + selectedId, function (data) {
                data = JSON.parse(data);
                updateHeadings(selectedId, selectedTitle, data.path);
                updateFolderList(data.folders);
                updateImageList(data.images);
                window.setTimeout(function () {
                    //set folder links
                    parentFolderDisplay.find("a").click(update);
                    folderListDisplay.find('a').click(update);
                    //set image links
                    imageListDisplay.find('a').click(setSelected);

                    imageSelector.find('a').css("cursor", "pointer");
                }, 100)
            });
        }

        var setSelected = function () {
            var id = $(this).attr("data-id");
            var title = $(this).attr("data-title");
            $(this).closest('div').find('a').css("background", "");
            $(this).css("background", "#80FFFE");
            selectedImageDisplay.html(title);
            selectedImageDisplay.attr("data-id", id);
            changeWatch.val(id);
            changeWatch.trigger("change");
        };

        var getSelected = function () {
            var id = selectedImageDisplay.attr("data-id");
            if (typeof id === "undefined") { return -1; }
            else { return id; }
        };

        var updateHeadings = function (newFolderId, newFolderTitle, path) {
            var elem
            //update path
            parentFolderDisplay.html("");
            for (var i = path.length - 1; i > -1; i--) {
                elem = $("<a></a>");
                elem.html(path[i].name + " > ");
                elem.attr("data-id", path[i].id);
                elem.attr("data-title", path[i].name);
                parentFolderDisplay.append(elem);
            }
            //update current
            elem = $("<span></span>");
            elem.html(newFolderTitle);
            parentFolderDisplay.append(elem);
            currentFolderTitleDisplay.html(newFolderTitle);
        }

        var updateFolderList = function (folderList) {
            folderListDisplay.html('');
            if (folderList.length > 0) {
                for (var i = 0; i < folderList.length; i++) {
                    (function (folder) {
                        var additionalFolder = $('<a data-id="' + folder.id + '" data-title="' + folder.title + '">' + folder.title + '</a>')
                        //additionalFolder.click(function () { });//TODO fix click
                        folderListDisplay.append(additionalFolder);
                    })(folderList[i]);
                }
            }
            else {
                folderListDisplay.append($("<h2>no subfolders</h2>"));
            }
        }

        var updateImageList = function (imageList) {
            imageListDisplay.html('');
            if (imageList.length > 0) {
                for (var i = 0; i < imageList.length; i++) {
                    (function (image) {
                        var additionalImage = $('<a data-id="' + image.id + '" data-title="' + image.title + '"><img src="' + image.file + '" style="height:75px;width:75px;" />' + image.title + '</a>')
                        //additionalImage.click(function () { });//TODO fix click
                        imageListDisplay.append(additionalImage);
                    }(imageList[i]));
                }
            }
            else {
                imageListDisplay.append($("<h2>no images</h2>"));
            }
        }

        update();

        $(this).replaceWith(imageSelector);

        imageSelector.value = getSelected;

        imageSelector.forceUpdate = function (imgId) {
            $.get("/HandlersV9/imageSelector.ashx?iid=" + imgId, function (data) {
                data = JSON.parse(data);
                currentFolderTitle = data.parentName;
                currentFolderId = data.parentId;
                currentFolderTitleDisplay.html(data.folderName);
                currentFolderTitleDisplay.attr("data-id", data.folderId);
                currentFolderTitleDisplay.attr("data-title", data.folderName);
                //parentFolderTitleDisplay.html(data.parentTitle);
                //parentFolderTitleDisplay.attr("data-id", data.parentId);
                //parentFolderTitleDisplay.attr("data-title", data.parentName);
                selectedImageDisplay.html(data.title);
                selectedImageDisplay.attr("data-title", data.title);
                selectedImageDisplay.attr("data-id", data.id);
                manualUpdate(data.folderId, data.folderName);
            });
        }

        imageSelector.change = changeWatch.change;

        imageSelector.setRowAction = function (row, selector) {
            if (!selector) { selector = ".image"; }
            $(this).change(function () {
                row.find(selector).val($(this).find(".selectedImage span").attr("data-id"));
                row.find(selector).trigger("change");
            });
        }

        return imageSelector;
    };

    $.fn.npsEditor = function (args) {
        var submitSection = $(this);
        if (submitSection.hasClass("open"))
        { return; }
        else { submitSection.addClass("open"); }

        if (!args) {
            args = JSON.parse(submitSection.children(".config").text());
        }

        var allEditors = [];
        var designerHidden = '<input type="hidden" class = "designer" placeholder="designer" value="">';
        var designerPreview = '<article class="designer_preview" />';
        var designerButton = '<button>Edit Text</button>';
        var textBoxHtml = '<input  type="text"/>';
        var richBoxHtml = '<textarea class="description" placeholder="description"></textarea>';
        var imageSelectorHtml = '<input class="image" type="text" placeholder="image" style="display: none;" /><span class="imageSelector"></span>';
        var rowHtml = '<li class="editItem"><p><a class="rowUp">↑   </a><a class="rowDown">↓   </a><a class="removeRow">remove this item</a></p></li>';
        args.min = args.min || 1;
        args.max = args.max || 0;
        if (args.max === 1 || args.min === args.max) {
            rowHtml = '<li class="editItem"><p><a class="rowUp">↑   </a><a class="rowDown">↓   </a></p></li>';
        }
        if (args.max === 1) {
            rowHtml = '<li class="editItem"></li>';
        }
        var count = $(".displayData").length;
        var displayData = $('<div class="displayData npsEditor' + count + '"><ul>' + rowHtml + '</ul><a class="addRow">add item</a></div>');
        if (args.max === 1 || args.min === args.max) {
            displayData.find(".addRow").remove();
        }

        submitSection.after(displayData);

        var loadingElement;
        ///****************************************************** EDITOR INITIALIZATION FUNCTIONS
        var initRows = function () {
            setTimeout(function () {
                if (displayData.find("li.editItem").length < args.min) {
                    addItem();
                    initRows();
                }
                else {
                    initLinkList();
                }
            }, 100);

        }

        var createRow = function (loadInto) {
            var loadingElement;
            for (var i = 0; i < args.fields.length; i++) {
                if (args.fields[i].type === "text") {
                    loadingElement = $(textBoxHtml);
                    loadingElement.attr("placeholder", args.fields[i].placeholder)
                    loadingElement.attr("class", args.fields[i].name)
                    loadInto.append(loadingElement);
                }
                else if (args.fields[i].type === "rich") {
                    loadingElement = $(richBoxHtml);
                    loadingElement.attr("placeholder", args.fields[i].placeholder)
                    loadingElement.attr("class", args.fields[i].name)
                    loadInto.append(loadingElement);
                }
                else if (args.fields[i].type === "img") {
                    loadingElement = $(imageSelectorHtml);
                    $(loadingElement[1]).attr("placeholder", args.fields[i].placeholder);
                    $(loadingElement[1]).attr("class", args.fields[i].name);
                    $(loadingElement[0]).attr("class", args.fields[i].name + 'ImageSelector');
                    loadInto.append(loadingElement);
                }
                else if (args.fields[i].type === "designer") {
                    loadingElement = $(designerPreview);
                    loadingElement.attr("class", args.fields[i].name + "_preview");
                    loadInto.append(loadingElement);

                    loadingElement = $(designerHidden);
                    loadingElement.attr("placeholder", args.fields[i].placeholder);
                    loadingElement.attr("class", args.fields[i].name);
                    loadInto.append(loadingElement);

                    (function (listener) {
                        var loadingButton = $(designerButton);
                        var popup, editorContent;
                        loadingButton.click(function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        popup = window.open("/DesignerEditor.aspx", "Content Editor Popup", "width=600,height=380");
                            if (typeof (popup) === 'undefined') {
                                alert('The editor is attempting to open in a pop-up window, but this appears to have been blocked. Please check your pop-up blocker and allow pop-ups from this site.');
                                return false;
                            }
                        popup.window.onload = function () {
                                editorContent = popup.$('#RadEContentIframeux_editor_ContentDesigner').contents().find('#design_content');
                                editorContent.html(listener.val());
                                popup.$('#saveButton').click(function () {
                                    // in some browsers the <html> view ends up creating nested iframes
                                    while (editorContent && editorContent.children("iframe") && editorContent.children("iframe").length) {
                                        editorContent = editorContent.children("iframe").contents().find('#design_content');
                                    }
                                    editorContent.find('p').each(function() {
                                        var $this = $(this);
                                        if ($this.html().replace(/\s|&nbsp;|&#160;/g, '').length == 0)
                                            $this.remove();
                                    });
                                    listener.val(editorContent.html());
                                    listener.prev().html(editorContent.html());
                                setDisplayData();
                                popup.close();
                            });
                            popup.$('#cancelButton').click(function () {
                                popup.close();
                            });
                        };
                    });
                        loadInto.append(loadingButton);
                    })(loadingElement);
                }
            }
        }

        var initLinkList = function () {
            if (submitSection.find("input").val().length > 1) { //Existing editor data exists
                var controlArray = JSON.parse(submitSection.find("input").val());
                for (var i = 0; i < controlArray.length - args.min; i++) {
                    addItem();
                }

                window.setTimeout(function () {
                    var inputList = displayData.find("li.editItem");
                    for (var j = 0; j < controlArray.length; j++) {
                        for (var i = 0; i < args.fields.length; i++) {
                            (function (control, data, row) {
                                setDynamicFieldStartValue(control, data, row);
                            })(args.fields[i], controlArray[j], $(inputList[j]));
                        }
                    }
                }, 100)
            }
            else { //No previous data exists
                var initRows = displayData.find("li.editItem");
                for (var i = 0; i < initRows.length; i++) {
                    (function (initRow) {
                        for (var j = 0; j < args.fields.length; j++) {
                            if (args.fields[j].type === "rich") {
                                var editor = initRow.find("." + args.fields[j].name).cleditor(editorOptions);
                                allEditors.push(editor);
                                editor.change(setDisplayData);
                            }
                            else if (args.fields[j].type === "img") {
                                var selector = initRow.find("." + args.fields[j].name).npsImageSelector();
                                selector.setRowAction(initRow, "." + args.fields[j].name + "ImageSelector");
                            }
                        }
                    })($(initRows[i]));
                }
            }
            //set user interactions
            displayData.find('input').change(setDisplayData);
            displayData.find(".addRow").click(addItem);
            displayData.find(".removeRow").click(removeItem);
            displayData.find(".rowUp").unbind('click');
            displayData.find(".rowDown").unbind('click');
            displayData.find(".rowUp").click(shiftRowUp);
            displayData.find(".rowDown").click(shiftRowDown);
        };

        var generateResponseObject = function (controls, row) {
            var obj = {};
            for (var i = 0; i < controls.length; i++) {
                if (controls[i].type === "text") {
                    obj[controls[i].name] = row.find("." + controls[i].name).val();
                }
                else if (controls[i].type === "rich") {
                    obj[controls[i].name] = htmlEscape(row.find("." + controls[i].name).val().replace("'", "&#39;"));
                }
                else if (controls[i].type === "img") {
                    obj[controls[i].name] = row.find("." + controls[i].name + 'ImageSelector').val();
                }
                else if (controls[i].type === "designer") {
                    var input = row.find("." + controls[i].name);
                    var sanitized = input.val().replace(/'/g, "&#39;");
                    input.val(sanitized);
                    obj[controls[i].name] = htmlEscape(sanitized);
                }
            }
            return obj;
        }

        var setDynamicFieldStartValue = function (control, data, row) {
            if (control.type === "text") {
                row.find("." + control.name).val(data[control.name]);
            }
            else if (control.type === "rich") {
                row.find("." + control.name).val(htmlUnescape(data[control.name]));
                var editor = row.find("." + control.name).cleditor(editorOptions);
                allEditors.push(editor);
                editor.change(setDisplayData);
            }
            else if (control.type === "designer") {
                row.find("." + control.name).val(htmlUnescape(data[control.name]));
                row.find("." + control.name + "_preview").html(htmlUnescape(data[control.name]));
            }
            else if (control.type === "img") {
                var imageId = data[control.name];
                row.find("." + control.name + "ImageSelector").val(imageId);
                var selector = row.find("." + control.name).npsImageSelector();
                if (imageId && imageId !== "" && imageId != -1) {
                    selector.forceUpdate(imageId);
                }
                selector.setRowAction(row, "." + control.name + "ImageSelector");
            }
        }

        var setDisplayData = function () {
            var output = [];
            $.each(displayData.find("li.editItem"), function () {
                var item = generateResponseObject(args.fields, $(this));
                output.push(item);
            })
            submitSection.find("input").val(JSON.stringify(output));
        };

        ///****************************************************** USER INTERACTION FUNCTIONS
        var removeItem = function () {

            if (displayData.find("li.editItem").length > args.min) {
                $(this).closest('li.editItem').remove();
                setDisplayData();
            }
        }

        var addItem = function (replaceEditors) {
            if (displayData.find("li.editItem").length < args.max || args.max === 0) {
                replaceEditors = replaceEditors || false;
                var itemToAdd = $(rowHtml);
                displayData.children("ul").first().append(itemToAdd);
                createRow(itemToAdd);
                itemToAdd.find('.removeRow').click(removeItem);
                itemToAdd.find('input').change(setDisplayData);
                itemToAdd.find(".rowUp").click(shiftRowUp);
                itemToAdd.find(".rowDown").click(shiftRowDown);
                if (replaceEditors) {
                    for (var j = 0; j < args.fields.length; j++) {
                        if (args.fields[j].type === "rich") {
                            var editor = itemToAdd.find("." + args.fields[j].name).cleditor(editorOptions);
                            allEditors.push(editor);
                            editor.change(setDisplayData);
                        }
                        else if (args.fields[j].type === "img") {
                            var selector = itemToAdd.find("." + args.fields[j].name).npsImageSelector();
                            selector.setRowAction(itemToAdd, "." + args.fields[j].name + "ImageSelector");
                        }
                    }
                }
            };
        }

        var shiftRowUp = function (e) {
            var row = $(this).closest('li');
            if (row.prev()) {
                row.after(row.prev());
                setDisplayData();
                refreshEditors();
            }

        }

        var shiftRowDown = function () {
            var row = $(this).closest('li');
            if (row.next()) {
                row.before(row.next());
                setDisplayData();
                refreshEditors();
            }
        }

        var refreshEditors = function () {
            $.each(allEditors, function () {
                this[0].refresh();
            });
        }


        ///****************************************************** SET UP EDITOR
        $(document).ready(function () {
            createRow(displayData.find('li.editItem'));
            window.setTimeout(function () {
                initRows();
            }, 100);

        });

        return displayData;
    }

    $.fn.npsEditorStyle = function() {
        var setCustomWidths = function () {
            $.each($(".widthOptions input:checked"), function () {
                if ($(this).val() == 6) {
                    $(".customWidth").css("display", "block");
                } else {
                     $(".customWidth").css("display", "none");
                }
            });
        }

        setCustomWidths();
        $(".widthOptions input").change(setCustomWidths);
    }
}(jQuery));
