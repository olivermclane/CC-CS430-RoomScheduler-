import React, {useEffect, useState} from 'react';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import "./cal-heatmap-custom.css"
import Legend from "cal-heatmap/plugins/Legend";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";

const MonthlyHeatMap = ({selectedClassroom}) => {
    const [scheduleData, setScheduleData] = useState({});
    const [openTimes, setOpenTimes] = useState({})
    const {axiosInstance} = useAuth();

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
                const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                setOpenTimes(calculateOpenTimes(response.data))
                const parsedData = parseData(response.data);
                const transformedData = transformDataForHeatMap(parsedData);
                setScheduleData(transformedData);
            } catch (err) {
                logger.error(err);
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
                /*[
                    Tooltip, {
                    // Dynamic text for the tooltip based on the data point
                    text: function (date, value, dayjsDate) {
                        return `${value ? value + ' Courses' : 'No data'} on ${dayjsDate.format('LL')}`;
                    },
                }
                ],*/
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

    function calculateOpenTimes(courses) {
        // Initial structure to store busy times for each day
        const busyTimes = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        };

        // Populate busy times based on the course schedules
        courses.forEach(course => {
            Object.keys(busyTimes).forEach(day => {
                if (course[day]) { // If the course runs on this day
                    busyTimes[day].push(`${course.start_time} - ${course.end_time}`);
                }
            });
        });

        // Function to merge overlapping time ranges and calculate open times
        const calculateGaps = (busyTimesForDay) => {
            const sortedTimes = busyTimesForDay.sort((a, b) => a.split('-')[0].localeCompare(b.split('-')[0]));

            let mergedTimes = [];
            sortedTimes.forEach(time => {
                if (!mergedTimes.length || mergedTimes[mergedTimes.length - 1].split('-')[1] < time.split('-')[0]) {
                    mergedTimes.push(time);
                } else {
                    let lastTime = mergedTimes.pop();
                    let endTime = lastTime.split('-')[1] > time.split('-')[1] ? lastTime.split('-')[1] : time.split('-')[1];
                    mergedTimes.push(`${lastTime.split('-')[0]}-${endTime}`);
                }
            });

            const opStart = '08:00', opEnd = '18:00';
            let openTimes = [], lastEnd = opStart;

            // Helper function to calculate the minute difference between two times
            const minuteDifference = (startTime, endTime) => {
                const [startHours, startMinutes] = startTime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
            };

            mergedTimes.forEach(time => {
                let [start, end] = time.split('-');
                if (lastEnd < start && minuteDifference(lastEnd, start) > 15) { // Only add if gap is more than 10 minutes
                    openTimes.push(`${tConvert(lastEnd)} - ${tConvert(start)}`);
                    console.log(`${tConvert(lastEnd)} - ${tConvert(start)}`)

                }
                lastEnd = end;
            });

            if (lastEnd < opEnd && minuteDifference(lastEnd, opEnd) > 15) {
                logger.log(`${tConvert(lastEnd)}-${tConvert(opEnd)}`)
                openTimes.push(`${tConvert(lastEnd)}-${tConvert(opEnd)}`);
            }
            logger.log(openTimes)
            return openTimes;
        };

        // Calculate open times for each day
        const openTimes = {};
        Object.keys(busyTimes).forEach(day => {
            openTimes[day] = calculateGaps(busyTimes[day]);
        });

        return openTimes;
    }

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

    function tConvert(time) {
        // Check if the input time is already in 12-hour format with AM/PM, return as-is
        if (/AM|PM/.test(time)) {
            return time;
        }

        const [hourComponent, minuteComponent] = time.split(':');
        let hours = parseInt(hourComponent, 10);
        const minutes = minuteComponent;
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = hours < 10 ? `0${hours}` : `${hours}`;

        return ` ${strHours}:${minutes} ${ampm} `;
    }

    return (
        <div className="max-w-full w-full bg-white rounded-lg shadow-lg p-4 md:p-6 mt-4">
            <div className="flex flex-wrap md:flex-nowrap p-4 md:p-6">
                <div className="w-full md:w-1/2" id="cal-heatmap">
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6" id="cal-heatmap-legend">
                </div>
            </div>
            <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-2">Open Schedule Times</h2>
                <hr className="my-4 w-25"/>

                <div className="flex flex-wrap justify-between">
                    {Object.entries(openTimes).map(([day, times], index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                            <h3 className="text-lg font-semibold capitalize">{day}:</h3>
                            <ul className="list-disc pl-5">
                                {times.map((time, timeIndex) => (
                                    <li key={timeIndex} className="text-sm text-gray-600">
                                        {time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-4"/>
            <div>
                <h3 className="text-lg font-semibold mb-2">Heatmap of Schedule</h3>
                <p className="text-sm text-gray-600">This heatmap visualizes the distribution of courses over time.</p>
            </div>
        </div>

    )
        ;
};

export default MonthlyHeatMap;
