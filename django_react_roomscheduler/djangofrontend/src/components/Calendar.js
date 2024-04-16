import React, {useEffect, useState} from 'react';
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {useAuth} from "../service/auth/AuthProvider";

const Calendar = ({selectedClassroom}) => {
    const [calendarData, setCalendarData] = useState([]);
    const [firstReoccur, setFirstReoccur] = useState(undefined); // Start as undefined
    const [events, setEvents] = useState([]);
    const {axiosInstance} = useAuth();

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
            setCalendarData(response.data);
        } catch (err) {
            console.error("Error fetching calendar data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedClassroom, axiosInstance]);

    useEffect(() => {
        const generateDatesAndEvents = () => {
            let generatedEvents = calendarData.map(event => {
                const daysOfWeek = [];
                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((day, index) => {
                    if (event[day]) daysOfWeek.push(index + 1);
                });

                const color = daysOfWeek.length % 2 === 0 ? '#BA68C8' : '#4A148C';

                return {
                    title: event.course_name,
                    startTime: event.start_time,
                    endTime: event.end_time,
                    daysOfWeek: daysOfWeek,
                    startRecur: `${event.first_day}T${event.start_time}`,
                    endRecur: `${event.last_day}T${event.end_time}`,
                    backgroundColor: color,
                };
            });

            if (generatedEvents.length > 0) {
                // Parsing the first event's start date
                let firstDate = new Date(generatedEvents[0].startRecur.split('T')[0]);

                // Adding 7 days to the first event's start date
                firstDate.setDate(firstDate.getDate() + 7);

                // Formatting the new date back to a string and setting firstReoccur
                setFirstReoccur(firstDate.toISOString().split('T')[0]);
            }
            return generatedEvents;
        };

        if (calendarData.length > 0) {
            setEvents(generateDatesAndEvents());
        }
    }, [calendarData]);

    // Conditional rendering based on firstReoccur
    if (firstReoccur === undefined) {
        return <div>Loading calendar...</div>;
    }

    return (
        <FullCalendar
            plugins={[interactionPlugin, timeGridPlugin, bootstrap5Plugin]}
            initialView="timeGridWeek"
            headerToolbar={true}
            dayHeaderFormat={{weekday: 'long'}}
            events={events}
            eventOverlap={true}
            expandRows={true}
            weekends={false}
            slotMinTime={'06:00:00'}
            slotMaxTime={'22:00:00'}
            initialDate={firstReoccur} // Now guaranteed to be defined
            eventClick={(info) => {
                console.log(`You've clicked an event: ${info.event.title}`);
            }}
        />
    );
};

export default Calendar;
