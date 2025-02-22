const layout = {
    main: {
        id: "main_window",
        classes: {
            entry: "EntryContainer",
            heading: "HeadingContainer",
            content: "NoteContainer",
            link: "EntryHeading",
            tag_wrapper: "TagButtonWrapper",
            tag: "TagButton",
            tag_selected: "TagButtonSelected",
            date: "timestamp"
        }
    },
    
    control: {
        id: "control_panel",
        classes: {
            widget: "ControlWidget"
        },
        widget_ids: {
            tags: "tag_widget",
            mode: "filter_mode",
            dates: "date_widget"
        },
        input_names: {
            mode: "filter",
            start_date: "start_date",
            stop_date: "stop_date",
        },
        input_values: {
            mode: {
                intersection: "intersection",
                subset: "subset",
                superset: "superset"
            }
        },
        selectors: {
            tags: "input[type=checkbox]",
            mode: "input[type=radio]",
            dates: "input[type=date]",
            invert: "input[value=Invert]",
            reset: "input[value=Reset]"
        }
    }
};


const callbacks = {
    entry_onload_get_innerHTML: function(responseXML){
        return responseXML.getElementById("content").innerHTML;
    },
    
    entry_onload: function(content, endpoint){
        [...content.getElementsByTagName("img")].forEach(img => {
            var url = endpoint.split("/");
            url = url.slice(0, url.length-1);
            url.push(img.getAttribute("src"));
            
            img.src = url.join("/");
        });
    },

    entry_format_open: function(link){},
    entry_format_close: function(link){},

    entry_get_tag_id: function(tag){
        return tag.dataset.tagId;
    },

    entry_get_date: function(timestamp){
        const re = /\d{4}-\d\d-\d\d/;
        return re.exec(timestamp.innerText)[0];
    },

    control_get_tag_keys: function(form_data){
        const tag_keys = [];
        form_data.forEach((v,k) => {
            if (k == v)
                tag_keys.push(v);
        });

        return tag_keys;
    }
};



