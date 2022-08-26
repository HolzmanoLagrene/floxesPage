$('#search_terms').tagsInput({
    'width': 'auto',
    'delimiter': ',',
    'defaultText': '',
    "allowDuplicates": false,
    onAddTag: function (item) {
        $($(".tagsinput").get(0)).find(".tag").each(function () {
            if (!validateTerm($(this).text().trim().split(/(\s+)/)[0])) {
                $(this).addClass("badtag");
            }
        });
    },
    'onChange': function (item) {
        $($(".tagsinput").get(0)).find(".tag").each(function () {
            if (!validateTerm($(this).text().trim().split(/(\s+)/)[0])) {
                $(this).addClass("badtag");
            }
        });
    }

});


function validateTerm(term) {
    has_only_chars = /^[A-Za-z\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]+$/.test(term);
    does_not_contain_and = !term.toLowerCase().includes("and")
    does_not_contain_or = !term.toLowerCase().includes("or")
    return has_only_chars && does_not_contain_or && does_not_contain_and
}
