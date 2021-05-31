// import React from "react";
// import "../styles/Map.css"
// import * as d3 from "d3"
// import * as topojson from "topojson-client";
// import Background from "./Background";



// class Map extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     componentDidMount (){
//         this.drawChart()
//     }

//     componentDidUpdate (){
//         d3.selectAll(".map-svg-final")
//         .remove()
//         .exit()

//         this.drawChart();
//     }

//     drawChart = () => {
//         d3.csv("vaccination.csv", function(err, data) {
//             //console.log(data);
//             var config = {"color1":"#E6E0FF","color2":"#574b90","stateDataColumn":"state_or_territory","valueDataColumn":"total_vaccination_count"}
    
//             var WIDTH = 1050, HEIGHT = 570;
            
//             var COLOR_COUNTS = 9;
            
//             var SCALE = 1.1;
            
//             function Interpolate(start, end, steps, count) {
//                 var s = start,
//                     e = end,
//                     final = s + (((e - s) / steps) * count);
//                 return Math.floor(final);
//             }

//             function Color(_r, _g, _b) {
//                 var r, g, b;
//                 var setColors = function(_r, _g, _b) {
//                     r = _r;
//                     g = _g;
//                     b = _b;
//                 };
            
//                 setColors(_r, _g, _b);
//                 this.getColors = function() {
//                     var colors = {
//                         r: r,
//                         g: g,
//                         b: b
//                     };
//                     return colors;
//                 };
//             }
            
//             function hexToRgb(hex) {
//                 var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//                 return result ? {
//                     r: parseInt(result[1], 16),
//                     g: parseInt(result[2], 16),
//                     b: parseInt(result[3], 16)
//                 } : null;
//             }
            
//             function valueFormat(d) {
//               if (d > 1000000000) {
//                 return Math.round(d / 1000000000 * 10) / 10 + "B";
//               } else if (d > 1000000) {
//                 return Math.round(d / 1000000 * 10) / 10 + "M";
//               } else if (d > 1000) {
//                 return Math.round(d / 1000 * 10) / 10 + "K";
//               } else {
//                 return d;
//               }
//             }
            
//             var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;
            
//             var rgb = hexToRgb(COLOR_FIRST);
            
//             var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
            
//             rgb = hexToRgb(COLOR_LAST);
//             var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
            
//             var MAP_STATE = config.stateDataColumn;
//             var MAP_VALUE = config.valueDataColumn;
            
//             var width = WIDTH,
//                 height = HEIGHT;
            
//             var valueById = d3.map();
            
//             var startColors = COLOR_START.getColors(),
//                 endColors = COLOR_END.getColors();
            
//             var colors = [];
            
//             for (var i = 0; i < COLOR_COUNTS; i++) {
//               var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
//               var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
//               var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
//               colors.push(new Color(r, g, b));
//             }
            
//             var quantize = d3.scale.quantize()
//                 .domain([0, 1.0])
//                 .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));
            
//             var path = d3.geo.path();

//             var svg = d3.select("#map-svg").append("svg")
//                         .attr("class", "map-svg-final")
//                         .attr("width", width)
//                         .attr("height", height);
            
//             var highlight = d3.select("#map-svg").append("div")
//                             .attr("class", "hover-container")
//                             .attr("id", "hover-container")
//                             .style("opacity", "0")
            
//             highlight.append("text")
//                      .attr("class", "highlight-count")
//                      .attr("id", "highlight-count")
//                      .text("36.9M")
            
//             var highlightState = d3.select("#hover-container").append("div").attr("class", "highlight-state-container")
//             highlightState.append("text")
//                      .attr("class", "highlight-state")
//                      .attr("id", "highlight-state")
//                      .text("Northern Mariana Islands")

//             function setDefaultColor(d) {
//                 if (valueById.get(d.id)) {
//                     var i = quantize(valueById.get(d.id));
//                     var color = colors[i].getColors();
//                     return "rgb(" + color.r + "," + color.g +
//                         "," + color.b + ")";
//                 } else {
//                     return "";
//                 }
//             }

//             function setHighlightColor() {
//                 return "#F3558D"
//             }
//             const names_link = "https://gist.githubusercontent.com/amartone/5e9a82772cf1337d688fe47729e99532/raw/65a04d5b4934beda724630f18c475d350628f64d/us-state-names.tsv";
//             d3.tsv(names_link, function(error, names) {
//                 var name_id_map = {};
//                 var id_name_map = {};
                
//                 for (var i = 0; i < names.length; i++) {
//                     name_id_map[names[i].name] = names[i].id;
//                     id_name_map[names[i].id] = names[i].name;
//                 }
                
//                 data.forEach(function(d) {
//                     var id = name_id_map[d[MAP_STATE]];
//                     valueById.set(id, +d[MAP_VALUE]); 
//                 });
                
//                 quantize.domain([d3.min(data, function(d){ return +d[MAP_VALUE] }),
//                                 d3.max(data, function(d){ return +d[MAP_VALUE] })]);
//                 //console.log(name_id_map, id_name_map)
//                 var mouseDowns = []
//                 for (var i = 0; i < 100; i++) {
//                     mouseDowns.push(false);
//                 }
//                 d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json", function(error, us) {

//                     svg.append("g")
//                         .attr("class", "states-choropleth")
//                         .selectAll("path")
//                         .data(topojson.feature(us, us.objects.states).features)
//                         .enter().append("path")
//                         .attr("transform", "scale(" + SCALE + ")")
//                         .style("fill", function(d, i) {
//                             mouseDowns[i] = false;
//                             return setDefaultColor(d)
//                         })
//                         .attr("d", path)
//                         .on("mousemove", function(d){
//                             d3.select(this).style("fill", function(d){
//                                 return setHighlightColor()
//                             })
//                             highlight.transition()		
//                                 .duration(0)		
//                                 .style("opacity", "1");
                            
//                             highlight.style("left", (d3.mouse(this)[0]) + "px")		
//                                 .style("top", (d3.mouse(this)[1]+50) + "px");
//                         })
//                         .on("mouseover", function(d){
//                             d3.select("#highlight-count").text(function(){
//                                 return valueFormat(valueById.get(d.id))
//                             })

//                             d3.select("#highlight-state").text(function(){
//                                 return id_name_map[d.id]
//                             })

//                         })
//                         .on("mouseout", function(d, i){
//                             highlight.transition()		
//                                 .duration(0)		
//                                 .style("opacity", 0);	
//                             if(!mouseDowns[i]){
//                                 d3.select(this).style("fill", function(d){
//                                     return setDefaultColor(d)
//                                 })
//                             }
//                         })
//                         .on("click", function(d, i){
//                             console.log(valueFormat(valueById.get(d.id)))
//                             if (mouseDowns[i]){
//                                 mouseDowns[i] = false;
//                                 d3.select(this).style("fill", function(d, i){
//                                     return setDefaultColor(d)
//                                 })
//                             }else{
//                                 //console.log(d3.select(this).centroid(d)[0]);
//                                 //d3.select(this).append("text").attr("class", "highlight-state-code").text("NY")
//                                 mouseDowns[i] = true;
//                                 d3.select(this).style("fill", function(d, i){
//                                     return setHighlightColor()
//                                 })
//                             }
//                         })
//                     svg.append("path")
//                         .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//                         .attr("class", "states")
//                         .attr("transform", "scale(" + SCALE + ")")
//                         .attr("d", path);
//                 })
//             })


//         })
//     }

//     render() {
//         return (
//             <div className="container-map">
//                 <text className="title">TOTAL DOSES BY STATE</text>
//                 <text className="subtitle">You can select states by clicking on them to update other charts</text>
//                 <div className="map-svg-container" id="map-svg">
//                 </div>
//             </div>
//         )
//     }
// }

// export default Map