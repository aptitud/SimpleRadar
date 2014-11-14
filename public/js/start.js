var SimpleRadar = SimpleRadar || {};

SimpleRadar.Start = (function () {
	function newRadar() {
		$.ajax({
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
			dataType: 'json'
		});
	}

	return {
		newRadar: newRadar
	};

})();