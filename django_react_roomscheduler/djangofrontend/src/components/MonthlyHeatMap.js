import React, {useEffect, useRef, useState} from 'react';
import CalHeatMap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import axios from "axios";
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';


const MonthlyHeatMap = ({selectedClassroom}) => {
    const [scheduleData, setScheduleData] = useState([]); // Define the state for schedule data
    const calHeatMapRef = useRef(null); // useRef to hold the CalHeatMap instance

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('access_token');
                const response = await axios.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const parsedData = parseData(response.data);
                setScheduleData(transformDataForHeatMap(parsedData));
            } catch (err) {
                console.error(err); // Handle errors
            }
        };

        fetchData();
    }, [selectedClassroom]);

    useEffect(() => {
        // Clear previous heatmap content
        const container = document.getElementById('cal-heatmap');
        if (container) {
            container.innerHTML = ''; // Clear the container before initializing a new heatmap
        }

        if (scheduleData && Object.keys(scheduleData).length > 0) {
            // Initialize heatmap here
            initHeatMap(scheduleData);
        }
    }, [scheduleData]);

    // This function now calculates the total number of courses per day
    const transformDataForHeatMap = (data) => {
        const result = {};
        Object.entries(data).forEach(([timestamp, events]) => {
            // Simply count the number of events for each day
            result[timestamp] = events.length;
        });
        return result;
    };

    // Adjusting the CalHeatMap setup
    const initHeatMap = (data) => {
        const cal = new CalHeatMap();
        cal.paint({
            itemSelector: "#cal-heatmap",
            domain: {type: "month", height: 50, width: 50},
            subDomain: {type: "day", height: 50, width: 50},
            data: data,
            start: new Date(),
            cellSize: 50,
            range: 3,
            tooltip: true,
            legend: [1, 3, 5, 7],
            legendColors: {
                min: "#E0BBE4",
                max: "#52057B",
                empty: "#ECECEC",
            },
        }, [
            [
                CalendarLabel,
                {
                    position: 'left',
                    key: 'left',
                    text: () => ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'],
                    width: 50, // Match this with the cellSize or the actual width of your subDomain cells if different
                    textAlign: 'middle',
                    padding: [0, 0, 5, 0], // Adjust padding as necessary
                },
            ]
        ]);
    };


    const parseData = (data) => {
        const result = {};

        data.forEach((course) => {
            let currentDate = new Date(course.first_day);
            const endDate = new Date(course.last_day);

            const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            while (currentDate <= endDate) {
                const dayOfWeek = dayMapping[currentDate.getDay()];

                if (course[dayOfWeek]) {
                    const dateKey = Math.floor(currentDate.getTime() / 1000);
                    result[dateKey] = (result[dateKey] || []).concat({
                        name: course.course_name
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return result;
    };

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6 mt-4">
            <div className="mt-4">
                <div id="cal-heatmap"></div>
            </div>
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Heatmap of schedule</h3>
                <p className="text-sm text-gray-600">The heatmap </p>
            </div>
        </div>
    );
};

export default MonthlyHeatMap;
