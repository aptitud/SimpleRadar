var SimpleRadar = SimpleRadar || {};

SimpleRadar.Client = (function () {
	var socket = io(),
		drag = d3.behavior.drag().on("drag", dragmove),
		svg = svg || {},
		width = 1024,
		height = 768,
		radius = 10,
		arcRadius = 65,
		arcColors = ["#F8F8F7", "#F3F3F1", "#E7E7E3", "#DBDBD5"],
		lineColor = "#bbb",
		arcLegends = ["Adopt", "Trial", "Assess", "Hold"],
		quadrantLegends = ["Techniques", "Tools", "Platforms", "Languages & Frameworks"],
		mode = 'create',
		blipIdString = 'blip-id-',
		allBlipIdsString = "g[id*='" + blipIdString + "']";

	function redraw() {
		$.ajax({
			type: "Get",
			url: '/api/radars/' + getRadarId(),
			success: function (data, textStatus, jqXHR) {
				console.log('data', data);
				$('#container').empty();

				width = data.size.width - (data.size.width * 0.09);
				height = data.size.height - (data.size.height * 0.09);
				radius = 10;
				arcRadius = 0.114 * Math.min(width, height);

				svg = d3.select("#container").append("div").selectAll("svg")
					.data(d3.range(1).map(function () {
						return {
							x: width / 2,
							y: height / 2
						};
					}))
					.enter().append("svg")
					.attr("width", width)
					.attr("height", height);

				drawRadar();
				drawCrossHair();
				drawArcLegends();
				drawQuadrantLegends();
				drawBlips(data.blips);

				$("#new-blip").keyup(function (event) {
					if (event.keyCode == 13) {
						$("#add-blip").click();
					}
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			contentType: "application/json; charset=utf-8"
		});
	}

	function drawBlips(blips) {
		var snapShotCount = blips.length;
		if (snapShotCount === 0) {
			return;
		}

		var latestSnapShot = blips[snapShotCount - 1];
		var blipCount = latestSnapShot.data.length;
		for (var i = 0; i < blipCount; i++) {
			var blip = latestSnapShot.data[i];
			newBlip(blip);
		}
	}

	function drawRadar() {
		var arcIndex = 0;
		for (var i = 4 * arcRadius; i >= arcRadius; i -= arcRadius) {
			svg.append("circle")
				.attr("r", i)
				.attr("cx", width / 2)
				.attr("cy", height / 2)
				.attr("fill", arcColors[arcIndex++])
				.attr("stroke", lineColor);
		}
	}

	function drawCrossHair() {
		svg.append("line")
			.attr("x1", width / 2)
			.attr("x2", width / 2)
			.attr("y1", height)
			.attr("y2", 0)
			.attr("stroke", lineColor);
		svg.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", height / 2)
			.attr("y2", height / 2)
			.attr("stroke", lineColor);
	}

	function drawArcLegends() {
		for (var i = 0; i <= arcLegends.length; i += 1) {
			svg.append("text")
				.attr("x", width / 2 - ((i + 1) * arcRadius - 5))
				.attr("y", height / 2)
				.text(arcLegends[i]);
		}
	}

	function drawQuadrantLegends() {
		svg.append("text")
			.attr("x", 0)
			.attr("y", 20)
			.text(quadrantLegends[0]);
		svg.append("text")
			.attr("x", width - 40)
			.attr("y", 20)
			.text(quadrantLegends[1]);
		svg.append("text")
			.attr("x", 0)
			.attr("y", height - 20)
			.text(quadrantLegends[2]);
		svg.append("text")
			.attr("x", width - 170)
			.attr("y", height - 20)
			.text(quadrantLegends[3]);
	}

	function dragmove(d) {
		var g = d3.select(this),
			blip = {
				radarId: getRadarId(),
				id: g.attr("id"),
				x: Math.max(radius, Math.min(width - radius, d3.event.x)),
				y: Math.max(radius, Math.min(height - radius, d3.event.y)),
			};

		socket.emit('move blip', blip);
		moveBlip(this);
	}

	function moveBlip(d) {
		d3.select(d).selectAll("circle")
			.attr("cx", d.x = Math.max(radius, Math.min(width - radius, d3.event.x)))
			.attr("cy", d.y = Math.max(radius, Math.min(height - radius, d3.event.y)));
		d3.select(d).selectAll("text")
			.attr("x", d.x = Math.max(radius, Math.min(width - radius, d3.event.x)))
			.attr("y", d.y = Math.max(radius, Math.min(height - radius, d3.event.y)));
	}

	function newBlip(blip) {
		if (!isThisRadar(blip)) {
			return;
		}

		var g = svg.append("g").call(drag).on("click", blipClick);
		g.attr("id", blipIdString + blip.id);
		g.append("circle")
			.attr("r", radius)
			.attr("cx", blip.x)
			.attr("cy", blip.y)
			.attr("fill", "#fff")
			.attr("stroke", lineColor);

		g.append("text")
			.attr("x", blip.x)
			.attr("y", blip.y)
			.text(blip.text);
	}

	function blipClick(g) {
		if (mode === "delete") {
			var blip = {
				radarId: getRadarId(),
				id: $(this).attr('id'),
			};

			socket.emit('delete blip', blip);
			deleteBlip(blip);
		}
	}

	function deleteBlip(blip) {
		if (!isThisRadar(blip)) {
			return;
		}

		$('#' + blip.id).remove();
	}

	function getRadarId() {
		return window.location.pathname.replace('/radars/', '');
	}

	function isThisRadar(blip) {
		return getRadarId() === blip.radarId;
	}

	function getMaxBlipId() {
		var blipCount = $(allBlipIdsString).length;
		if (blipCount === 0)
			return 0;

		var maxBlipId = $(allBlipIdsString)[blipCount - 1].id.replace(blipIdString, '');

		return parseInt(maxBlipId) + 1;
	}

	function addBlip() {
		var text = $('#new-blip').val();
		if (text.length === 0)
			return;

		var blip = {
			radarId: getRadarId(),
			id: getMaxBlipId(),
			text: text,
			x: width / 2,
			y: height / 2
		};

		socket.emit('new blip', blip);
		newBlip(blip);
		$('#new-blip').val('');
	}

	socket.on('new blip', function (blip) {
		newBlip(blip);
	});

	socket.on('move blip', function (blip) {
		if (!isThisRadar(blip)) {
			return;
		}
		var id = '#' + blip.id,
			circle = $(id + ' > circle'),
			text = $(id + ' > text');

		circle.attr("cx", blip.x);
		circle.attr("cy", blip.y);
		text.attr("x", blip.x);
		text.attr("y", blip.y);
	});

	socket.on('delete blip', function (blip) {
		deleteBlip(blip);
	});

	function saveRadar() {
		var blips = $(allBlipIdsString),
			data = {
				blips: []
			};

		for (var i = 0; i < blips.length; i++) {
			var id = '#' + blipIdString + i,
				circle = $(id + ' > circle'),
				text = $(id + ' > text');
			var blip = {
				radarId: getRadarId(),
				id: i,
				text: text.text(),
				x: circle.attr('cx'),
				y: circle.attr('cy')
			};
			data.blips.push(blip);
		}

		$.ajax({
			data: JSON.stringify(data),
			type: "PUT",
			url: '/api/radars/' + getRadarId(),
			success: function (data, textStatus, jqXHR) {
				console.log('success');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			contentType: "application/json; charset=utf-8"
		});
	}

	function changeMode() {
		mode = $('input:checked').attr('id');
		if (mode === 'create') {
			$('#add-blip').removeClass('disabled');
			$('#new-blip').prop('disabled', false);
		}

		if (mode === 'delete') {
			$('#add-blip').addClass('disabled');
			$('#new-blip').prop('disabled', true);
		}
	}

	$('[data-toggle="tooltip"]').tooltip();
	redraw();

	return {
		addBlip: addBlip,
		redraw: redraw,
		saveRadar: saveRadar,
		changeMode: changeMode
	};
})();