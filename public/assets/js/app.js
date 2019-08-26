$("#scrape").on("click", function() {
    // First, get the lists data
    $.ajax({
        method: "GET",
        url: "/scrape/list"
    })
    .then(function(data) {
        console.log(data);
    })
});

$(".save-book").on("click", function() {
    $("#book-title").empty();
    $("#notes").empty();
    var bookId = $(this).data("id");
    $.ajax({
        method: "GET",
        url: `/api/book/${bookId}`
    })
    .then(function(data) {
        $("#book-title").text(data.title);
        $("#save").attr("data-id", bookId);
        // Display saved notes
        if (data.savedBook.notes) {
            // Place the body of the note in the body textarea
            $("#notes").val(data.savedBook.notes);
          }
    })
    $('#save-display').modal('toggle')
});

$("#save").on("click", function() {
    var bookId = $(this).data("id");
    $.ajax({
        method: "POST",
        url: `/api/savedbook/${bookId}`,
        data: {
            saved: true,
            notes: $("#notes").val(),
            book: bookId
        }
    })
    location.reload();
})

$(".scrape").on("click", function(req, res) {
    $.ajax({
        method: "GET",
        url: "/api/scrape"
    })
    .then(function(response) {
        location.reload();
    })
})