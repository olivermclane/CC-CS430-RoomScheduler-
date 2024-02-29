import React, {useEffect, useState} from 'react';
import axios from "axios";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Calendar = ({selectedClassroom}) => {
    const [endpoint, setEndpoint] = useState(`/classroom-courses/${selectedClassroom}`)
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
            console.error("Error fetching calendar data:", err);
        }
    };

    useEffect(() => {
        fetchData(endpoint);
    }, [endpoint]);

    useEffect(() => {
        // Fetch data whenever selectedClassroom changes
        setEndpoint(`/classroom-courses/${selectedClassroom}`);
    }, [selectedClassroom]);

    const generateDatesAndEvents = () => {
        let dates = [];
        let events = [];
        let color;

        calendarData.forEach(event => {
            let daysOfWeek = [];

            if (event.monday === true) {
                daysOfWeek.push("1");
                color = '#4A148C';

            }
            if (event.tuesday === true) {
                daysOfWeek.push("2");
                color = '#BA68C8';

            }
            if (event.wednesday === true) {
                daysOfWeek.push("3");
                color = '#4A148C';

            }
            if (event.thursday === true) {
                daysOfWeek.push("4");
                color = '#BA68C8';

            }
            if (event.friday === true) {
                daysOfWeek.push("5");
                color = '#4A148C';

            }

            dates.push(daysOfWeek);

            events.push({
                title: event.course_name,
                startTime: event.start_time,
                endTime: event.end_time,
                daysOfWeek: daysOfWeek,
                startRecur: event.first_day + 'T' + event.start_time,
                endRecur: event.last_day + 'T' + event.end_time,
                backgroundColor: color,
            });
        });

        return {dates, events};
    };

    const {dates, events} = generateDatesAndEvents();

    return (
        <FullCalendar
            slotMinTime={"07:00:00"}
            slotMaxTime={"21:30:00"}
            allDaySlot={false}
            dayHeaderFormat={{weekday: 'long'}}
            plugins={[interactionPlugin, timeGridPlugin, bootstrap5Plugin]}
            initialView="timeGridWeek"
            events={events}
            weekends={false}
            eventClick={(info) => {
                console.log(`You've clicked an event: ${info.event.title}`);
            }}
        />
    )
}

export default Calendar;
