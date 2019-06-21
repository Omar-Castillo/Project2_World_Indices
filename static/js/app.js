//SVG dimensions are determined by current width and height of the browser window
var svgWidth = 2000
var svgHeight = 1000;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

//create min and max variables for zoom
var zoommin;
var zoommax;

//create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#map-id")
    .append("svg")
    .attr("height", height)
    .attr("width", width);
svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');

//D3 has some internal functionality that can turn GeoJSON data into screen coordinates based on the projection you set.
// This is not unlike other libraries such as Leaflet, but the result is much more open-ended, not constrained to shapes on a tiled Mercator map.1 So, yes, D3 supports projections.
var projection = d3.geoEquirectangular()
                    .center([0,15])
                    .scale([width / (2 * Math.PI)]) // scale to fit group width
                    .translate([width / 2, height / 2]); // ensure centred in group
                  

var path = d3.geoPath()
    .projection(projection);

//better to use function instead of arrow method
d3.json("../Data/world-countries-topo.json").then(function(topology)  {
    // if (error) throw error;
    console.log(topology)

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.custom).features)
        .enter()
        .append("path")
        .attr("class", "land-boundary")        
        .attr("d", path)
            .on("mouseover", function(d) {
                // console.log(d)
                d3.select(this).style("fill","#30BCED")
                    .append("title")
                    // .class("id", "#countryLabel")
                    .text(d.properties.name)
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill","#ccc")
            })

    //create the zoom effect: Below is d3 v3 version
    // var zoom = d3.behavior.zoom()
    //   .on("zoom", function() {
    //     svg.attr("transform", "translate(" +
    //       d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
    //     g.selectAll("path")
    //       .attr("d", path.projection(projection));
    //   });
    // svg.call(zoom);

    //attempt at zoom v5
    var zoom = d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform)
    });
    svg.selectAll("path")
        .attr("d", path.projection(projection));
    svg.call(zoom);
    
    

}).catch(function(error){console.log(error)}) 