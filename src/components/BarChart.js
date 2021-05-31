import React from "react";
import "../styles/BarChart.css"
import "../styles/Colors.css"
import * as d3 from "d3"


const state_colors = require('../styles/state_colors.json')
const vaccine_type_data = require('../data/vacc_by_manu.json')
var updatechart_props = true
var state_name = 'California'
var chart2Created = false
class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_state : 'New York',
            update_chart1: this.props.updatechart1
        }
        console.log("karan")
    }

    componentDidMount (){
        this.drawChart()
        var state_names = this.props.states
        if (this.props.states_fromtline){
            if (this.props.states_fromtline.length > 0)
            state_names = this.props.states_fromline
        }
        if (state_names.length == 0){
            this.drawChart2Helper('NoState')
        }else{
            this.drawChart2Helper('NoState')
        }
    }

    componentDidUpdate (){

        // d3.selectAll("#line-state")
        // .remove()
        // .exit()

        // d3.selectAll("#line-state-name")
        // .remove()
        // .exit()
        chart2Created = false
        updatechart_props = this.props.updatechart1
        if (this.state.update_chart1){
            d3.selectAll("#svg-bar-chart1")
            .remove()
            .exit()
            this.drawChart();
        }

        var state_names = this.props.states
        if (this.props.states_fronline && this.props.states_fromtline.length>0){
            state_names = this.props.states_fromline
        }
        if (state_names.length == 0){
            this.drawChart2Helper('NoState')
        }else{
            this.drawChart2Helper('NoState')
        }
    }

    drawChart = () => {
        var self = this;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 470 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
        var y = d3.scaleLinear()
                .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#barchart1-svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "svg-bar-chart1")
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

        function setDefaultColor(name){
            return state_colors[name]
        }
        d3.csv("vaccination.csv", function(error, dt) {
            if (error) throw error;
            //console.log(dt)

            var state_names = new Set(self.props.states)
            if (self.props.states_fromline.length > 0){
                state_names = new Set(self.props.states_fromline)
            }
            var data = []
            dt.forEach(d => {
                if (state_names.has(d['state_or_territory'])){
                    data.push(d);
                }
            });

            //console.log(data)
            // format the data
            data.forEach(function(d) {
                d['total_vaccination_count'] = +d['total_vaccination_count'];
            });

            data.sort(function (a, b) {
                return a['total_vaccination_count'] - b['total_vaccination_count'];
            });
            // Scale the range of the data in the domains

            x.domain(data.map(function(d) { return d['state_or_territory']; }));
            y.domain([0, d3.max(data, function(d) { return d['total_vaccination_count']; })]);

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d['state_or_territory']); })
                .attr("width", x.bandwidth())
                .attr("fill", function(d){
                    var name = d['state_or_territory']
                    return setDefaultColor(name)
                })
                .on("mouseover", function(d){
                    d3.select(this).attr("fill", "#F3558D")
                })
                .on("mouseout", function(d){
                    d3.select(this).attr("fill", function(d){
                        var name = d['state_or_territory']
                        return setDefaultColor(name)
                    })
                })
                .on("click", function(d, i){
                    self.drawChart2Helper(d['state_or_territory'])
                })
                .attr("height", function(d) { return height - y(0); }) // always equal to 0
                .attr("y", function(d) { return y(0); })
                .transition() 
                .duration(1000)
                .attr("y", function(d) { return y(d['total_vaccination_count']); })
                .attr("height", function(d) { return height - y(d['total_vaccination_count']); });

            // add the x Axis
            var xAxis = d3.axisBottom(x)
            if (state_names.size > 6){
                xAxis.tickFormat("")
            }
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

            // add the y Axis
            var formatValue = d3.format(".2s");
            var yAxis = d3.axisLeft(y).tickFormat(function(d) { return formatValue(d)});
            svg.append("g")
            .call(yAxis);

        })


    }

    drawChart2Helper = (name) => {
        d3.select(".barchart2-text").remove().exit()
        state_name = name
        if (chart2Created){
            this.updateChart2()
            return
        }
        d3.selectAll("#svg-bar-chart2")
        .remove()
        .exit()
        this.drawChart2();
        
    }

    updateChart2 = () => {
        var data = vaccine_type_data[state_name]
        var margin = {top: 20, right: 20, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        // set the ranges
        var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.2);

        var x = d3.scaleLinear()
                .range([0, width]);

        data.forEach(function(d) {
            d.value = +d.value;
        });

        x.domain([0, d3.max(data, function(d){ return d.value; })])
        y.domain(data.map(function(d) { return d.type; }));

        var svg = d3.selectAll(".bar2")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("width", function(d){
                        return x(d.value)
                    })
                    .attr("fill", function(d){
                        return state_colors[state_name]
                    })

        
        var formatValue = d3.format(".2s");
        var xAxis = d3.axisBottom(x).ticks(8).tickFormat(function(d) { return formatValue(d)});

        d3.select(".xaxis-barchart2").call(xAxis)
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr("xaxis-barchart2")
        //     .call(xAxis);
        var svg1 = d3.select("#barchart2-svg")
        svg1.select(".barchart2-text").remove().exit()
        svg1.append("text")
        .attr("class", "barchart2-text")
        .text(state_name)

    }

    drawChart2 = () => {
        //console.log(this.state.selected_state)
        var self = this
        //console.log(state_name)
        var data;
        if (state_name == 'NoState'){
            data = []
        }else{
            data = vaccine_type_data[state_name]
            chart2Created = true
        }

        var margin = {top: 20, right: 20, bottom: 30, left: 70},
            width = 460 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        // set the ranges
        var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.2);

        var x = d3.scaleLinear()
                .range([0, width]);
                
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#barchart2-svg").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "svg-bar-chart2")
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function(d) {
            d.value = +d.value;
        });

        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function(d){ return d.value; })])
        y.domain(data.map(function(d) { return d.type; }));
        //y.domain([0, d3.max(data, function(d) { return d.value; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")// <---- Here is the transition
            .attr("y", function(d) { return y(d.type); })
            .attr("height", y.bandwidth())
            .attr("fill", function(d){
                return state_colors[state_name]
            })
            .transition() 
            .duration(1000)
            .attr("width", function(d) {return x(d.value); } );

        // add the x Axis
        var formatValue = d3.format(".2s");
        var xAxis = d3.axisBottom(x).ticks(8).tickFormat(function(d) { return formatValue(d)});
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "xaxis-barchart2")
            .call(xAxis);

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg.select(".barchart2-text").remove().exit()
        if (state_name != 'NoState'){
            svg.append("text")
            .attr("class", "barchart2-text")
            .style("position", "absolute")
            .style("left", "800px")
            .style("font-size", "24")
            .style("fill", "#574b90")
            .text(state_name)
        }
    }

    render() {
        return (
            <div className="container-barchart">
                <text className="title">TOTAL DOSES COMPARISON WITH TYPE</text>
                <text className="subtitle">Click on the bar to visualise the vaccination type for that state</text>
                <div className="barchart1-svg-container" id="barchart1-svg"></div>
                <div className="barchart2-svg-container" id="barchart2-svg"></div>
            </div>
        )
    }
}

export default BarChart 