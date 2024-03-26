import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import {useAuth} from "../service/AuthProvider";

function ScheduleInsight({selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state
    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading to true before fetching new data
            try {
                const response = await axiosInstance.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`);
                const parsedData = parseData(response.data);
                setScheduleData(parsedData);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setIsLoading(false); // Set loading to false in case of error
                if (err.response) {
                    console.log('Server error:', err.response.data);
                } else if (err.request) {
                    console.log('Network error:', err.message);
                } else {
                    console.log('Error:', err.message);
                }
            }
        };

        fetchData(); // Fetch data when the selected classroom changes
    }, [selectedClassroom]); // Add selectedClassroom as a dependency

    useEffect(() => {
        let chart = null; // Initialize chart variable

        if (!isLoading && scheduleData.length > 0) {
            const categories = scheduleData.map(scheduleData => scheduleData.course_name);
            const seatUsages = scheduleData.map(scheduleData => (scheduleData.enrollment_total / scheduleData.total_seats) * 100);
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
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: categories,
                },
                colors: ["#4A148C"],
                series: [
                    {
                        name: "Seat Usage (%)",
                        data: seatUsages,
                    }
                ],
            };

            // Destroy previous chart instance if it exists
            if (chart) {
                chart.destroy();
            }

            // Render new chart
            chart = new ApexCharts(document.getElementById("bar-chart"), options);
            chart.render();
        }

        return () => {
            // Clean up: destroy the chart instance when component unmounts
            if (chart) {
                chart.destroy();
            }
        };
    }, [isLoading, scheduleData]);


    const parseData = (data) => {
        return data.map(course => ({
            course_id: course.course_id,
            course_name: course.course_name,
            enrollment_total: course.enrollment_total,
            total_seats: course.classroom.total_seats
        }));
    };


    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="bar-chart"/>
            {isLoading && <p>Loading...</p>}
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Seat Usage (%)</h3>
                <p className="text-sm text-gray-600">For each of the courses in a classroom, the percentage of total
                    seats used</p>
            </div>
        </div>
    );
}

export default ScheduleInsight;
