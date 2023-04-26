import React, {useState} from 'react';
import 'chartjs-adapter-date-fns';
import CustomLegend from "./components/legend/CustomLegend";
import Calendar from "./components/calendar/Calendar";
import HeadBar from "./components/headBar/HeadBar";

function App() {
    const [dateInterval, setDateInterval] = useState(['2023-04-01', '2023-04-05'])

    return <>
        <div className="main-container">
            <HeadBar dateInterval={dateInterval}/>
            <div className="settings-bar">
                <div className="legends">
                    <CustomLegend name={'- плановое время работы'} />
                    <CustomLegend name={'- фактическое время работы'}/>
                </div>
                <Calendar dateInterval={dateInterval} setDateInterval={setDateInterval} />
            </div>
        </div>
    </>

}

export default App;