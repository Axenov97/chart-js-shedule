import React from 'react';
import './legend.scss'
const CustomLegend = ({name, color, border}) => {
    return <div className='legend'>
        <div className="legend__box" style={{background: color, border: border}}/>
        <p className="legend__name">{name}</p>
    </div>

};

export default CustomLegend;