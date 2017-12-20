




function AddSucessNotification(element,message) {
    $("#NoticerContainer").append('<div class="alert alert-success" role="alert"><strong>success</strong></div>');
    $('#NoticerContainer').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST'
        });
    });


}
