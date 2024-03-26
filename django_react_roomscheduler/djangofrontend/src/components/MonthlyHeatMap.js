import React, {useEffect, useState} from 'react';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import axios from "axios";
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "./cal-heatmap-custom.css"
import Legend from "cal-heatmap/plugins/Legend";

const MonthlyHeatMap = ({selectedClassroom}) => {
    const [scheduleData, setScheduleData] = useState({});
    useEffect(() => {
        const container = document.getElementById('cal-heatmap');
        if (container) {
            container.innerHTML = ''; // Clear the container before initializing a new heatmap
        }

        if (Object.keys(scheduleData).length > 0) {
            initHeatMap(scheduleData);
        }
    }, [scheduleData]);

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
                const transformedData = transformDataForHeatMap(parsedData);
                setScheduleData(transformedData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [selectedClassroom]);

    const transformDataForHeatMap = (data) => {
        const transformedData = [];

        Object.entries(data).forEach(([date, courses]) => {
            const count = courses.length; // The number of courses on this date

            transformedData.push({
                date: date, // Include the date property
                p: count,
            });
        });

        return transformedData;
    };

    const initHeatMap = (data) => {
        const cal = new CalHeatmap();
        cal.paint({
                itemSelector: "#cal-heatmap",
                domain: {type: "month", height: 35, width: 35},
                subDomain: {type: "day", height: 35, width: 35},
                data: {
                    source: data,
                    type: 'json',
                    x: 'date',
                    y: d => +d['p'],
                },
                date: {
                    start: new Date(data[0].date),
                },
                range: 5,
                scale: {
                    color: {
                        scheme: 'Purples',
                        type: 'linear',
                        domain: [0, 10],
                    }
                }
            },
            [
                [
                    Tooltip,
                    {
                        text: function (date, value, dayjsDate) {
                            return (
                                (value ? value + ' Courses' : 'No data') + ' on ' + dayjsDate.format('LL')
                            );
                        },
                    },
                ],
                [
                    Legend,
                    {
                        tickSize: 0,
                        width: 500,
                        itemSelector: '#cal-heatmap-legend',
                        label: 'Courses Scheduled',
                    },
                ],
            ]);
    };

    const parseData = (courses) => {
        const result = {};
        // Logic to parse the data from your API response
        courses.forEach((course) => {
            const {first_day, last_day, course_name} = course;
            const startDate = new Date(first_day);
            const endDate = new Date(last_day);

            // Adjusted logic to fill dates based on course days
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.toLocaleDateString('en-US', {weekday: 'long'}).toLowerCase();
                if (course[dayOfWeek]) {
                    const dateStr = d.toISOString().split('T')[0];
                    result[dateStr] = (result[dateStr] || []).concat(course_name);
                }
            }
        });
        return result;
    };

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6 mt-4">
            <div className="mt-4">
                <div id="cal-heatmap"></div>
                <div id="cal-heatmap-legend"></div>
            </div>
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Heatmap of schedule</h3>
                <p className="text-sm text-gray-600">This heatmap visualizes the distribution of courses over time.</p>
            </div>
        </div>
    );
};

export default MonthlyHeatMap;
