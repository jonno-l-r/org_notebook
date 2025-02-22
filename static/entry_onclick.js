function entryOnClick(
    element, endpoint, {
        content=null,
        content_id=null
    } = {}
){
    const xhttp = new XMLHttpRequest();
    xhttp.responseType = "document";

    if (content_id)
        content = document.getElementById(content_id);
    
    if (!content.attributes.is_expanded) {
        xhttp.open("GET", endpoint);
        xhttp.onload = () => {
            content.innerHTML = callbacks.entry_onload_get_innerHTML(xhttp.responseXML);
            content.attributes.is_expanded = true;
            content.style.display = "";

            callbacks.entry_onload(content, endpoint);
            callbacks.entry_format_open(element);

            // Mathjax
            MathJax.Hub.Queue(
                ["resetEquationNumbers", MathJax.InputJax.TeX],
                ["PreProcess", MathJax.Hub],
                ["Reprocess", MathJax.Hub]
            );
        };
        xhttp.send();
    }
    else {
        content.innerHTML = "";
        content.attributes.is_expanded = false;
        content.style.display = "none";
        
        callbacks.entry_format_close(element);
    }
    
    return false;
}
