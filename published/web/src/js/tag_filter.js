/*
 * 2023 Jon Rabe, jonrabe@jonr.net
 */



function makeTagFilter() {
    return {
        tag_buttons: [],

        addTagButtons: function (taglist, notelist) {
            for (_tag in taglist) {
                if (!this.getTagButtonNames().includes(_tag)) {
                    let tag = _makeTagButton(_tag);
                    tag.node.onclick = ()=>{
                        tag.toggle_select();
                        _filter(notelist, {
                            tag: tag
                        });
                    };

                    this.tag_buttons.push(tag);
                }
            }
        },

        getTagButtonNames: function() {
            return this.tag_buttons.map(
                e => e.name
            );
        }
    };
}


function toggleAllTags(tagbuttons, notelist){
    let button = document.getElementById("toggle-all-tags");
    button.onclick = ()=>{
        let state = button.innerText=="all off";

        for (tagbutton of tagbuttons){
            if (state){
                tagbutton.off();
                button.innerText = "all on";
            }
            else {
                tagbutton.on();
                button.innerText = "all off";
            }

            _filter(notelist, {
                tag: tagbutton
            });
        }
    };
}


function dateFilter(notelist){
    let date_start = document.getElementById("date-start"),
        date_stop = document.getElementById("date-stop"),

        callback = ()=>{
            _filter(notelist, {
                date_start: date_start.valueAsDate,
                date_stop: date_stop.valueAsDate
            });
        };

    date_start.onchange = callback;
    date_stop.onchange = callback;
}


function _filter(notelist, {
    tag = null,
    date_start = null,
    date_stop = null
}={}){
    let filter_mode = _getFilterMode();

    for (note of notelist){
        if (tag && tag.name in note.tag_filters) {
            note.tag_filters[tag.name] = tag.selected;
        }

        if (date_start && note.timestamp<date_start){
            note.date_filter = false;
        }
        else if (date_stop && note.timestamp>date_stop) {
            note.date_filter = false;
        }
        else {
            note.date_filter = true;
        }

        note.filter(
            filter_mode
        );
    }
}


function _getFilterMode(){
    let buttons = document.getElementsByName("tag-filter-mode");
    let mode;

    for (button of buttons){
        if (button.checked) {
            mode = button.value;
        }
    }

    return mode;
}


function _makeTagButton(_tag){
    let tag = document.createElement("button");
    tag.className = "tag";
    tag.innerText = _tag;

    let widget = document.getElementById("tag-filter");
    widget.append(tag);

    return {
        node: tag,
        name: _tag,
        selected: true,

        toggle_select: function(){
            this.selected ?
                this.off() : this.on();
        },

        on: function(){
            this.node.className = "tag";
            this.selected = true;
        },

        off: function(){
            this.node.className = "tag-unselected";
            this.selected = false;
        }
    };
}
