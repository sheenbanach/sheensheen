var editorOptions = {
    width: '90%',
    height: 250,
    controls:
             "bold italic underline strikethrough subscript superscript | " +
             "style | color removeformat | bullets numbering | outdent " +
             "indent | alignleft center alignright justify | undo redo | " +
             "rule image link unlink | cut copy paste pastetext | print source | table",
    styles:
      [["Paragraph", "<p>"], ["Page Highlight", "<h4>"], ["Read More Link", "<h6>"], ["Header 2", "<h2>"],
        ["Header 3", "<h3>"], ["Header 4", "<h4>"], ["Header 5", "<h5>"],
        ["Header 6", "<h6>"]],
    docCSSFile: "/StyleSheetsV9/CleditorWYSIWYG.css",
    useCSS: true
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(value) {
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}