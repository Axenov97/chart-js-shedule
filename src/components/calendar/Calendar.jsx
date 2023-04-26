import React, { useState} from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {ru} from 'date-fns/locale';
import './calendar.scss';


const Calendar = ({dateInterval, setDateInterval}) => {
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)

    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(dateInterval[0]),
        endDate: new Date(dateInterval[1]),
        key: 'selection',
    });

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection)

        const inputStartDate = new Date(ranges.selection.startDate);
        const inputEndDate = new Date(ranges.selection.endDate);

        const startYear = inputStartDate.getFullYear();
        const startMonth = (inputStartDate.getMonth() + 1).toString().length < 2 ? '0' + (inputStartDate.getMonth() + 1) : inputStartDate.getMonth() + 1;
        const startDay = inputStartDate.getDate().toString().length < 2 ? '0' + inputStartDate.getDate() : inputStartDate.getDate();

        const endYear = inputEndDate.getFullYear();
        const endMonth = (inputEndDate.getMonth() + 1).toString().length < 2 ? '0' + (inputEndDate.getMonth() + 1) : inputEndDate.getMonth() + 1;
        const endDay = inputEndDate.getDate().toString().length < 2 ? '0' + inputEndDate.getDate() : inputEndDate.getDate();

        const outputStartDate = `${startYear}-${startMonth}-${startDay}`
        const outputEndDate = `${endYear}-${endMonth}-${endDay}`

        setDateInterval([outputStartDate, outputEndDate])
    }

    return <>
        <button className='calendar-btn' onClick={() => setIsOpenCalendar(!isOpenCalendar)}>{isOpenCalendar ? 'Скрыть календарь' : 'Выбрать период' }</button>
        <div className={isOpenCalendar ? 'calendar active' : 'calendar'}>
            <DateRange
                locale={ru}
                className={'date-range'}
                ranges={[selectionRange]}
                dragSelectionEnabled={false}
                onChange={handleSelect}
            />
        </div>
    </>
};

export default Calendar;

