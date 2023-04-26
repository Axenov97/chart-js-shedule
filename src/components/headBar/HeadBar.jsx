import React, {useEffect, useRef, useState} from 'react';
import useMatchMedia from 'use-match-media-hook'
import {Bar} from "react-chartjs-2";
import jsonData from "./../../../src/assets/data.json";
import imageDash from "./../../../src/assets/back.svg";
import {ru} from "date-fns/locale";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, TimeScale, Title, Tooltip, Legend} from 'chart.js';
import './head-bar.scss';
import getActualShift from "../../getActualShift";

ChartJS.register(CategoryScale, LinearScale, BarElement, TimeScale, Title, Tooltip, Legend);

const queries = [
    '(max-width: 1260px)',
]

const HeadBar = ({dateInterval}) => {
    const localData = JSON.parse(JSON.stringify(jsonData))
    const canvasRef = useRef()

    const [plannedShifts, setPlanedShifts] = useState([])
    const [actualShifts, setActualShifts] = useState([])
    const [dash, setDash] = useState('rgba(0,31,255,0.22)');

    const labelTooltip = (tooltipItem) => {
        const barEnd = new Date(tooltipItem.parsed._custom.barEnd).toLocaleString()
        const barStart = new Date(tooltipItem.parsed._custom.barStart).toLocaleString()
        return ('Плановое время работы ' + barStart + ' - ' + barEnd)
    }

    const afterTitleTooltip = (tooltipItem) => {
        if (tooltipItem.length === 1) {
            const planedDateFrom = new Date(tooltipItem[0].raw.x[0])
            const planedDateTo = new Date(tooltipItem[0].raw.x[1])

            const actualShift = getActualShift(tooltipItem)

            if (actualShift) {
                let hourFrom = Math.floor((actualShift.date_from.getTime() - planedDateFrom.getTime()) / 1000 / 60 / 60) % 24
                let minutesFrom = Math.floor((actualShift.date_from.getTime() - planedDateFrom.getTime()) / 1000 / 60) % 60

                let hourTo = Math.floor((actualShift.date_to.getTime() - planedDateTo.getTime()) / 1000 / 60 / 60) % 24
                let minutesTo = Math.floor((actualShift.date_to.getTime() - planedDateTo.getTime()) / 1000 / 60) % 60

                const resultArray = []

                if (planedDateFrom.getTime() - actualShift.date_from.getTime() < 0) {
                    resultArray.push('Опоздал на ' + (hourFrom || '00') + 'ч. ' + (minutesFrom || '00') + ' мин.')
                } else if (planedDateFrom.getTime() - actualShift.date_from.getTime() > 0) {
                    resultArray.push('Пришел раньше на ' + (Math.abs(hourFrom) || '00') + 'ч. ' + (Math.abs(minutesFrom) || '00') + ' мин.')
                }

                if (planedDateTo.getTime() - actualShift.date_to.getTime() < 0) {
                    resultArray.push('Ушел на ' + (hourTo || '00') + 'ч. ' + (minutesTo || '00') + ' мин. позже')
                } else if (planedDateTo.getTime() - actualShift.date_to.getTime() > 0) {
                    resultArray.push('Ушел раньше на ' + (Math.abs(hourTo) || '00') + 'ч. ' + (Math.abs(minutesTo) || '00') + ' мин.')
                }
                return resultArray
            } else if( (planedDateFrom.getTime() - new Date().getTime()) < 0 ){
                return 'Прогул'
            } else {
                return 'Смена еще не началась'
            }
        }
    }

    const titleTooltip = (tooltipItem) => {
        if (tooltipItem.length === 1) {
            console.log(tooltipItem)
            for (let employee of localData.planned) {
                if (tooltipItem[0].raw.y === employee.id) {
                    return employee.name
                }
            }
            return 'Без имени'
        }
    }

    const options = {
        barThickness: 30,
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        events: ['click'], //заменим hover на click для вывода инфы по каждой смене
        plugins: {
            legend: {display: false},
            tooltip: {
                interaction: {
                    intersect: true
                },
                filter: (tooltipItem) =>  tooltipItem.datasetIndex === 1, // блокируем вывод (по умолчанию) фактического времени
                callbacks: {
                    label: labelTooltip,
                    title: titleTooltip,
                    afterTitle: afterTitleTooltip
                }
            }
        },

        elements: {
            bar: {
                borderSkipped: false,
                borderRadius: 4,
            },
        },
        scales: {
            y: {stacked: true},
            y2: {position: 'right'},
            x: {
                grid: {color: '#494949'},
                position: 'top',
                type: 'time',
                adapters: {
                    date: {
                        locale: ru
                    }
                },

                time: {unit: 'day'},
                min: dateInterval[0],
                max: dateInterval[1],
            },
            x2: {
                position: 'bottom',
                type: 'time',
                time: {unit: 'hour'},
                min: dateInterval[0],
                max: dateInterval[1],
            },
        },
    };

    const data = {
        datasets: [{
            label: 'Фактическое время работы',
            data: actualShifts,
            backgroundColor: dash,
            borderWidth: 0.6,
            pointHitRadius: 0,
            borderColor: '#3d91ff',
        },
        {
            label: 'Плановое время работы',
            data: plannedShifts,
            backgroundColor: '#FFBDE9',
            borderWidth: 0
        }]
    };

    const [tablet] = useMatchMedia(queries)

    //Эффект на создание штриховки для блоков с фактическим временем
    useEffect(() => {
        const ctx = document.getElementById('bar').getContext('2d');
        const img = new Image();
        img.src = imageDash
        img.onload = () => {
            setDash(ctx.createPattern(img, "repeat"))
        }
    }, [])

    //Эффект на создание всех блоков на диаграмме
    useEffect(() => {
        let plannedArray = [];
        let actualArray = [];

        for (let employee of localData.planned) {
            for (let shift of employee.shifts) {
                plannedArray.push({x: [shift.date_from, shift.date_to], y: employee.id})
            }
        }
        for (let employee of localData.actual) {
            for (let shift of employee.shifts) {
                actualArray.push({x: [shift.date_from, shift.date_to], y: employee.id})
            }
        }
        setPlanedShifts(plannedArray)
        setActualShifts(actualArray)
    }, [])

    //Эффект на адаптивность диаграммы
    useEffect(() => {
        const barContainer = document.querySelector('.bar-container')
        const scrollBar = document.querySelector('.scroll-bar')
        const minDate = new Date(dateInterval[0]).getTime()
        const maxDate = new Date(dateInterval[1]).getTime()
        const countDays = Math.floor((maxDate - minDate) / (24 * 3600 * 1000));

        if (!tablet) {
            barContainer.style.width = `${countDays * 300}px`
            barContainer.style.height = `${localData.planned.length * 90}px`
            countDays > 4 ? scrollBar.style.overflowX = 'scroll' : scrollBar.style.overflowX = 'hidden'
        } else if (tablet){
            barContainer.style.width = `${countDays * 150}px`
            barContainer.style.height = `${localData.planned.length * 90}px`
            scrollBar.style.overflowX = 'auto'
        }
    }, [dateInterval])

    return <div className="scroll-bar">
        <div className="bar-container">
            <Bar
                options={options}
                data={data}
                id='bar'
                ref={canvasRef}
            />
        </div>
    </div>
};

export default HeadBar;