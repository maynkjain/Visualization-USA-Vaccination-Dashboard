import React from "react";
import "../styles/LineChart.css"
import "../styles/Colors.css"
import * as d3 from "d3"
import { schemeDark2 } from "d3";


const state_colors = require('../styles/state_colors.json')

class LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
        d3.selectAll("#svg-line-chart")
        .remove()
        .exit()
        
        this.drawChart()
    }

    componentDidUpdate (){
        //console.log("hello")
        // d3.selectAll(".linechart-svg-final")
        // .remove()
        // .exit()

        // d3.selectAll("#line-state")
        // .remove()
        // .exit()

        // d3.selectAll("#line-state-name")
        // .remove()
        // .exit()
        //console.log("hello")
        d3.selectAll("#svg-line-chart")
        .remove()
        .exit()
        
        this.drawChart();
    }

    shouldComponentUpdate (){
        //console.log(this.props.line)
        //console.log(this.props.lineUpdate, this.props.states)
        return this.props.lineUpdate
         
    }

    drawLine = (data, state_name, x, y, width) => {
        var valueline = d3.line()
                            .x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d[state_name]); });

        var svg = d3.select('#svg-line-chart-group');

        svg.append("path")
            .data([data])
            .attr("class", "line-state")
            .attr("stroke", function(){
                return state_colors[state_name]
            })
            .attr("d", valueline)
            .attr("id", "line-state")
            .attr("state_name", state_name);
        
        // svg.append("text")
        // .attr("transform", "translate("+(width+3)+","+y(data[99][state_name])+")")
        // .attr("dy", ".35em")
        // .attr("text-anchor", "start")
        // .attr("id", "line-state-name")
        // .style("fill", function(){
        //     return state_colors[state_name]
        // })
        // .style("font-family", "Archia")
        // .text(state_name);

    }

    drawChart = () => {
        var self = this;
        var state_names = self.props.states;
        console.log(state_names)

        var margin = {top: 20, right: 100, bottom: 30, left: 45},
        width = 1090 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

        var parseTime = d3.timeParse("%Y-%m-%d")
        //console.log(parseTime('2021-01-12'))

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        // var valueline = d3.line()
        //                     .x(function(d) { return x(d.date); })
        //                     .y(function(d) { return y(d['California']); });

        // define the 2nd line
        // var valueline2 = d3.line()
        //                     .x(function(d) { return x(d.date); })
        //                     .y(function(d) { return y(d['Texas']); });

        // // define the 3rd line
        // var valueline3 = d3.line()
        //                     .x(function(d) { return x(d.date); })
        //                     .y(function(d) { return y(d['New York']); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#linechart-svg").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "svg-line-chart")
                    .append("g")
                    .attr("id", "svg-line-chart-group")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("new_daily_vaccinations.csv", function(error, data) {
            if (error) throw error;

            // format the data
            data.forEach(function(d) {
                d.date = parseTime(d.date);
                state_names.forEach(state_name => {
                    d[state_name] = +d[state_name];
                })           
            });
            
            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) {
                var vals = []
                state_names.forEach(state_name => {
                    vals.push(d[state_name]);
                })
                if (vals.length == 0){
                    return 1000000;
                }
                return d3.max(vals); })]);
            
            var colors = ['#FFCDAC', '#69F1FE', '#FD8DB5', '#574b90']

            // Add the valueline path.
            // svg.append("path")
            // .data([data])
            // .attr("class", "line")
            // .attr("stroke", function(){return colors[0]})
            // .attr("d", valueline);
            state_names.forEach(state_name => {
                self.drawLine(data, state_name, x, y, width)
            })

            svg.call( d3.brush()                 // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", selectLines) // Each time the brush selection changes, trigger the 'updateChart' function
            )

            function selectLines(){
                if (d3.event.selection == null){
                    return;
                }
                var extent = d3.event.selection
                var length1 = extent[0][0]
                var length2 = extent[1][0]

                var ylow = extent[0][1]
                var yhigh = extent[1][1]

                var linesgroup = d3.select('#svg-line-chart-group');
                var paths = linesgroup.selectAll(".line-state")

                for (var i = 0; i<paths.length - 2; i++){
                    console.log(paths[i])
                }

                var pathnodes = paths.nodes()

                var selected_state_names = []
                pathnodes.forEach(node =>{
                    var name = node.getAttribute('state_name')
                    var pos1 = node.getPointAtLength(length1)
                    var pos2 = node.getPointAtLength(length2)

                    var y1 = pos1.y
                    var y2 = pos2.y

                    if ((y1>= ylow && y1<=yhigh) || (y2>= ylow && y2<=yhigh)){
                        selected_state_names.push(name)
                    }
                    //console.log(pos1)
                })
                self.props.onLinesSelected(selected_state_names)
            }

            // // Add the valueline2 path.
            // svg.append("path")
            // .data([data])
            // .attr("class", "line")
            // .attr("stroke", function(){return colors[1]})
            // .attr("d", valueline2);

            // // Add the valueline3 path.
            // svg.append("path")
            // .data([data])
            // .attr("class", "line")
            // .attr("stroke", function(){return colors[2]})
            // .attr("d", valueline3)
            // .append("text")
            // .text("hello");


            // Add the X Axis
            // var xAxis = d3.svg.axis().scale(x).orient('bottom')
            // var yAxis = d3.svg.axis().scale(y).orient('left');
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(8))

            // Add the Y Axis
            var formatValue = d3.format(".2s");
            var yAxis = d3.axisLeft(y).tickFormat(function(d) { return formatValue(d)});
            svg.append("g")
            .call(yAxis);

            // console.log(data)
            // svg.append("text")
            // .attr("transform", "translate("+(width+3)+","+y(data[99]['California'])+")")
            // .attr("dy", ".35em")
            // .attr("text-anchor", "start")
            // .style("fill", function(){return colors[3]})
            // .style("font-family", "Archia")
            // .text("California");

            // svg.append("text")
            // .attr("transform", "translate("+(width+3)+","+y(data[99]['Texas'])+")")
            // .attr("dy", ".35em")
            // .attr("text-anchor", "start")
            // .style("fill", function(){return colors[3]})
            // .style("font-family", "Archia")
            // .text("Texas");


            // svg.append("text")
            // .attr("transform", "translate("+(width+3)+","+y(data[99]['New York'])+")")
            // .attr("dy", ".35em")
            // .attr("text-anchor", "start")
            // .style("fill", function(){return colors[3]})
            // .style("font-family", "Archia")
            // .text("New York");
        })

    }


    render() {
        return (
            <div className="container-linechart">
                <text className="title">DAILY DOSES OF SELECTED STATES</text>
                <text className="subtitle">Select states on the map or PCP to update the chart</text>
                <div className="linechart-svg-container" id="linechart-svg"></div>
                {/* <div className="linechart-legend"></div> */}
            </div>
        )
    }
}

export default LineChart