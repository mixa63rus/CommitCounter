import React from 'react';
import { Button } from 'react-bootstrap';

export default function RemoveElement({ list, id, removeElement }) {
    return (
        <div>
            <b>{list.name} - {list.source}</b>  <Button bsSize="xsmall" bsStyle="danger" onClick={(e) => removeElement(id)}><b>X</b></Button>
        </div>
    )
}
