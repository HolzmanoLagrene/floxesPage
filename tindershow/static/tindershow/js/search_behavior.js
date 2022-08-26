function sendJobRequest(e, form) {
    e.preventDefault();
    document.getElementById('navbarToggleExternalContent').classList.toggle("show")
    const output = document.getElementById('jobRequestForm');
    const formData = new FormData(form);
    $.ajax({
        url: "submitForm",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        beforeSend: function () {
            document.getElementById("updateStatusText").innerHTML = "Updating ...";
            document.getElementById("updateStatusProgress").classList.toggle("progress-bar-striped")
            document.getElementById("updateStatusProgress").classList.toggle("progress-bar-animated")
        },
        success: (data) => {
            document.getElementById("updateStatusText").innerHTML = "Updated on " + data["last_updated_on"];
            document.getElementById("updateStatusProgress").classList.toggle("progress-bar-striped")
            document.getElementById("updateStatusProgress").classList.toggle("progress-bar-animated")
            loadCards(number_of_max_cards)
        },
        error: (error) => {
            document.getElementById("updateStatusText").innerHTML = "Error while updating...try later again";
            document.getElementById("updateStatusProgress").toggleAttribute("bg-error")
        }
    });
}