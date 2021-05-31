import React, {useState} from "react";
import "../styles/Background.css"
import "../styles/Colors.css"
import Map from "./Map"
import LineChart from "./LineChart"
import Pcp from "./Pcp"
import Extra from "./Extra"
import BarChart from "./BarChart"
import ScatterPlot from "./ScatterPlot";
import Flag from "./Flag"

// var lineUpdate = true;
// var mapUpdate = false;
// var states = ['New York', 'California']
// var states_fromline = []
function Background (){
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         states :['New York', 'California'],
    //         mapUpdate : false,
    //         states_fromline : ['New York', 'California'],
    //         lineUpdate: true
    //     }
    // }

    // componentDidMount (){
    // }
    const [line_update, setLineUpdate] = useState(true)
    const [map_update, setMapUpdate] = useState(false)
    const [pcp_update, setPcpUpdate] = useState(false)
    const [states, setStates] = useState([])
    const [states_fromline, setStates_fromline] = useState([])


    function onMapClick(state_names){
        //console.log("Hello", state_names)
        //console.log("hey")
        
        var st_names = Array.from(state_names)
        setLineUpdate(() => true)
        setMapUpdate(() => false)
        setStates(() => st_names)
        setStates_fromline(() => [])
        // this.setState({
        //     states : st_names,
        //     mapUpdate : false,
        //     states_fromline: [],
        //     lineUpdate: true
        // })
    }

    function onLineBrushed(state_names){
        //console.log(state_names)
        // this.setState({
        //     mapUpdate: false,
        //     lineUpdate: false,
        //     states_fromline : state_names
        // })
        
        setLineUpdate(()=>{
            return false})
        setMapUpdate(() => false)
        setStates_fromline(() => state_names)
        
        
    }

    function onPcpBrushed(state_names){
        var st_names = Array.from(state_names)
        setLineUpdate(() => true)
        setMapUpdate(() => false)
        setPcpUpdate(() => false)
        setStates(() => st_names)
        setStates_fromline(() => [])
        //console.log(state_names)
    }

    return (
        <div className="bg">
            <Map onStateClicked={onMapClick} mapUpdate={map_update}/>
            <LineChart onLinesSelected={onLineBrushed} lineUpdate = {line_update} states={states}/>
            <Pcp onPcpSelected={onPcpBrushed} pcpUpdate={pcp_update}/>
            <Extra />
            <BarChart states={states} states_fromline = {states_fromline} updatechart1={true}/>
            {/* <ScatterPlot /> */}
            <Flag />
        </div>
    )

}

export default Background