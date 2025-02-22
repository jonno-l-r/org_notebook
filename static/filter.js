function filter(index, form, ...filters){
    const form_data = new FormData(form);    
    
    for (const entry of index) {
        if (!entry.id)
            entry.style.display = filters.every(f => f(form_data, entry)) ? "" : "none";
    }

    return false;
}


function tagFilter(form_data, entry){
    const tags = [...entry.getElementsByClassName(layout.main.classes.tag_wrapper)],
          mode = form_data.get("filter"),
          selected_tags = callbacks.control_get_tag_keys(form_data),
          filter = tag => {
              const match = form_data.get(callbacks.entry_get_tag_id(tag));
              
              tag.children[0].className = match ?
                  layout.main.classes.tag_selected:
                  layout.main.classes.tag;
              
              return match;
          };

    if (mode == layout.control.input_values.mode.subset)
        return tags.every(filter);
    else if (mode == layout.control.input_values.mode.intersection)
        return tags.filter(filter).length > 0;
    else
        return (tags.filter(filter).length == selected_tags.length) && selected_tags.length > 0;
}


function dateFilter(form_data, entry){
    const start_date = form_data.get(layout.control.input_names.start_date) ?
          new Date(form_data.get(layout.control.input_names.start_date)) : null,
          
          stop_date = form_data.get(layout.control.input_names.stop_date) ?
          new Date(form_data.get(layout.control.input_names.stop_date)) : null,

          // TODO: Put in callback
          timestamp = entry.querySelector("." + layout.main.classes.date),
          entry_date = new Date(callbacks.entry_get_date(timestamp));

    if (start_date && stop_date)
        return (entry_date >= start_date) && (entry_date <= stop_date);
    else if (start_date)
        return entry_date >= start_date;
    else if (stop_date)
        return entry_date <= stop_date;
    else
        return true;
}



(() => {
    const index = document.getElementsByClassName(layout.main.classes.entry),
          form = document.getElementById(layout.control.id),
          filter_closure = e => filter(
              index, form,
              tagFilter,
              dateFilter
          );

    form.querySelectorAll(layout.control.selectors.tags).forEach(
        button => button.addEventListener("change", filter_closure)
    );

    form.querySelectorAll(layout.control.selectors.mode).forEach(
        button => button.addEventListener("change", filter_closure)
    );

    form.querySelector(layout.control.selectors.invert).addEventListener("click", e => {
        e.preventDefault();
        
        form.querySelectorAll(layout.control.selectors.tags).forEach(tag => {
            tag.checked = !tag.checked;
        });

        return filter_closure(e);
    });

    form.querySelectorAll(layout.control.selectors.dates).forEach(
        e => e.addEventListener("change", filter_closure)
    );

    form.querySelector(layout.control.selectors.reset).addEventListener("click", e => {
        e.preventDefault();
        location.reload();
    });
})();
