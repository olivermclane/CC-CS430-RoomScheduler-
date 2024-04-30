import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import { useAuth } from "../service/auth/AuthProvider";
import logger from "../loggers/logger";

function SeatVisualization2({ selectedClassroom }) {
    const [scheduleData, setScheduleData] = useState([]);
    const { axiosInstance } = useAuth();
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedClassroom) {
                    logger.debug('Requested data from classroom-courses');

                    const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                    if (response && response.data) {
                        logger.debug('Received data from classroom-courses');
                        const parsedData = parseData(response.data);
                        setScheduleData(parsedData);
                    } else {
                        logger.debug('No data returned from API');
                        setScheduleData([]);
                    }
                }
            } catch (err) {
                if (err.response) {
                    logger.error('Server error:', err.response.data);
                } else if (err.request) {
                    logger.error('Network error:', err.message);
                } else {
                    logger.error('Error:', err.message);
                }
            }
        };

        fetchData();
    }, [selectedClassroom]);

    useEffect(() => {
        if (scheduleData.length > 0) {
            logger.debug('Rendering chart with data:', scheduleData);

            const categories = scheduleData.map(scheduleData => scheduleData.course_name);
            const totalEnroll = scheduleData.map(scheduleData => scheduleData.total_enrol);
            const totalSeats = scheduleData.map(scheduleData => scheduleData.total_seats);
            const options = {
                chart: {
                    type: "bar",
                    height: 800,
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
                yaxis:{
                    max: Math.max(...totalSeats)
                },
                colors: ["#BA68C8"],
                series: [
                    {
                        name: "Total Used Seats",
                        data: totalEnroll,
                    }
                ],
            };

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const chart = new ApexCharts(document.getElementById("seat-chart"), options);
            chart.render();
            chartRef.current = chart;

            logger.debug("Chart rendered");
        }
    }, [scheduleData]);

    const parseData = (data) => {
        logger.debug("Data parsed");
        const parsedData = data.map(course => ({
            course_id: course.course_id,
            course_name: course.course_name,
            total_enrol: course.enrollment_total,
            total_seats: course.classroom.total_seats
        }));

        return parsedData;
    };

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6 mt-4">
            <div id="seat-chart"/>
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Total Seats</h3>
                <p className="text-sm text-gray-600">Total number of seats for each course in the classroom</p>
            </div>
        </div>
    );
}

export default SeatVisualization2;