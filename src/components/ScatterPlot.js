import React from "react";
import "../styles/ScatterPlot.css"
import "../styles/Colors.css"
import * as d3 from "d3"


const url = 'http://127.0.0.1:5000/getbiplotdata'
const colors = ["#F3558D", "#574b90", "#7DEF81"]
const state_colors = require('../styles/state_colors.json')
const attrMap = require('../data/radar_attrmap.json')

class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
        d3.selectAll("#svg-radar")
        .remove()
        .exit()

        this.drawRadar()
    }

    componentDidUpdate (){
        d3.selectAll("#svg-radar")
        .remove()
        .exit()

        this.drawRadar();
    }

    shouldComponentUpdate (){
        return false
    }

    drawRadar = () => {
        console.log("hello")

        let svg = d3.select("#radar-svg").append("svg")
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

            var state_names = new Set(['New York', 'Alaska', 'Illinois'])
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


    // getData = async() => {
    //     //const url = this.state.link
    //     let response = await fetch(url);
    //     let data = await response.json()
    //     return data;
    // }

    // drawChart = async() => {
    //     var data = await this.getData()
    //     var xAxisData = data.pc1
    //     var yAxisData = data.pc2
    //     var clusters = [data.clusters]
    //     console.log(clusters)

    //     var margin = {top: 20, right: 20, bottom: 30, left: 40},
    //     width = 590 - margin.left - margin.right,
    //     height = 250 - margin.top - margin.bottom;

    //     var x = d3.scaleLinear()
    //         .range([0, width]);

    //     var y = d3.scaleLinear()
    //         .range([height, 0]);

    //     var xAxis = d3.axisBottom(x);

    //     var yAxis = d3.axisLeft(y);

    //     var svg = d3.select("#biplot-svg").append("svg")
    //             .attr("width", width + margin.left + margin.right)
    //             .attr("height", height + margin.top + margin.bottom)
    //             .attr("id", "svg-biplot")
    //             .append("g")
    //             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    //     xAxisData.forEach(function(d){
    //         d = +d
    //     });

    //     yAxisData.forEach(function(d){
    //         d = +d
    //     })
        
    //     x.domain([-1,1]).nice();
    //     y.domain([-1,1]).nice();

    //     svg.append("g")
    //     .attr("class", "x-axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)

    //     svg.append("g")
    //     .attr("class", "y-axis")
    //     .call(yAxis)

    //     svg.selectAll(".dot")
    //     .data(xAxisData)
    //     .enter().append("circle")
    //     .attr("class", "dot")
    //     .attr("r", 3)
    //     .attr("cx", function(d, i) { 
    //         var val = xAxisData[i]
    //         if (Math.abs(val) < 0.009){
    //             val = val*100;
    //         }else if (Math.abs(val) < 0.09){
    //             val = val*10;
    //         }
    //         val = val + 0.2*Math.pow(-1, i)
    //         return x(val); 
    //     })
    //     .attr("cy", function(d, i) { 
    //         var val = yAxisData[i]
    //         if(Math.abs(val) < 0.009){
    //             val = val*100;
    //         }
    //         else if (Math.abs(val) < 0.09){
    //             val = val*10;
    //         }
    //         return y(val); 
    //     })
    //     .style("fill", function(d, i) { return colors[i%2]; });
        
    // }

    render() {
        return (
            <div className="container-scatter">
                <text className="title">RADAR CHART</text>
                {/* <text className="subtitle">You can select states by clicking on them to update other charts</text> */}
                <div className="biplot-svg-container" id="radar-svg"></div>
            </div>
        )
    }
}

export default ScatterPlot