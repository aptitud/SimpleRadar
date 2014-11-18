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
		arcLegends = ["Adopt", "Trial", "Assess", "Hold"],
		quadrantLegends = ["Techniques", "Tools", "Platforms", "Languages & Frameworks"];

	function redraw() {
		$.ajax({
			type: "Get",
			url: '/api/radars/' + getRadarId(),
			success: function (data, textStatus, jqXHR) {
				$('#container').empty();

				width = data.size.width - (data.size.width * 0.09);
				height = data.size.height - (data.size.height * 0.09);
				radius = 10;
				arcRadius = 0.12 * Math.min(width, height);

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
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			contentType: "application/json; charset=utf-8"
		});
	}

	function drawRadar() {
		var arcIndex = 0;
		for (var i = 4 * arcRadius; i >= arcRadius; i -= arcRadius) {
			svg.append("circle")
				.attr("r", i)
				.attr("cx", width / 2)
				.attr("cy", height / 2)
				.attr("fill", arcColors[arcIndex++])
				.attr("stroke", "#ccc");
		}
	}

	function drawCrossHair() {
		svg.append("line")
			.attr("x1", width / 2)
			.attr("x2", width / 2)
			.attr("y1", height)
			.attr("y2", 0)
			.attr("stroke", "#ccc");
		svg.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", height / 2)
			.attr("y2", height / 2)
			.attr("stroke", "#ccc");
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

		var g = svg.append("g").call(drag);
		g.attr("id", "blip-id-" + blip.id);
		g.append("circle")
			.attr("r", radius)
			.attr("cx", blip.x)
			.attr("cy", blip.y)
			.attr("fill", "#ccc")
			.attr("stroke", "#ccc");

		g.append("text")
			.attr("x", blip.x)
			.attr("y", blip.y)
			.text(blip.text);
	}

	function getRadarId() {
		return window.location.pathname.replace('/radars/', '');
	}

	function isThisRadar(blip) {
		return getRadarId() === blip.radarId;
	}

	function addBlip() {
		var blipId = $("g[id*='blip-id-']"),
			blip = {
				radarId: getRadarId(),
				id: blipId.length,
				text: $('#new-blip').val(),
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

	function saveRadar() {

	}

	redraw();

	return {
		addBlip: addBlip,
		redraw: redraw,
		saveRadar: saveRadar
	};
})();