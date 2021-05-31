import React from "react";
import "../styles/Pcp.css"
import "../styles/Colors.css"
import * as d3 from "d3"
import { PanZoom } from 'react-easy-panzoom'


class Pcp extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
        this.drawChart()
    }

    componentDidUpdate (){
        //console.log("hello")
        // d3.selectAll("#line-state")
        // .remove()
        // .exit()

        // d3.selectAll("#line-state-name")
        // .remove()
        // .exit()

        d3.selectAll("#svg-pcp-chart")
        .remove()
        .exit()
        

        this.drawChart();
    }

    shouldComponentUpdate (){
        return this.props.pcpUpdate
    }

    drawChart = () => {
        var self = this
        var margin = {top: 40, right: 30, bottom: 20, left: 80},
            width = 1170 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
        var x = d3.scalePoint().range([0, width], 1),
        y = {},
        dragging = {};

        var formatValue = d3.format(".2s");
        var line = d3.line(),
        axis = d3.axisLeft().tickFormat(function(d) { return formatValue(d)}),
        axis1 = d3.axisLeft(),
        background,
        foreground;

        var svg = d3.select("#pcp-svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id", "svg-pcp-chart")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dimensions = []
        d3.csv('pcpdata.csv', function(error, data){
            //console.log(data)
            x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
                return d != "State" && d != "Type" && (y[d] = d3.scaleLinear()
                    .domain(d3.extent(data, function(p) { return +p[d]; }))
                    .range([height, 0]));
            }));

            dimensions = d3.keys(data[0])

            x.domain(dimensions)

            dimensions.forEach(dimension => {
                if (dimension != 'State' && dimension != 'Type'){
                    y[dimension] = d3.scaleLinear()
                    .domain(d3.extent(data, function(p) { return +p[dimension]; }))
                    .range([height, 0])
                }
            });

            console.log(data)
            y['State'] = d3.scaleBand().domain(data.map(function(d) { return d['State']; })).range([0, height]);
            y['Type'] = d3.scaleBand().domain(data.map(function(d) { return d['Type']; })).range([height, 0]);

            dimensions.forEach(d => {
                if (d != 'State' && d != 'Type'){
                    y[d].brush = d3.brushY()
                    .extent([[-16, y[d].range()[1]], [16, y[d].range()[0]]])
                    .on('brush', brush);
                    //console.log([[-8, y[d].range()[1]], [8, y[d].range()[0]]])
                }else{
                    if (d == 'State'){
                        y[d].brush = d3.brushY()
                        .extent([[-16, y[d].range()[0]], [16, y[d].range()[1]]])
                        .on('brush', brush)
                        .on('end', brushend);
                    }else{
                        y[d].brush = d3.brushY()
                        .extent([[-16, y[d].range()[1]], [16, y[d].range()[0]]])
                        .on('brush', brush)
                    }
                    
                    //console.log([[-8, y[d].range()[0]], [8, y[d].range()[1]]])
                }
            });

            console.log(dimensions)

            // Add grey background lines for context.
            background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

            // Add blue foreground lines for focus.
            foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .style("stroke", function(d){
                if (d['Type'] == 'Covid19'){
                    return "#F3558D"
                }else{
                    return "#7DEF81"
                }
            });

            // Add a group element for each dimension.
            var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.drag()
                .subject(function(d) { return {x: x(d)}; })
                .on("start", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
                .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
                }));
            
            // Add an axis and title.
            g.append("g")
            .attr("class", "axis")
            .each(function(d) { 
                if (d != 'State' && d != 'Type'){
                    d3.select(this).call(axis.scale(y[d])); 
                }else{
                    d3.select(this).call(axis1.scale(y[d])); 
                }
            })
            .append("text")
            .style("text-anchor", "middle")
            .style("color", "black")
            .attr("y", -9)
            .text(function(d) { return d; });

            // Add and store a brush for each axis.
            g.append("g")
            .attr("class", "brush")
            .each(function(d) {
                //if(d != 'State' && d != 'Type')
                d3.select(this).call(y[d].brush);
            })
            .selectAll("rect")
            .attr("x", 0)
            .attr("width", 16);

        });

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }
        
        function transition(g) {
            return g.transition().duration(500);
        }
        
        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) { 
                var yVal = y[p](d[p]);
                if (p == 'State' || p == 'Type'){
                    yVal = y[p](d[p]) + y[p].bandwidth()/2
                }
                return [position(p), yVal]; 
            }));
        }
        
        // function brushstart() {
        //     d3.event.sourceEvent.stopPropagation();
        // }
        
        // // Handles a brush event, toggling the display of foreground lines.
        // function brush() {
        //     var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        //         extents = actives.map(function(p) { return y[p].brush.extent(); });
        //         foreground.style("display", function(d) {
        //             return actives.every(function(p, i) {
        //             return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        //             }) ? null : "none";
        //         });
        // }

        function brush() {
            const actives = [];
            svg.selectAll('.brush')
            .filter(function(d) {
                return d3.brushSelection(this);
              })
              .each(function(d) {
                actives.push({
                  dimension: d,
                  extent: d3.brushSelection(this)
                });
                //console.log(d)
              });
            //var states = new Set()
            foreground.style('display', function(d) {
              return actives.every(function(active) {
                const dim = active.dimension;
                // if (dim == 'State'){
                //     if (active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1]){
                //         states.add(d[dim])
                //     }
                // }
                return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
              }) ? null : 'none';
            });

            //console.log(states)
        }

        function brushend() {
            console.log("hello Mayank")
            const actives = [];
            svg.selectAll('.brush')
            .filter(function(d) {
                return d3.brushSelection(this);
              })
              .each(function(d) {
                actives.push({
                  dimension: d,
                  extent: d3.brushSelection(this)
                });
                //console.log(d)
            });

            var states = new Set()

            foreground.style('display', function(d) {
                return actives.every(function(active) {
                  const dim = active.dimension;
                  if (dim == 'State'){
                      if (active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1]){
                          states.add(d[dim])
                      }
                  }
                  return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
                }) ? null : 'none';
              });

            self.props.onPcpSelected(states)

        }


    }

    render() {
        return (
            <div className="container-pcp">
                <div className="title-holder"> 
                    <text className="title">PARALLEL COORDINATES PLOT</text>
                </div>
                <div className="pcp-svg-container" id="pcp-svg"></div>
            </div>
        )
    }
}

export default Pcp