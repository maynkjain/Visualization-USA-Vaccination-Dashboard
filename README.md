# Project Proposal - USA Vaccination Data 2021
## Problem Statement
After battling against the Covid-19 virus for almost a year without proper medication and vaccines, the vaccination process against it has started across the United States. There are different brands of vaccines currently being used in the country and various different age groups are being vaccinated with them. A data visualization dashboard to visualize the statistics related to it would be a good way to keep track of the progress and to compare the numbers among various states.

## Dataset
For the vaccination data of US states, we are using a git-hub repository and the official CDC (Centers for Disease Control and Prevention) website which are updated daily.

- The [first](https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations) dataset gives us the statistics related to people vaccinated on a particular day in various states in the US. 
Some of the attributes include **{date, location, total_vaccinations, total_distributed, people_vaccinated, daily_vaccinations}**. This data will help us to plot the time series graph of vaccination in various states and also, we will plot an interactive map of the United States hovering on which will show the brief vaccination data of each state based on the mouse pointer.

- The [second](https://covid.cdc.gov/covid-data-tracker/#vaccinations) dataset gives us more insights like: number of people aged 18+ or 65+ which have been vaccinated, number of doses for Moderna, Pfizer and others which are daily being administered, number of people who have been fully vaccinated etc. This data will be used to plot bar graphs to know the total people vaccinated in that state. Also, we will run some models like MDS to see the clusters in the data. A Parallel Coordinates plot to visualize the comparison among different states based on various attributes that we have in the data, is also a part of the project .

## Methodology/Approach
#### Data Cleaning and Pre-Processing
We plan to use **python** to read the csv datasets and make the data ready by filling up the missing values. Also, to standardize the data we will use *sklearn library of python*.

#### Backend
 To make various visualizations we will fetch the data from backend created using **Flask framework and Rest APIs**. We will make use of inbuilt MDS libraries to run MDS on our data and plot it then in our dashboard.
 To test the APIs, **Postman** will be used.
 
#### Frontend
The frontend will be an interactive dashboard with different types of visualizations (mentioned later). **ReactJS** will be used to create the dashboard, **d3.js** for the graphs and charts. 

#### Aesthetics
To make the dashboard elegant, UX elements (including the proposed UI below) are designed in **Sketch**.

## Proposed User Interface

Below is the screenshot of the final dashboard that we are proposing for the project.
![Image](https://i.ibb.co/TtF08J1/ux.png)

## Deliverables and Interaction Flow
As visible in the design above, we are planning to create the following charts and interactions:
#### Map Plot (Non-Standard)
A map of the United States on the top left with each state as a part of the interaction. On hovering a particular state, a dialog box will show the brief vaccination stats about that state. Also, the user can select multiple states by clicking on them which will update the other charts accordingly. *For example, say we choose three states: Montana, Nebraska and Pennsylvania as shown above.*

**Inference:** The brief vaccination stats of each state. The darkness of the color (unselected) will correspond to the more number of vaccinations.

#### Line Chart (Standard)
Depending on the states chosen in the map plot, the line chart will compare these states on the basis of daily doses of vaccinations. An appropriate legend for each state and color will be created. *As in the picture above, the line chart is drawn for the three selected states.*

**Inference:** The chart will help tell the vaccination trend in the state over the last few months and at the same time, compare it among selected states.

#### Bar Graph 1 (Standard)
One bar graph (right to the line chart) will be drawn with bars corresponding to the selected states (3 in this case), showing the total number of doses in these states. This bar graph is also interactive where in selecting any bar would update the second bar graph (to the right of it). *For example, Pennsylvania is selected in this case.*

**Inference:** We can infer from this graph about the comparison of total doses administered in different states selected.

#### Bar Graph 2 (Standard)
Once a bar is selected in the Bar Graph 1, this Bar Graph will update the proportions of each of the 3 types of vaccinations, namely Moderna, Pfizer and J&J, for that particular state. *This graph in the picture above shows these proportions for the state of Pennsylvania, selected in the Bar Graph 1.*

**Inference:** Combining the two bar graphs, we can tell the trend about the Vaccine brand preference among the different states.

#### Parallel Coordinates Plot (Non-Standard)
For the major attributes, we will draw a PCP. The paths in the PCP will be the states that were selected previously. The order of the attributes can be changed by dragging and also, we will allow brushing to select more number of states and hence, update all other graphs/charts . *The example shows the path for the 3 selected states only.* 

**Inference:** Important insights into the data like vaccine counts of different age groups, percentage of population successfully vaccinated, type of vaccine preferred in that state and much more.

#### MDS Plot (Non-Standard)
Finally, an MDS plot created using Euclidean Dissimilarity to create a scatterplot and visualise the clusters. The number of points here, will also depend on the number of states selected.

**Inference:** The clustering of data.

&nbsp;
&nbsp;

#### References
 - https://covid.cdc.gov/covid-data-tracker/#vaccinations
 - https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations
 - https://github.com/govex/COVID-19/tree/master/data_tables/vaccine_data/us_data/time_series
 - https://dribbble.com
 - https://www.uplabs.com
 - https://www.sketchappsources.com


&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# Preliminary Report - USA Vaccination Data 2021
After the project proposal submission, we have completed the following tasks:
- Data Preparation.
- Designed the structure of the Dashboard as per the sketch submitted in the proposal.
- Plotted USA States Map for visualizing vaccination data along with the interactions.
- Plotted Line Chart using the states selected in the map.     

#### Data Preparation
The first task that we have completed is to clean and format the raw vaccination data that we have taken from  the [first](https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations) and [second](https://covid.cdc.gov/covid-data-tracker/#vaccinations) sources. Using python we have read the input csv files and done some pre-processing like filling up the missing values, removing the columns that were not relevant and reshaping the raw data.
After this task completion we have the vaccination data starting from 01/12/2021 till 04/21/2021 related to all the states in USA that we can directly use in the javascript code to make the visualizations.

Below are the screenshots of the python code that we have used for data  preparation and the state-wise vaccination data after pre-processing.

##### Code:
![Image](https://i.ibb.co/1LfpLGG/Python-Code.png)

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;


##### Data:
This is a part of the data that we are using for the line chart and the map.
![Image](https://i.ibb.co/pnyLd4r/Vaccination-Data.png)

#### The Dashboard
As per the sketch given in the project proposal, we have implemented the following part of the dashboard. The screenshot that you see below is done via *d3 in ReactJS*
The basic structure of the dashboard is ready along with the two types of charts: The US Map and the Line Chart (along with the interactions between them).
![Image](https://i.ibb.co/cCXPj63/dashboard.jpg)

&nbsp;
&nbsp;

##### Vaccination Data On The USA Map
![Image](https://i.ibb.co/0BqK4qf/statemap.jpg)
- The first visualization that we have implemented is the US states map using d3.js. Using this, the total vaccination counts of each state can be seen easily as each state is highlighted according to the count of doses. For eg. if the colour of the state is dark compared to other state then it means that particular state has administerd more vaccine doses compared to other states. 
- If the user hovers on a particular state then that state will be highlighted and the total count can be seen in a dialog box along with the state name. 
- The user has the option to select a state by clicking on that state and then that state will highlight to show that it has been selected. 
- The line chart below will update based on the number of states that are selected.

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;

&nbsp;
&nbsp;


&nbsp;
&nbsp;


##### Line Chart

![Image](https://i.ibb.co/K29zdfW/Linechart.jpg)

- This is the second graph that will plot the time series vaccine data of each state in the United States starting from January till April.
- If the user deselect a particular state on the Map above, then this chart will be updated and will no longer show the plot for that state. Similarly, if a new state is selected on the map by the user then again the chart will be updated and one more line plot will be visible for a new state.
- This chart is useful in gaining insight into the trend of how that particular state has administered vaccinations over the past few months since the vaccination process has begun.
- Also, it can be used to see the comparison of vaccine doses administered among the selected states everyday.

#### Code Snippets

##### USA Map
The following is a brief screenshot of how the USA Map is created in d3.
```js
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
        .on("mousemove", function(d){
            d3.select(this).style("fill", function(d){
                return setHighlightColor()
            })
            highlight.transition()		
                .duration(0)		
                .style("opacity", "1");
            
            highlight.style("left", (d3.mouse(this)[0]) + "px")		
                .style("top", (d3.mouse(this)[1]+50) + "px");
        })
        .on("mouseover", function(d){
            d3.select("#highlight-count").text(function(){
                return valueFormat(valueById.get(d.id))
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
                    return setDefaultColor(d)
                })
            }
        })
        .on("click", function(d, i){
            console.log(valueFormat(valueById.get(d.id)))
            if (mouseDowns[i]){
                mouseDowns[i] = false;
                d3.select(this).style("fill", function(d, i){
                    return setDefaultColor(d)
                })
            }else{
                mouseDowns[i] = true;
                d3.select(this).style("fill", function(d, i){
                    return setHighlightColor()
                })
            }
        })
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("transform", "scale(" + SCALE + ")")
        .attr("d", path);
})
```

##### Line Chart
The following is a brief screenshot of how the line chart is created in d3.
```js
var valueline = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d['California']); });
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("stroke", function(){return colors[0]})
    .attr("d", valueline);
```

#### Remaining Planned Tasks
The next tasks that we have to work on include:
- Creating a bar graph on the right side of the line chart with bars corresponding to the selected states showing the total number of doses. We plan to add an interaction in this graph to select a bar. 

- Creating another bar graph from the bar selected in the previous bar graph which will show the proportions of 3 types of vaccines(Moderna, Pfizer and J&J) for that particular state. 

- Drawing a parallel coordinates plot of the selected states from the US map. The attributes on the PCP plot will be *'vaccine counts of different age groups', 'percentage of population successfully vaccinated', 'type of vaccine preferred in that state'* etc. We plan to add brushing and reordering of the axes functionality in this to further update the selection of states.

- Making MDS plot by creating REST APIs in python to fetch data from backend and then use it to create a MDS Scatter plot in the space that we have allocated according to the initial design.

## Final Poster

![Image](https://i.ibb.co/L1FHshC/Poster.png)

## Installation
```bash
npm install
npm start
```