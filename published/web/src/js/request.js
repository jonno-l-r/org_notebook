/*
 * 2023 Jon Rabe, jonrabe@jonr.net
 */



function request(url, method, {
    data = null,
    response_type = "json"
}={}){
    if (data) {
    let params = "/?";
        for (let key in data){
            params = params +
                key + "=" + data[key] + "&";
        }        
        url = url + params;
    }

    return new Promise(
        (resolve, reject) => {
            const h = new XMLHttpRequest();
            h.open(method, url, true);
            h.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            h.onload = function() {
                if (h.status >= 200 && h.status < 300){
                    if (response_type == "json"){
                        resolve(JSON.parse(this.responseText));
                    }
                    else if (response_type == "document"){
                        dom = new DOMParser();
                        resolve(dom.parseFromString(this.responseText, "text/html"));
                    }
                    else {
                        resolve(this.responseText);
                    }

                }
                else {
                    reject(h.status);
                }
            };
            h.send();
        });
}
