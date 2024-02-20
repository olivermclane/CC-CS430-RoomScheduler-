import React, {useState} from 'react'
import {useEffect} from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'

const Calendar = () => {
    const [endpoint, setEndpoint] = useState("/courses/1")
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

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={[
                {title: 'Health', start: '2024-02-20T18:00:00', end: '2024-02-20T20:00:00'},
                {title: 'Biology', start: '2024-02-20T10:00:00', end: '2021-06-10T12:00:00'},
            ]}
        />
    )
}

export default Calendar;