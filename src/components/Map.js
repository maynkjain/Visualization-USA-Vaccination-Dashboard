import React from "react";
import "../styles/Map.css"
import * as d3 from "d3"
import * as topojson from "topojson-client";
import Background from "./Background";
import ScriptTag from 'react-script-tag';

const state_colors = require('../styles/state_colors.json')
const state_type = require('../data/state_type.json')

const lightcolor = "#f2f0fa"
const red = "#F3558D"
const blue = "#574b90"
const attrMap = require('../data/radar_attrmap.json')
const default_states = ['New York', 'Alaska', 'Illinois']
class Map extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
        this.drawChart()
        this.drawRadarHelper([])
    }

    componentDidUpdate (){
        console.log("mp-hellp")
        d3.selectAll("#map-svg-final")
        .remove()
        .exit()

        this.drawChart();
    }

    shouldComponentUpdate (){
        if (this.props.mapUpdate == true){
            return true;
        }else{
            return false;
        }
    }

    drawChart = () => {
        var self = this;
        var state_names = new Set();
        var vaccineClicked = true
        var partyClicked = false
        d3.csv("vaccination.csv", function(err, data) {
            //console.log(data);
            var config = {"color1":"#E6E0FF","color2":"#574b90","stateDataColumn":"state_or_territory","valueDataColumn":"percent_dose"}
    
            var WIDTH = 1050, HEIGHT = 570;
            
            var COLOR_COUNTS = 9;
            
            var SCALE = 1.1;
            
            function Interpolate(start, end, steps, count) {
                var s = start,
                    e = end,
                    final = s + (((e - s) / steps) * count);
                return Math.floor(final);
            }

            function Color(_r, _g, _b) {
                var r, g, b;
                var setColors = function(_r, _g, _b) {
                    r = _r;
                    g = _g;
                    b = _b;
                };
            
                setColors(_r, _g, _b);
                this.getColors = function() {
                    var colors = {
                        r: r,
                        g: g,
                        b: b
                    };
                    return colors;
                };
            }
            
            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }
            
            function valueFormat(d) {
              if (d > 1000000000) {
                return Math.round(d / 1000000000 * 10) / 10 + "B";
              } else if (d > 1000000) {
                return Math.round(d / 1000000 * 10) / 10 + "M";
              } else if (d > 1000) {
                return Math.round(d / 1000 * 10) / 10 + "K";
              } else {
                return d;
              }
            }
            
            var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;
            
            var rgb = hexToRgb(COLOR_FIRST);
            
            var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
            
            rgb = hexToRgb(COLOR_LAST);
            var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
            
            var MAP_STATE = config.stateDataColumn;
            var MAP_VALUE = config.valueDataColumn;
            
            var width = WIDTH,
                height = HEIGHT;
            
            var valueById = d3.map();
            
            var startColors = COLOR_START.getColors(),
                endColors = COLOR_END.getColors();
            
            var colors = [];
            
            for (var i = 0; i < COLOR_COUNTS; i++) {
              var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
              var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
              var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
              colors.push(new Color(r, g, b));
            }
            
            var quantize = d3.scaleQuantize()
                .domain([0, 1.0])
                .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));
            
            // D3 Projection
            var projection = d3.geoAlbersUsa()
            .translate([width / 2-60, height / 2 - 60]) // translate to center of screen
            .scale([1000]); // scale things down so see entire US

            // Define path generator
            var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
                         .projection(projection); // tell path generator to use albersUsa projection

            var svg = d3.select("#map-svg").append("svg")
                        .attr("id", "map-svg-final")
                        .attr("width", width)
                        .attr("height", height);
            
            var highlight = d3.select("#map-svg").append("div")
                            .attr("class", "hover-container")
                            .attr("id", "hover-container")
                            .style("opacity", "0")
            
            highlight.append("text")
                     .attr("class", "highlight-count")
                     .attr("id", "highlight-count")
                     .text("36.9M")
            
            var highlightState = d3.select("#hover-container").append("div").attr("class", "highlight-state-container")
            highlightState.append("text")
                     .attr("class", "highlight-state")
                     .attr("id", "highlight-state")
                     .text("Northern Mariana Islands")

            function setDefaultColor(d) {
                if (state_names.length > 0){
                    return "red"
                }
                if (valueById.get(d.id)) {
                    var i = quantize(valueById.get(d.id));
                    var color = colors[i].getColors();
                    return "rgb(" + color.r + "," + color.g +
                        "," + color.b + ")";
                } else {
                    return "";
                }
            }

            function setHighlightColor() {
                return "#F3558D"
            }

            function setParticularHighlightColor(name) {
                //console.log(state_colors[name])
                return state_colors[name]
                return "#F3558D"
            }

            function updateMapColor(id_name_map, isdefault, isParty) {
                d3.selectAll(".state-names").transition().duration(500).style("fill", function(d, i){
                    if (isdefault){
                        if (isParty){
                            var name = id_name_map[d.id]
                            if (state_type[name] == 'Republican'){
                                return red
                            }else{
                                return blue
                            }
                        }else{
                            return setDefaultColor(d)
                        }
                        //console.log("mayank")
                    }
                    else if (state_names.has(id_name_map[d.id])){
                        return state_colors[id_name_map[d.id]]
                    }

                    if (isParty){
                        var name = id_name_map[d.id]
                        if (state_type[name] == 'Republican'){
                            return red
                        }else{
                            return blue
                        }
                    }

                    return lightcolor
                })
            }
            const names_link = "https://gist.githubusercontent.com/amartone/5e9a82772cf1337d688fe47729e99532/raw/65a04d5b4934beda724630f18c475d350628f64d/us-state-names.tsv";
            d3.tsv(names_link, function(error, names) {
                var name_id_map = {};
                var id_name_map = {};
                
                for (var i = 0; i < names.length; i++) {
                    name_id_map[names[i].name] = names[i].id;
                    id_name_map[names[i].id] = names[i].name;
                }
                
                data.forEach(function(d) {
                    var id = name_id_map[d[MAP_STATE]];
                    valueById.set(id, +d[MAP_VALUE]); 
                });
                
                quantize.domain([d3.min(data, function(d){ return +d[MAP_VALUE] }),
                                d3.max(data, function(d){ return +d[MAP_VALUE] })]);
                //console.log(name_id_map, id_name_map)
                var mouseDowns = []
                for (var i = 0; i < 100; i++) {
                    mouseDowns.push(false);
                }
                d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json", function(error, us) {

                    svg.append("g")
                        .attr("class", "states-choropleth")
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects.states).features)
                        .enter().append("path")
                        .attr("transform", "scale(" + SCALE + ")")
                        .style("fill", function(d, i) {
                            mouseDowns[i] = false;
                            return setDefaultColor(d)
                        })
                        .attr("d", path)
                        .attr("class", "state-names")
                        .on("mousemove", function(d, i){
                            highlight.transition()		
                                .duration(0)		
                                .style("opacity", "1");
                            
                            highlight.style("left", (d3.mouse(this)[0]) + "px")		
                                .style("top", (d3.mouse(this)[1]+50) + "px");
                            if(partyClicked){
                                d3.select(this).style('cursor', 'default')
                                return;
                            }else{
                                d3.select(this).style("fill", function(d){
                                    if (!mouseDowns[i]){
                                        return setHighlightColor()
                                    }
                                        
                                    else
                                        return setParticularHighlightColor(id_name_map[d.id])
                                }).style('cursor', 'pointer')
                            }
                        })
                        .on("mouseover", function(d){
                            d3.select("#highlight-count").text(function(){
                                return valueFormat(valueById.get(d.id)) + '%'
                            })

                            d3.select("#highlight-state").text(function(){
                                return id_name_map[d.id]
                            })

                        })
                        .on("mouseout", function(d, i){
                            highlight.transition()		
                                .duration(0)		
                                .style("opacity", 0);	
                            if(!mouseDowns[i]){
                                d3.select(this).style("fill", function(d){
                                    if (state_names.size > 0){
                                        if (vaccineClicked)
                                        return lightcolor
                                        else{
                                            var name = id_name_map[d.id]
                                            if (state_type[name] == 'Republican'){
                                                return red
                                            }else{
                                                return blue
                                            }
                                        }
                                    }else{
                                        if(vaccineClicked)
                                        return setDefaultColor(d)
                                        else{
                                            var name = id_name_map[d.id]
                                            if (state_type[name] == 'Republican'){
                                                return red
                                            }else{
                                                return blue
                                            }
                                        }
                                    }
                                })
                            }
                        })
                        .on("click", function(d, i){
                            if(partyClicked){
                                return;
                            }
                            if (mouseDowns[i]){
                                mouseDowns[i] = false;
                                d3.select(this).style("fill", function(d, i){
                                    return setDefaultColor(d)
                                })
                                var state_name = id_name_map[d.id]
                                if (state_names.has(state_name)){
                                    state_names.delete(state_name)
                                }
                                if (state_names.size == 0){
                                    updateMapColor(id_name_map, true, false)
                                }
                                self.drawRadarHelper(state_names)
                                self.props.onStateClicked(state_names)
                            }else{
                                //console.log(d3.select(this).centroid(d)[0]);
                                //d3.select(this).append("text").attr("class", "highlight-state-code").text("NY")
                                mouseDowns[i] = true;
                                var state_name = id_name_map[d.id]
                                d3.select(this).style("fill", function(d, i){
                                    return setHighlightColor(state_name)
                                })
                                state_names.add(state_name)
                                updateMapColor(id_name_map, false, false)
                                self.drawRadarHelper(state_names)
                                self.props.onStateClicked(state_names)
                            }
                        })
                    svg.append("path")
                        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                        .attr("class", "states")
                        .attr("transform", "scale(" + SCALE + ")")
                        .attr("d", path);

                    var vaccinebutton = d3.select(".vaccine-button")
                                          .on('click', function(){
                                              vaccineClicked = true
                                              partyClicked = false
                                              d3.select(this).style('background-color', '#574b90')
                                              d3.select(".vaccine-text").style('color', "white")

                                              d3.select(".party-button").style('background-color', 'white')
                                              d3.select(".party-text").style('color', "#574b90")
                                              if(state_names.size == 0){
                                                updateMapColor(id_name_map, true, false)
                                              }else{
                                                updateMapColor(id_name_map, false, false)
                                              }

                                              
                                          })
                    var partybutton = d3.select(".party-button")
                                          .on('click', function(){
                                              vaccineClicked = false
                                              partyClicked = true
                                              d3.select(".vaccine-button").style('background-color', 'white')
                                              d3.select(".vaccine-text").style('color', "#574b90")

                                              d3.select(this).style('background-color', '#574b90')
                                              d3.select(".party-text").style('color', "white")
                                              updateMapColor(id_name_map, true, true)
                                          })
                })
            })


        })
    }

    drawRadarHelper = (states) => {
        d3.selectAll("#svg-radar")
        .remove()
        .exit()

        this.drawRadar(states);

    }
    drawRadar = (states) => {

        var state_names = new Set(states)

        let svg = d3.select("#radar-svg").append("svg")
        .attr("id", "svg-radar")
        .attr("width", 590)
        .attr("height", 310);

        let radialScale = d3.scaleLinear()
            .domain([0,100])
            .range([0,125]);
        let ticks = [20,40,60,80,100];

        ticks.forEach(t =>
            svg.append("circle")
            .attr("cx", 295)
            .attr("cy", 160)
            .attr("class", 'radar-circle')
            .attr("r", radialScale(t))
        );

        ticks.forEach(t =>
            svg.append("text")
            .attr("x", 298)
            .attr("y", 160 - radialScale(t)-2)
            .attr("class", "radar-text")
            .text(t.toString())
        );

        d3.csv("radar_data.csv", function(err, data){
            //console.log(Object.keys(data[0]))
            var temp = Object.keys(data[0])
            var features = []

            temp.forEach(t => {
                if (t != 'state_name'){
                    features.push(t)
                }
            })

            //console.log(features)

            function angleToCoordinate(angle, value){
                let x = Math.cos(angle) * radialScale(value);
                let y = Math.sin(angle) * radialScale(value);
                return {"x": 295 + x, "y": 160 - y};
            }

            for (var i = 0; i < features.length; i++) {
                let ft_name = features[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                let line_coordinate = angleToCoordinate(angle, 100);
                let label_coordinate = angleToCoordinate(angle, 105);
            
                //draw axis line
                svg.append("line")
                .attr("x1", 295)
                .attr("y1", 160)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("class", "radar-axis");
            
                //draw axis label
                svg.append("text")
                .attr("x", function(){
                    var x2 = label_coordinate.x
                    if (ft_name == 'percent_full_18'){
                        x2 -= 150
                    }else if (x2 < 295){
                        x2 -= 100
                    }
                    return x2
                })
                .attr("y", function(){
                    var y2 = label_coordinate.y
                    if (ft_name == 'percent_one_dose'){
                        y2 -= 10
                    }
                    return y2
                })
                .attr('class', 'radar-label')
                .text(attrMap[ft_name]);
            }

            let line = d3.line()
                .x(d => d.x)
                .y(d => d.y);
            let colors = ["darkorange", "gray", "navy"];

            function getPathCoordinates(data_point){
                let coordinates = [];
                for (var i = 0; i < features.length; i++){
                    let ft_name = features[i];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                    coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
                }

                let ft_name = features[0];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                    coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
                return coordinates;
            }

            console.log(state_names)
            for (var i = 0; i < data.length; i ++){
                if (!state_names.has(data[i]['state_name'])){
                    //console.log()
                    continue
                }
                let d = data[i];
                let color = colors[i];
                let coordinates = getPathCoordinates(d);

                coordinates.forEach(coordinate => {
                    var x = coordinate.x
                    var y = coordinate.y
                    
                    svg.append("circle")
                    .attr("class", "radar-dot")
                    .attr('id', function(){
                        return data[i]['state_name'] + '-dot'
                    })
                    .attr("r", 3)
                    .attr("cx", function() { 
                        return x
                    })
                    .attr("cy", function() { 
                        return y
                    })
                    .style("fill", function() {
                        return state_colors[data[i]['state_name']]
                    });

                })
            
                //draw the path element
                svg.append("path")
                .datum(coordinates)
                .attr("d",line)
                .attr("stroke-width", 1)
                .attr("stroke", function(){
                    return state_colors[data[i]['state_name']]
                })
                .attr("fill", function(){
                    //return "none"
                    return state_colors[data[i]['state_name']]
                })
                .attr("stroke-opacity", "1")
                .attr("opacity", 0.5)
                .attr("class", "radar-path")
                .attr('id', function(){
                    return data[i]['state_name'] + '-path'
                })
                .on("mouseover", function(){
                    d3.selectAll('.radar-path')
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.1);

                    // d3.selectAll('.radar-dot')
                    // .transition()
                    // .duration(200)
                    // .attr('opacity', 0.1);

                    // d3.selectAll('.radar-dot')
                    // .attr('opacity', 0);

                    // d3.selectAll('.radar-path-stroke')
                    // .attr('opacity', 0);

                    // var name = d['state_name']

                    // var stroke = '#' + name + '-path-stroke'
                    // d3.selectAll(stroke).attr('stroke-opacity', 1)

                    // var dot = '#' + name + '-dot'
                    // d3.selectAll(dot).attr('opacity', 1)

                    d3.select(this).
                    transition()
                    .duration(200)
                    .attr('opacity', 0.7)
                })
                .on("mouseout", function(){
                    d3.selectAll('.radar-path')
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.5);
                });

                svg.append("path")
                .attr('class', 'radar-path-stroke')
                .attr('id', function(){
                    return data[i]['state_name'] + '-path-stroke'
                })
                .datum(coordinates)
                .attr("d",line)
                .attr("stroke-width", 1)
                .attr("stroke", function(){
                    return state_colors[data[i]['state_name']]
                })
                .attr("fill", function(){
                    return "none"
                    return state_colors[data[i]['state_name']]
                })
                .attr("stroke-opacity", "1")
            }
        });
    }

    render() {
        return (
            <div>
                <div className="container-map">
                    <text className="title">TOTAL DOSES BY STATE (% of Population)</text>
                    <text className="subtitle">You can select states by clicking on them to update other charts</text>
                    <div className="map-svg-container" id="map-svg">
                    </div>
                    <div className="vaccine-button">
                        <text className="vaccine-text">Vaccine</text>
                    </div>
                    <div className="party-button">
                        <text className="party-text">Party</text>
                    </div>
                </div>
                <div className="container-scatter">
                    <text className="title">RADAR CHART</text>
                    {/* <text className="subtitle">You can select states by clicking on them to update other charts</text> */}
                    <div className="biplot-svg-container" id="radar-svg"></div>
                </div>
            </div>
            
        )
    }
}

export default Map