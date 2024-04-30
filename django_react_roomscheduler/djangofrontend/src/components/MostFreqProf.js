import React, {useEffect, useState} from "react";
import ApexCharts from "apexcharts";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";


function MostFreqProf({selectedClassroom}) {
    const [scheduleData, setScheduleData] = useState([]);

    const parseData = (data) => {
        const instructorCounts = {};

        data.forEach((course) => {
            const instructor = course.instructor;
            instructorCounts[instructor] = (instructorCounts[instructor] || 0) + 1;
        });
        logger.debug("Instructor counts set")

        return instructorCounts;
    };

    const {axiosInstance} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
                try {
                    if (selectedClassroom) {
                        logger.debug('Requested data from classroom-courses');
                        const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                        logger.debug('Received data from classroom-courses');
                        const parsedData = parseData(response.data);
                        setScheduleData(parsedData);
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

        fetchData(); // Fetch data when the selected classroom changes
    }, [selectedClassroom]);

    useEffect(() => {
        if (Object.keys(scheduleData).length > 0) {
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
            logger.debug("Chart rendered")

            // Return a cleanup function to remove the chart when the component unmounts
            return () => chart.destroy();
        }
    }, [scheduleData]);

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
