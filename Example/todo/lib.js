var todo = ted.define("todo", []);

ted.create(todo, function() {
    var
        $ = this,
        lists = $.find("list"),
        insert = $.find("insert"),
        remove = $.find("remove");

    $.html("");

    var
        TEXT = tedApi.elm("<input type='text' />"),
        BOX = tedApi.elm("<div/>"),
        IN = tedApi.elm("<input type='button' value='" + (insert.count != 0 ? insert[0].innerHTML : "Insert") + "' />"),
        DEL = tedApi.elm("<input type='button' value='" + (remove.count != 0 ? remove[0].innerHTML : "Remove") + "' />");

    $.append(TEXT);
    $.append(BOX);
    $.append(IN);
    $.append(DEL);


    function add(text) {
        if (text.trim() == "") return 0;
        var pat = "<p><input type='checkbox'/> " + text.trim() + " </p>";
        tedApi.append(
            BOX,
            tedApi.elm(pat)
        )
    }

    function dell(elm) {
        tedApi.delete(
            tedApi.parent(elm)
        );
    }

    //Initial The List
    lists.each(function(i) {
        add(this[i].innerHTML);
    });

    //Button Onclick
    tedApi.bind(IN, "click", function() {
        add(TEXT.value);
    });
    tedApi.bind(DEL, "click", function() {
        var Sel = $.find(":checked");

        Sel.each(function(i) {

            dell(this[i]);

        });
    });


    //Responsive to insert the element(list) from outside
    $.bind("inchange:list", function(data) {
        if (data.type == "add") {
            data.value.each(function(i) {
                add(this[i].innerHTML);
                tedApi.delete(this[i]);
            });
        }
    });

    $.show();
});