/*
 * © 2023 Jon Rabe, jonrabe@jonr.net
 */



function main({
    endpoints = []
}={}){
    const api_root = "src/php/main.php/api/";
    const index_cmd = "/buildindex";

    let make_outline = makeOutline();
    let make_tag_filter = makeTagFilter();

    for (let endpoint of endpoints){
        request(api_root+endpoint+index_cmd, "GET").then(
            (outline)=>{
                make_outline.addEntries(outline);
                make_outline.sortEntries();
                make_outline.pushEntries();
                let notelist = make_outline.entries;

                make_tag_filter.addTagButtons(outline.tags, notelist);
                toggleAllTags(make_tag_filter.tag_buttons, notelist);
                dateFilter(notelist);
            }
        );
    }
}
