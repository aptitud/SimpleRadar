/*
function init(h,w,padding) {
    $('#title').text(document.title);

    var radar = new pv.Panel()
        .width(w)
        .height(h)
        .canvas('radar')

    var radar_arcs = [
        {r: 100, name: "adopt", bgcolor: "#fafafa"}
        ,
        {r: 200, name: "trial", bgcolor: "#ccc"}
        ,
        {r: 300, name: "assess", bgcolor: "#aaa"}
        ,
        {r: 400, name: "hold", bgcolor: "#999"}
    ].reverse();

    var radar_data = [
        { "quadrant": "Techniques",
            "left": 45,
            "top": 18,
            "color": "#8FA227",
            "items": [
                {"name": "Database based Integration", "pc": {"r": 350, "t": 135}, "movement": "t", "blipSize": 700},
                {"name": "Scrum certification", "pc": {"r": 350, "t": 95}, "movement": "c", "url": "http://www.google.com"},
                {"name": "Incremental data warehousing", "pc": {"r": 250, "t": 165}, "movement": "c"},
                {"name": "DevOps", "pc": {"r": 250, "t": 110}, "movement": "c"},
                {"name": "Polygot Programming", "pc": {"r": 180, "t": 170}, "movement": "c"},
                {"name": "Automation of technical tests", "pc": {"r": 180, "t": 155}, "movement": "c"},
                {"name": "Capability modelling", "pc": {"r": 180, "t": 125}, "movement": "c"},
                {"name": "Service choreography", "pc": {"r": 180, "t": 105}, "movement": "c"},
                {"name": "Continuous deployment", "pc": {"r": 180, "t": 100}, "movement": "c"},
                {"name": "Evolutionary architecture", "pc": {"r": 120, "t": 95}, "movement": "c"},
                {"name": "Coding architects", "pc": {"r": 90, "t": 170}, "movement": "c"},
                {"name": "Visualisation and metrics", "pc": {"r": 80, "t": 150}, "movement": "c"},
                {"name": "Web as platform", "pc": {"r": 80, "t": 110}, "movement": "c"},
                {"name": "Emergent design", "pc": {"r": 80, "t": 100}, "movement": "c"},
                {"name": "Evolutionary database", "pc": {"r": 70, "t": 170}, "movement": "c"},
                {"name": "Platform roadmaps", "pc": {"r": 30, "t": 100}, "movement": "c"},
                {"name": "Build pipelines", "pc": {"r": 30, "t": 160}, "movement": "c"}
            ]
        }
    ];

    function polar_to_cartesian(r,t) {
        //radians to degrees, requires the t*pi/180
        var x = r * Math.cos((t*Math.PI/180));
        var y = r * Math.sin((t*Math.PI/180));
        return [x,y];
    }

    function cartesian_to_raster(x,y) {
        var rx = w/2 + x;
        var ry = h/2 + y;
        return [rx,ry];
    }

    function raster_to_cartesian(rx,ry) {
        var x = rx - w/2;
        var y = ry - h/2;
        return [x,y];
    }

    function polar_to_raster(r,t) {
        var xy= polar_to_cartesian(r,t);
        return cartesian_to_raster(xy[0], xy[1]);
    }

// arcs
    radar.add(pv.Dot)
        .data(radar_arcs)
        .left(w/2)
        .bottom(h/2)
        .radius(function(d){return d.r;})
        .strokeStyle("#ccc")
        .fillStyle(function(d){return d.bgcolor;})
        .anchor("top")
        .add(pv.Label).text(function(d) { return d.name;});

//quadrant lines -- vertical
    radar.add(pv.Line)
        .data([(h/2-radar_arcs[0].r) - padding,h-(h/2-radar_arcs[0].r) + padding])
        .lineWidth(1)
        .left(w/2)
        .bottom(function(d) {return d;})
        .strokeStyle("#ccc");

    //quadrant lines -- horizontal
    radar.add(pv.Line)
        .data([(w/2-radar_arcs[0].r) - padding,w-(w/2-radar_arcs[0].r) + padding])
        .lineWidth(1)
        .bottom(h/2)
        .left(function(d) {return d;})
        .strokeStyle("#ccc");


// blips
    var total_index=1;
    for (var i = 0; i < radar_data.length; i++) {
        radar.add(pv.Dot)
            .def("active", false)
            .data(radar_data[i].items)
            .size( function(d) { return ( d.blipSize !== undefined ? d.blipSize : 70 ); })
            .left(function(d) { var x = polar_to_raster(d.pc.r, d.pc.t)[0];
                console.log("name:" + d.name + ", x:" + x);
                return x;})
            .bottom(function(d) { var y = polar_to_raster(d.pc.r, d.pc.t)[1];
                console.log("name:" + d.name + ", y:" + y);
                return y;})
            .title(function(d) { return d.name;})
            .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })
            .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}})
            .angle(45)
            .strokeStyle(radar_data[i].color)
            .fillStyle(radar_data[i].color)
            .shape(function(d) {return (d.movement === 't' ? "triangle" : "circle");})
            .anchor("center")
            .add(pv.Label)
            .text(function(d) {return total_index++;})
            .textBaseline("middle")
            .textStyle("white")
            .event('mousedown', function (d) {
             console.log(d);
            })
            .event('drag', function(d){ console.log(d); });
    }


    */
/*//*
/Quadrant Ledgends
    var radar_quadrant_ctr=1;
    for (var i = 0; i < radar_data.length; i++) {
        radar.add(pv.Label)
            .left( radar_data[i].left )
            .top( radar_data[i].top )
            .text(  radar_data[i].quadrant )
            .strokeStyle( radar_data[i].color )
            .fillStyle( radar_data[i].color )
            .font("18px sans-serif")
            .add( pv.Dot )
            .def("i", radar_data[i].top )
            .data(radar_data[i].items)
            .top( function() { return ( this.i() + 18 + this.index * 18 );} )
            .shape( function(d) {return (d.movement === 't' ? "triangle" : "circle");})
            .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })
            .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}})
            .size(10)
            .angle(45)
            .anchor("right")
            .add(pv.Label)
            .text(function(d) {return radar_quadrant_ctr++ + ". " + d.name;} );
    }*//*


    radar.anchor('radar');
    radar.render();

};*/
