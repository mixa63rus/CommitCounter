import React from 'react';

export default function RemoveElement({ list, id, removeElement }) {
    return (
        <div>
            {list.name} - {list.source}<button className="deletebutton" onClick={(e) => removeElement(id)}><b>X</b></button>
        </div>
    )
}
