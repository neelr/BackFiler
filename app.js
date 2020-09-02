var docx2html = require('docx2html')
docx2html("c:/temp/test.docx").then(function (html) {
    html.toString()
})