import React from "react";
import "../styles/Flag.css"
import "../styles/Colors.css"
import flag from "../images/flag.png"


class Flag extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount (){
    }

    render() {
        return (
            <div className="container-flag">
                <img src={flag} class="flag-image"/>
            </div>
        )
    }
}

export default Flag