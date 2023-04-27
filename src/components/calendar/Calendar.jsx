import React, {useEffect, useRef, useState} from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {ru} from 'date-fns/locale';
import './calendar.scss';
import calendar from './../../../src/assets/calendar.svg'

const Calendar = ({dateInterval, setDateInterval}) => {
    const calendarRef = useRef(null)
    const calendarBtnRef = useRef(null)

    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(dateInterval[0]),
        endDate: new Date(dateInterval[1]),
        key: 'selection',
    });

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection)

        const inputEndDate = new Date(new Date(ranges.selection.endDate).getTime() + 86400000);
        const inputStartDate = new Date(ranges.selection.startDate);

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

    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target) && !calendarBtnRef.current.contains(event.target)) {
             setIsOpenCalendar(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return <>
        <img src={calendar} className='calendar-btn' onClick={() => setIsOpenCalendar(!isOpenCalendar)} ref={calendarBtnRef} alt='calendar'/>

        <div className={isOpenCalendar ? 'calendar active' : 'calendar'} ref={calendarRef}>
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

