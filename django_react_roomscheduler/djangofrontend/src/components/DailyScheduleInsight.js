import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import {useAuth} from "../service/auth/AuthProvider";

function DailyScheduleInsight({selectedTerm, selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);
    const [chartOptions, setChartOptions] = useState(null);
    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                const parsedData = parseData(response.data);
                setScheduleData(parsedData);
                updateChartOptions(parsedData);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [selectedClassroom]);

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

    const updateChartOptions = (data) => {
        const totalUnusedTime = {
            Monday: 15,
            Tuesday: 15,
            Wednesday: 15,
            Thursday: 15,
            Friday: 15
        };

        data.forEach(course => {
            Object.keys(totalUnusedTime).forEach(day => {
                if (course[day.toLowerCase()]) {
                    const startTime = course.start_time.split(":"); // Split the time string
                    const endTime = course.end_time.split(":"); // Split the time string

                    // Calculate the time difference in minutes
                    const timeDiff = (parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10)) - (parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10));

                    // Calculate unused time
                    const unusedTime = timeDiff / 60; // Convert minutes to hours
                    if (unusedTime > 0) {
                        totalUnusedTime[day] -= unusedTime;
                    } else {
                        totalUnusedTime[day] = 0;
                    }
                }
            });
        });


        const days = Object.keys(totalUnusedTime);
        const unusedTimes = Object.values(totalUnusedTime);


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
                    text: "Total Idle Time (hours)"
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
                    name: "Free hours",
                    data: unusedTimes
                }
            ]
        };

        setChartOptions(options);
    };

    useEffect(() => {
        if (chartOptions) {
            const chart = new ApexCharts(document.getElementById("daily-schedule-chart"), chartOptions);
            chart.render();

            return () => chart.destroy();
        }
    }, [chartOptions]);

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="daily-schedule-chart"/>
            <div className="mt-4">
                <hr className="my-3"/>
                <h3 className="text-lg font-semibold mb-2">Total Idle Time</h3>
                <p className="text-sm text-gray-600">
                    Total idle time for each day based on the class schedule (in a 15-hour day)
                </p>
            </div>
        </div>
    );
}

export default DailyScheduleInsight;
