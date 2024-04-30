import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";

import logger from "../loggers/logger";
import {useAuth} from "../service/auth/AuthProvider";

function DailyScheduleInsight2({selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);
    const [chartOptions, setChartOptions] = useState(null);
    const {axiosInstance} = useAuth();

    useEffect(() => {
        fetchData();
    }, [selectedClassroom]);

    const fetchData = async () => {
        try {
            if (selectedClassroom) {

                const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                logger.debug("Fetched data:"); // Log fetched data
                const parsedData = parseData(response.data);
                logger.debug("Parsed data:"); // Log parsed data
                setScheduleData(parsedData);
                updateTotalUsedTimeChartOptions(parsedData);
            }
        } catch (err) {
            logger.error('Error fetching data:', err);
        }

    };

    const parseData = (data) => {
        return data.map(course => ({
            course_id: course.course_id,
            course_name: course.course_name,
            monday: course.monday,
            tuesday: course.tuesday,
            wednesday: course.wednesday,
            thursday: course.thursday,
            friday: course.friday,
            start_time: course.start_time,
            end_time: course.end_time
        }));
    };

    const updateTotalUsedTimeChartOptions = (data) => {
        const totalUsedTime = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0
        };

        data.forEach(course => {
            Object.keys(totalUsedTime).forEach(day => {
                if (course[day.toLowerCase()]) {
                    const startTime = course.start_time.split(":"); // Split the time string
                    const endTime = course.end_time.split(":"); // Split the time string

                    // Calculate the time difference in minutes
                    const timeDiff = (parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10)) - (parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10));
                    logger.debug("Time Difference (minutes):", timeDiff);


                    // Calculate used time
                    const usedTime = timeDiff / 60; // Convert minutes to hours
                    totalUsedTime[day] += usedTime;
                }
            });
        });
        logger.debug("Total used time:", totalUsedTime); // Log total used time

        const days = Object.keys(totalUsedTime);
        const usedTimes = Object.values(totalUsedTime);

        const options = {
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: days
            },
            yaxis: {
                title: {
                    text: "Total Used Time (hours)"
                },
                labels: {
                    formatter: (value) => {
                        return parseInt(value).toString();
                    }
                },
                max: 15 // Maximum value for the y-axis (total hours in a day)
            },
            colors: ["#BA68C8"],
            series: [
                {
                    name: "Hours Used",
                    data: usedTimes
                }
            ]
        };

        logger.debug("Chart options:", options); // Log chart options
        setChartOptions(options);
    };

    useEffect(() => {
        if (chartOptions) {
            const chart = new ApexCharts(document.getElementById("daily-schedule-chart2"), chartOptions);
            chart.render();

            return () => chart.destroy();
        }
    }, [chartOptions]);

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="daily-schedule-chart2"/>
            <div className="mt-4">
                <hr className="my-3"/>
                <h3 className="text-lg font-semibold mb-2">Total Used Time</h3>
                <p className="text-sm text-gray-600">
                    Total used time for each day based on the class schedule (in a 12-hour day)
                </p>
            </div>
        </div>
    );
}

export default DailyScheduleInsight2;
