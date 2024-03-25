import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ScoreVisualization = ({ selectedClassroom }) => {
    const [chartOptions, setChartOptions] = useState({
    chart: {
        height: 500,
        type: "radar",
    },
    xaxis: {
        categories: ['Prime Time Score', 'Capacity Score', 'Instructor Score', 'Idle Time Score'],
    },
    title: {
        text: "Optimization Score Breakdown",
        align: "center",
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["#4A148C"], // Outline color for the radar area
        dashArray: 0,
    },
    markers: {
        size: 4,
        colors: ["#BA68C8"], // Color for the markers (data points)
        strokeColors: "#BA68C8",
    },
    fill: {
        colors: ['#BA68C8'], // Fill color for the radar area
        opacity: 0.4, // Adjust opacity as needed
    },
    dataLabels: {
        enabled: true,
        background: {
            enabled: true,
            foreColor: '#4A148C', // Text color
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#BA68C8', // Border color for the label background
            opacity: 0.7, // Adjust background opacity as needed
        },
        style: {
            colors: ['#fff'], // Text color
        },
        formatter: function(val, opts) {
            return val; // Format data label text if needed
        },
    },
    tooltip: {
        y: {
            formatter: function(val) {
                return val;
            },
        },
    },
    yaxis: {
        tickAmount: 7,
    },
    labels: ['Prime Time Score', 'Capacity Score', 'Instructor Score', 'Idle Time Score']
});

    const [chartSeries, setChartSeries] = useState([]);
    const [overallScore, setOverallScore] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('access_token');
                const response = await axios.get(`http://127.0.0.1:8000/classroom-courses/${selectedClassroom}/`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const courseData = response.data[0]; // Assuming response.data contains the array of courses
                const optimizationScores = courseData.classroom.optimization_score;

                setChartSeries([{
                    name: "Optimization Score",
                    data: [
                        parseFloat(optimizationScores.prime_time_score),
                        parseFloat(optimizationScores.capacity_score),
                        parseFloat(optimizationScores.instructor_score),
                        parseFloat(optimizationScores.idle_time_score),
                    ],
                }]);

                setOverallScore(courseData.classroom.optimization_score.overall_score);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [selectedClassroom]);

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div className="mt-4">
                <div id="chart">
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="radar"
                        height={800}
                    />
                </div>
                <div style={{textAlign: "center", marginTop: "20px"}}>
                    <p style={{fontSize: "20px", fontWeight: "bold"}}>Overall Score: {overallScore}</p>
                </div>
                <hr className="my-3"/>
                <h3 className="text-lg font-semibold mb-2">Optimization Score</h3>
                <p className="text-sm text-gray-600">
                    There are several factors that influence this score including Prime Time Utilization, Seat Usage, Idle Time and Instructor Methods (Lab, Lecture, Seminar, etc.),
                </p>
            </div>
        </div>

        );
}

export default ScoreVisualization;
