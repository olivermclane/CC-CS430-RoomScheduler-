import React, {useEffect, useState} from 'react'
import axios from "axios";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const Calendar = (classroomid) => {
    // the /12 is the classroom id and should be changed based on what classroom is chosen
    const [endpoint, setEndpoint] = useState(`/classroom-courses/${classroomid}`)
    const [calendarData, setCalendarData] = useState([[]])

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            const response = await axios.get(`http://localhost:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            setCalendarData(response.data);
        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else if (err.request) {
                console.log("Network error:", err.message);
            } else {
                console.log("Error:", err.message);
            }
        }
    };

    useEffect(() => {
        fetchData(endpoint);
    }, [endpoint]);


    let dates = [];
    for (let i = 0; i < calendarData.length; i++) {
        dates.push([])
        if (calendarData[i].sunday === true) {
            dates[i].push("0")
        }
        if (calendarData[i].monday === true) {
            dates[i].push("1")
        }
        if (calendarData[i].tuesday === true) {
            dates[i].push("2")
        }
        if (calendarData[i].wednesday === true) {
            dates[i].push("3")
        }
        if (calendarData[i].thursday === true) {
            dates[i].push("4")
        }
        if (calendarData[i].friday === true) {
            dates[i].push("5")
        }
        if (calendarData[i].saturday === true) {
            dates[i].push("6")
        }
    }

    let events = []
    for (let i = 0; i < calendarData.length; i++) {
        events.push({
            title: calendarData[i].course_name,
            startTime: calendarData[i].start_time,
            endTime: calendarData[i].end_time,
            daysOfWeek: dates[i],
            startRecur: calendarData[i].first_day+'T'+calendarData[i].start_time,
            endRecur: calendarData[i].last_day+'T'+calendarData[i].end_time,
        })
    }

    return (
        <FullCalendar
            slotMinTime={"07:00:00"}
            slotMaxTime={"21:30:00"}
            allDayContent={false}
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={events}
        />
    )
}

export default Calendar;