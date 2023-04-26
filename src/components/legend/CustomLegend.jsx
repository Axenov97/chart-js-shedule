import React from 'react';
import './legend.scss'
const CustomLegend = ({name}) => {
    return <div className='legend'>
        <div className="legend__box"/>
        <p className="legend__name">{name}</p>
    </div>

};

export default CustomLegend;