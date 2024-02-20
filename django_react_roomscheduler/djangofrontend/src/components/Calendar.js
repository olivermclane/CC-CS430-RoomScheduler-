import React, {useState} from 'react'
import {useEffect} from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'

const Calendar = () => {
    const [endpoint, setEndpoint] = useState("/courses/8")
    const [calendarData, setCalendarData] = useState([])

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
    console.log(calendarData.start_time)
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={[
                {title: calendarData.course_name, start: calendarData.start_time, end: calendarData.end_time},
                {title: calendarData.course_name, start: '2024-02-20T'+calendarData.start_time, end: '2021-06-10T'+calendarData.end_time},
            ]} 
        />
    )
}

export default Calendar;