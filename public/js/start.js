var SimpleRadar = SimpleRadar || {};

SimpleRadar.Start = (function () {
	function newRadar() {
		var data = {
			size: $('input:checked').attr('id')
		};
		$.ajax({
			data: JSON.stringify(data),
			type: "POST",
			url: '/radars',
			success: function (data, textStatus, jqXHR) {
				var link = window.location.href + 'radars/' + data._id;
				$('#success-link').attr('href', link);
				$('#success-share').attr('href', 'mailto:?subject=Our technology radar&body=Lets collaborate around our very own technology radar ' + link);
				$('#alert-link').attr('href', link);
				$('#alert-share').attr('href', 'mailto:?subject=Our technology radar&body=Lets collaborate around our very own technology radar ' + link);
				$('#new-radar').prop('disabled', true);
				$('.alert-success').fadeIn(1000);
				$('.alert-info').fadeIn(1000);
				$('#goto-radar').fadeIn(1000);
				$('#share-radar').fadeIn(1000);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$('.alert-danger').fadeIn(1000);
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			contentType: "application/json; charset=utf-8"
		});
	}

	return {
		newRadar: newRadar
	};

})();