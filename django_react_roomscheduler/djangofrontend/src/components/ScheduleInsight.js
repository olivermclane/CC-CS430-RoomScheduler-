import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import logger from "../loggers";

function ScheduleInsight({selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading to true before fetching new data
            try {
                const storedToken = localStorage.getItem('access_token');
                logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
                const response = await axios.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const parsedData = parseData(response.data);
                logger.info("Data received")
                setScheduleData(parsedData);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setIsLoading(false); // Set loading to false in case of error
                if (err.response) {
                    logger.info('Server error:', err.response.data);
                } else if (err.request) {
                    logger.info('Network error:', err.message);
                } else {
                    logger.info('Error:', err.message);
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
            logger.info("Chart rendered")
        }

        return () => {
            // Clean up: destroy the chart instance when component unmounts
            if (chart) {
                chart.destroy();
                logger.info("Chart destroyed")
            }
        };
    }, [isLoading, scheduleData]);


    const parseData = (data) => {
        logger.info("Data parsed")
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
