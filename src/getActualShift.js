import jsonData from "./data.json";

export default function getActualShift(tooltipItem) {
    const localData = JSON.parse(JSON.stringify(jsonData))

    let actualShiftsArray = []
    let actualShift = {}
    const planedDateFrom = new Date(tooltipItem[0].raw.x[0])

    for (let employee of localData.actual) {
        if (employee.id === tooltipItem[0].label) {
            for (let shift of employee.shifts) {
                if (new Date(shift.date_from).toLocaleDateString() === planedDateFrom.toLocaleDateString()) {
                    actualShiftsArray.push({
                        diff: (new Date(shift.date_from).getTime() - planedDateFrom),
                        date_to: new Date(shift.date_to),
                        date_from: new Date(shift.date_from),
                        shop: shift.shop,
                        role: shift.role
                    })
                }
            }
        }
    }

    if (!actualShiftsArray.length){
        return false
    }

    if (actualShiftsArray.length === 1) {
        actualShift = actualShiftsArray[0]
    } else {
        actualShiftsArray.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))
        actualShift = actualShiftsArray[0]
    }

   return actualShift
}