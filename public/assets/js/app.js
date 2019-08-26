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
        if (data.saved.notes) {
            // Place the body of the note in the body textarea
            $("#notes").val(data.saved.notes);
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
    .then(function(response) {
        location.reload();
    })
})

$(".delete-book").on("click", function() {
    var saveId = $(this).data("id");
    console.log(saveId)
    $.ajax({
        method: "DELETE",
        url: `/api/deletebook/${saveId}`
    })
    .then(function(response) {
        location.reload();
    })
})

$(".edit-note").on("click", function() {
    $("#book-title").empty();
    $("#notes").empty();
    var noteId = $(this).data("id");
    $.ajax({
        method: "GET",
        url: `/api/savedbook/${noteId}`
    })
    .then(function(data) {
        $("#book-title").text(data[0].book.title);
        $("#update").attr("data-id", noteId)
         // Display saved notes
         if (data[0].notes) {
            // Place the body of the note in the body textarea
            $("#notes").val(data[0].notes);
          }
    })
})

$("#update").on("click", function() {
    var noteId = $(this).data("id");
    $.ajax({
        method: "POST",
        url: `/api/savedbook/note/update/${noteId}`,
        data: {
            notes: $("#notes").val()
        }
    })
    .then(function(response) {
        location.reload();
    })
})

$(".delete-note").on("click", function() {
    var noteId = $(this).data("id");
    $.ajax({
        method: "POST", 
        url: `/api/savedbook/note/delete/${noteId}`
    })
    .then(function(response) {
        location.reload();
    })
})

$(".scrape").on("click", function(req, res) {
    $.ajax({
        method: "GET",
        url: "/api/scrape"
    })
    .then(function(response) {
        window.location = "/viewlists";
    })
})

$(".clear").on("click", function(req, res) {
    $.ajax({
        method: "GET", 
        url: "/api/clear"
    })
    .then(function(response) {
        location.reload();
    })
})

$(".view-saved").on("click", function(req, res) {
    window.location = "/savedbooks"
})

$(".view-list").on("click", function(req, res) {
    window.location = "/viewlists"
})