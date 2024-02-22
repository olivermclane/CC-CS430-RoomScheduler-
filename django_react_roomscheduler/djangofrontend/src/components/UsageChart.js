import React, {useEffect} from "react";
import ApexCharts from "apexcharts";

function ScheduleInsight() {
    // Hardcoded data for demonstration
    const scheduleData = [
        {
            "course_id": 1,
            "course_name": "Equine Facilities Management 2",
            "enrollment_total": 4,
            "total_seats": 20
        },
        {
            "course_id": 2,
            "course_name": "Equine Nutrition",
            "enrollment_total": 12,
            "total_seats": 30
        },
        {
            "course_id": 3,
            "course_name": "Equine Reproduction",
            "enrollment_total": 8,
            "total_seats": 25
        }
    ];

    // Extracting course names and enrollment totals from the data
    const categories = scheduleData.map(data => data.course_name);
    const seatUsages = scheduleData.map(data => (data.enrollment_total / data.total_seats) * 100);

    // Chart options with hardcoded data
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

// Render the chart once the component mounts
    useEffect(() => {
        const chart = new ApexCharts(document.getElementById("bar-chart"), options);
        chart.render();

        // Return a cleanup function to remove the chart when the component unmounts
        return () => chart.destroy();
    }, []);

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6">
            <div id="bar-chart"/>
            <div className="mt-4">
                <hr className='my-3'/>
                <h3 className="text-lg font-semibold mb-2">Seat Usage (%)</h3>
                <p className="text-sm text-gray-600">For each of the courses in a classroom, the percentage of total
                    seats
                    used</p>
            </div>
        </div>
    );
}

export default ScheduleInsight;
