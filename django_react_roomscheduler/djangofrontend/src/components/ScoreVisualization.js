import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import {
    FaClock,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaTimes,
    FaBookOpen,
    FaRegHourglass,
    FaChartPie, FaCheck
} from 'react-icons/fa';
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";

const ScoreVisualization = ({selectedClassroom}) => {
    const [chartOptions, setChartOptions] = useState({
        chart: {
            height: 600,
            type: "radar",
        },
        toolbar: {
            show: false
        },
        xaxis: {
            categories: ['Prime Time Score', 'Capacity Score', 'Instructor Score', 'Idle Time Score', 'Double Booking Penalty'],
        },
        title: {
            text: "Optimization Score Breakdown",
            align: "center",
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["#4A148C"],
            dashArray: 0,
        },
        markers: {
            size: 4,
            colors: ["#BA68C8"],
            strokeColors: "#BA68C8",
        },
        fill: {
            colors: ['#BA68C8'],
            opacity: 0.4,
        },
        dataLabels: {
            enabled: true,
            background: {
                enabled: true,
                foreColor: '#4A148C',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#BA68C8',
                opacity: 0.7,
            },
            style: {
                colors: ['#fff'],
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
        },
        yaxis: {
            tickAmount: 7,
        },
        labels: ['Prime Time Score', 'Capacity Score', 'Instructor Score', 'Idle Time Score', 'Double Booking Penalty']
    });

    const [chartSeries, setChartSeries] = useState([]);
    const [overallScore, setOverallScore] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [scoreData, setScoreData] = useState(false);
    const {axiosInstance} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                const courseData = response.data[0];
                const optimizationScores = courseData.classroom.optimization_score;
                setScoreData(optimizationScores)
                setChartSeries([{
                    name: "Optimization Score",
                    data: [
                        parseFloat(optimizationScores.prime_time_score),
                        parseFloat(optimizationScores.capacity_score),
                        parseFloat(optimizationScores.instructor_score),
                        parseFloat(optimizationScores.idle_time_score),
                        parseFloat(optimizationScores.double_booking_score),
                    ],
                }]);

                setOverallScore(courseData.classroom.optimization_score.overall_score);
            } catch (err) {
                logger.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [selectedClassroom]);

    // Styles for the slide-up detail panel
    const detailPanelStyles = showDetails ? {
        transform: "translateY(0)",
        transition: "transform 0.3s ease-in-out",
        overflow: "hidden",
    } : {
        transform: "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
        overflow: "hidden",
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden relative p-10">
            <div className="md:flex">
                <div className="flex-1 relative " style={{height: '500px'}}>
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="radar"
                        height={500}
                    />
                </div>

                <div className="absolute bottom-10 right-2 p-4">
                    <FaChartPie
                        className="text-2xl cursor-pointer"
                        style={{color: "#B197FC",}}
                        onMouseEnter={() => setShowDetails(true)}
                        onMouseLeave={() => setShowDetails(false)}
                    />
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 w-full bg-gray-100 p-4 text-sm shadow-lg"
                style={detailPanelStyles}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                <div className="font-bold text-lg text-center mb-2">Score Details</div>
                <div className="flex justify-around items-center">
                    <p><FaRegHourglass/> Prime Time Score: {chartSeries[0]?.data[0]}</p>
                    <p><FaUserGraduate/> Capacity Score: {chartSeries[0]?.data[1]}</p>
                    <p><FaChalkboardTeacher/> Instructor Score: {chartSeries[0]?.data[2]}</p>
                    <p><FaClock/> Idle Time Score: {chartSeries[0]?.data[3]}</p>
                    <p><FaBookOpen/> Double Booking Penalty: {chartSeries[0]?.data[4]}</p>
                </div>
                <div className="font-bold text-lg text-center mt-4">Methodology</div>
                <div className="flex justify-around items-center mt-2 mb-4">
                    <p><FaClock/> Prime Time Utilization: {overallScore}</p>
                    <p>Instructor Methods: {scoreData?.instructor_methods?.join(", ")}</p>
                    {scoreData && scoreData.double_booking && (
                        <p><FaTimes/> Double Booking: Yes</p>
                    )}

                    {scoreData && scoreData.double_booking === false && (
                        <p><FaCheck/> Double Booking: No</p>
                    )}
                </div>
            </div>

            <div className="text-center p-4">
                <p className="text-xl font-semibold">Overall Score: {overallScore}</p>
                <hr className="my-4"/>
                <h3 className="text-lg font-semibold mb-2">Optimization Score</h3>
                <p className="text-sm text-gray-600 px-4">
                    There are several factors that influence this score including Prime Time Utilization, Seat Usage,
                    Idle Time, and Instructor Methods (Lab, Lecture, Seminar, etc.).
                </p>
            </div>
        </div>
    );
};

export default ScoreVisualization;

