import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import logger from "../loggers/logger";
import {useAuth} from "../service/AuthProvider";

function MostFreqProf({ selectedClassroom }) {
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const parseData = (data) => {
        const instructorCounts = {};

        data.forEach((course) => {
            const instructor = course.instructor;
            instructorCounts[instructor] = (instructorCounts[instructor] || 0) + 1;
        });
        logger.info("Instructor counts set")

        return instructorCounts;
    };

    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading to true before fetching new data
            try {
                logger.info('Requested data from classroom-courses'); // Log the response received
                const response = await axiosInstance.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`);
                logger.info('Received data from classroom-courses'); // Log the response received
                const parsedData = parseData(response.data);
                setScheduleData(parsedData);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setIsLoading(false); // Set loading to false in case of error
                if (err.response) {
                    logger.error('Server error:', err.response.data);
                } else if (err.request) {
                    logger.error('Network error:', err.message);
                } else {
                    logger.error('Error:', err.message);
                }
            }
        };

        fetchData(); // Fetch data when the selected classroom changes
    }, [selectedClassroom]);

    useEffect(() => {
        if (!isLoading && Object.keys(scheduleData).length > 0) {
            const instructors = Object.keys(scheduleData);
            const counts = Object.values(scheduleData);

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
                    categories: instructors
                },
                yaxis: {
                    title: {
                        text: "Number of Courses"
                    }
                },
                colors: ["#4A148C"],
                series: [
                    {
                        name: "Courses",
                        data: counts
                    }
                ]
            };

            const chart = new ApexCharts(document.getElementById("MostFreqProfChart"), options);
            chart.render();
            logger.info("Chart rendered")

            // Return a cleanup function to remove the chart when the component unmounts
            return () => chart.destroy();
        }
    }, [isLoading, scheduleData]);

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="MostFreqProfChart"/>
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Most Frequent Professors</h3>
                <p className="text-sm text-gray-600">Number of courses taught by each professor per classroom</p>
            </div>
        </div>
    );
}

export default MostFreqProf;
