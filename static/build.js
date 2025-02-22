function buildIndex(index){
    const xhttp = new XMLHttpRequest();
    xhttp.responseType = "document";
    
    for (const entry of index){
        const link = entry.querySelector("." + layout.main.classes.entry + " a"),
              content = document.createElement("div");
        
        content.className = layout.main.classes.content;
        entry.appendChild(content);
        content.attributes.is_expanded = false;
        content.style.display = "none";

        link.addEventListener("click", ev => {
            ev.preventDefault();
            entryOnClick(link, link.href, {
                content: content
            });
        });
    }
}


function buildControlPanel(index, control){
    const tag_container = document.getElementById(layout.control.widget_ids.tags),
          date_container = document.getElementById(layout.control.widget_ids.dates),
          tags = new Set([...document.querySelectorAll("."+layout.main.classes.tag_selected)].map(e=>e.innerText));

    for (name of tags){
        const tag = document.createElement("input"),
              tag_label = document.createElement("label");

        tag.type = "checkbox";
        tag.name = name;
        tag.id = "tag_checkbox_" + name;
        tag.value = name;
        //tag.style.display = "none";
        tag.className = "Hidden";
        tag.checked = true;

        tag_label.htmlFor = tag.id;
        tag_label.innerText = name;
        tag_label.className = layout.main.classes.tag;
        
        tag_container.appendChild(tag);
        tag_container.appendChild(tag_label);
    }

    const start = document.getElementsByName(layout.control.input_names.start_date)[0],
          stop = document.getElementsByName(layout.control.input_names.stop_date)[0],
          timestamp_start = index[index.length-1].getElementsByClassName(layout.main.classes.date)[0],
          timestamp_stop = index[0].getElementsByClassName(layout.main.classes.date)[0];

    start.value = callbacks.entry_get_date(timestamp_start);
    stop.value = callbacks.entry_get_date(timestamp_stop);
}


(() => {
    const index = document.getElementsByClassName(layout.main.classes.entry),
          control = document.getElementById(layout.control.id);

    buildIndex(index);
    buildControlPanel(index, control);
})();
