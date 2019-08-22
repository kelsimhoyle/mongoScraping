$("#scrape").on("click", function() {
    // First, get the lists data
    $.ajax({
        method: "GET",
        url: "/scrape/list"
    })
    .then(function(data) {
        console.log(data);
    })

})