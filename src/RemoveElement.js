import React from 'react';

export default class RemoveElement extends React.Component {
    constructor(props) {
        super(props);
    }

    removeElement = id => {
        this.props.removeElement(id);
    }

    render() {
        return (
            <div>
                {this.props.list.name} - {this.props.list.source}<button className="deletebutton" onClick={(e) => this.removeElement(this.props.id)}><b>X</b></button>
            </div>
        )
    }
}