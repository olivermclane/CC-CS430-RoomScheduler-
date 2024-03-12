import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

function DailyScheduleInsight2({ selectedClassroom }) {
    const [scheduleData, setScheduleData] = useState([]);
    const [chartOptions, setChartOptions] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedClassroom]);

    const fetchData = async () => {
        try {
            const storedToken = localStorage.getItem('access_token');
            const response = await axios.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            console.log("Fetched data:", response.data); // Log fetched data
            const parsedData = parseData(response.data);
            console.log("Parsed data:", parsedData); // Log parsed data
            setScheduleData(parsedData);
            updateTotalUsedTimeChartOptions(parsedData);
        } catch (err) {
            console.error('Error fetching data:', err);
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
                    console.log("Time Difference (minutes):", timeDiff);

                    // Calculate used time
                    const usedTime = timeDiff / 60; // Convert minutes to hours
                    totalUsedTime[day] += usedTime;
                }
            });
        });

        console.log("Total used time:", totalUsedTime); // Log total used time

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
                max: 15
            },
            colors: ["#BA68C8"],
            series: [
                {
                    name: "Total Used Time",
                    data: usedTimes
                }
            ]
        };

        console.log("Chart options:", options); // Log chart options

        setChartOptions(options);
    };

    useEffect(() => {
        if (chartOptions) {
            const chart = new ApexCharts(document.getElementById("daily-schedule-chart2"), chartOptions);
            chart.render();

            // Return a cleanup function to remove the chart when the component unmounts
            return () => chart.destroy();
        }
    }, [chartOptions]);

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="daily-schedule-chart2"/>
            <div className="mt-4">
                <hr className="my-3"/>
                <h3 className="text-lg font-semibold mb-2">Used Time Insight</h3>
                <p className="text-sm text-gray-600">
                    Total used time for each day based on the class schedule (in a 12-hour day)
                </p>
            </div>
        </div>
    );
}

export default DailyScheduleInsight2;
