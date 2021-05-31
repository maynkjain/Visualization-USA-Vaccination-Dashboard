import React from "react";
import "../styles/Extra.css"
import "../styles/Colors.css"
import refresh from "../images/refresh.png"


class Extra extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
    }

    refreshpage = () => {
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div className="container-text">
                    <text className="main">UNITED STATES OF AMERICA</text>
                    <text className="sub1">Covid-19 Vaccination Data</text>
                    <text className="sub2">Group-63</text>
                </div>
                <div className="container-reload" onClick={this.refreshpage}>
                <img src={refresh} class="refresh-image"/>
                </div>
            </div>
            
        )
    }
}

export default Extra