var SimpleRadar = SimpleRadar || {};

SimpleRadar.Client = (function () {
	var socket = io();
	var width = 800,
		height = 800,
		radius = 10;

	var drag = d3.behavior.drag()
		.on("drag", dragmove);


	var svg = d3.select("body").append("div").selectAll("svg")
		.data(d3.range(1).map(function () {
			return {
				x: width / 2,
				y: height / 2
			};
		}))
		.enter().append("svg")
		.attr("width", width)
		.attr("height", height);

	function buildRadar() {
		for (var i = 100; i < 500; i += 100) {
			svg.append("circle")
				.attr("r", i)
				.attr("cx", width / 2)
				.attr("cy", height / 2)
				.attr("fill", "transparent")
				.attr("stroke", "#ccc");
		}
	}

	function buildCrossHair() {
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
		var g = svg.append("g").call(drag);
		g.attr("id", "blip-id-" + blip.id);
		g.append("circle")
			.attr("r", radius)
			.attr("cx", function (d) {
				return blip.x;
			})
			.attr("cy", function (d) {
				return blip.y;
			})
			.attr("fill", "#ccc")
			.attr("stroke", "#ccc");

		g.append("text")
			.attr("x", function (d) {
				return blip.x;
			})
			.attr("y", function (d) {
				return blip.y;
			})
			.text(blip.text);
	}

	function addBlip() {
		var text = $('#new-blip').val(),
			blipId = $("g[id*='blip-id-']"),
			blip = {
				id: blipId.length,
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
		var id = '#' + blip.id,
			circle = $(id + ' > circle'),
			text = $(id + ' > text');

		circle.attr("cx", blip.x);
		circle.attr("cy", blip.y);
		text.attr("x", blip.x);
		text.attr("y", blip.y);
	});

	buildRadar();
	buildCrossHair();

	return {
		addBlip: addBlip
	};
})();