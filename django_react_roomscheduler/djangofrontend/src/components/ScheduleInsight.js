import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";

function ScheduleInsight({selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);
    const {axiosInstance} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            console.log(selectedClassroom)
            try {
                if (selectedClassroom) {

                    logger.info('Requested data from classroom-courses'); // Log the response received

                    const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                    if (response && response.data) {
                        logger.info('Received data from classroom-courses'); // Log the response received

                        const parsedData = parseData(response.data);
                        setScheduleData(parsedData);
                    } else {
                        logger.info('No data returned from API');
                        setScheduleData([]); // Set empty array if no data is received
                    }
                }
            } catch (err) {
                if (err.response) {
                    logger.info('Server error:', err.response.data);
                } else if (err.request) {
                    logger.info('Network error:', err.message);
                } else {
                    logger.info('Error:', err.message);
                }
            }
        };

        fetchData();
    }, [selectedClassroom]);

    useEffect(() => {
        let chart = null; // Initialize chart variable

        if (scheduleData.length > 0) {
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
            if (chart) {
                chart.destroy();
                logger.info("Chart destroyed")
            }
        };
    }, [scheduleData]);


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
