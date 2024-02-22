import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

function DailyScheduleInsight() {
  // Hardcoded data for demonstration
  const scheduleData = [
    {
      course_id: 1,
      course_name: "Equine Facilities Management 2",
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      start_time: "09:00",
      end_time: "12:00"
    },
    {
      course_id: 2,
      course_name: "Equine Nutrition",
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: false,
      start_time: "13:00",
      end_time: "15:00"
    },
    {
      course_id: 3,
      course_name: "Equine Reproduction",
      monday: true,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      start_time: "10:00",
      end_time: "12:00"
    }
  ];

  // Object to store total unused time for each day
  const totalUnusedTime = {
    Monday: 12,
    Tuesday: 12,
    Wednesday: 12,
    Thursday: 12,
    Friday: 12
  };

  // Calculate total unused time for each day
  scheduleData.forEach(course => {
    Object.keys(totalUnusedTime).forEach(day => {
      if (course[day.toLowerCase()]) {
        const startTime = new Date(`1970-01-01T${course.start_time}:00Z`);
        const endTime = new Date(`1970-01-01T${course.end_time}:00Z`);
        const timeDiff = endTime.getTime() - startTime.getTime();
        totalUnusedTime[day] -= timeDiff / (1000 * 3600); // Convert milliseconds to hours
      }
    });
  });

  // Extract day labels and total unused times from the data
  const days = Object.keys(totalUnusedTime);
  const unusedTimes = Object.values(totalUnusedTime);

  // Chart options
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
        text: "Total Unused Time (hours)"
      },
      max: 12 // Maximum value for the y-axis (total hours in a day)
    },
    colors: ["#BA68C8"],
    series: [
      {
        name: "Total Unused Time",
        data: unusedTimes
      }
    ]
  };

  // Render the chart once the component mounts
  useEffect(() => {
    const chart = new ApexCharts(document.getElementById("daily-schedule-chart"), options);
    chart.render();

    // Return a cleanup function to remove the chart when the component unmounts
    return () => chart.destroy();
  }, []);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6">
      <div id="daily-schedule-chart" />
      <div className="mt-4">
        <hr className="my-3" />
        <h3 className="text-lg font-semibold mb-2">Daily Schedule Insight</h3>
        <p className="text-sm text-gray-600">
          Total unused time for each day based on the class schedule (in a 12-hour day)
        </p>
      </div>
    </div>
  );
}

export default DailyScheduleInsight;
