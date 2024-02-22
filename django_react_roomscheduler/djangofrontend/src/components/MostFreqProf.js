import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

function MostFreqProf() {
  // Hardcoded data for demonstration
  const scheduleData = [
  {
    course_id: 1,
    course_name: "Equine Facilities Management 2",
    instructor: "Dr. Smith"
  },
  {
    course_id: 2,
    course_name: "Equine Nutrition",
    instructor: "Dr. Johnson"
  },
  {
    course_id: 3,
    course_name: "Equine Reproduction",
    instructor: "Dr. Brown"
  },
  {
    course_id: 4,
    course_name: "Equine Anatomy",
    instructor: "Dr. Miller"
  },
  {
    course_id: 5,
    course_name: "Equine Exercise Physiology",
    instructor: "Dr. Wilson"
  },
  {
    course_id: 6,
    course_name: "Equine Surgery",
    instructor: "Dr. Martinez"
  },
  {
    course_id: 7,
    course_name: "Equine Dentistry",
    instructor: "Dr. Garcia"
  },
  {
    course_id: 8,
    course_name: "Equine Pharmacology",
    instructor: "Dr. Thompson"
  },
  {
    course_id: 9,
    course_name: "Equine Reproductive Techniques",
    instructor: "Dr. Brown"
  },
  {
    course_id: 10,
    course_name: "Equine Orthopedics",
    instructor: "Dr. Martinez"
  },
  {
    course_id: 11,
    course_name: "Equine Cardiology",
    instructor: "Dr. Thompson"
  }
];


  // Count occurrences of instructors
  const instructorCounts = scheduleData.reduce((counts, course) => {
    counts[course.instructor] = (counts[course.instructor] || 0) + 1;
    return counts;
  }, {});

  // Extract instructors and their counts
  const instructors = Object.keys(instructorCounts);
  const counts = Object.values(instructorCounts);

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

  // Render the chart once the component mounts
  useEffect(() => {
    const chart = new ApexCharts(document.getElementById("MostFreqProf"), options);
    chart.render();

    // Return a cleanup function to remove the chart when the component unmounts
    return () => chart.destroy();
  }, []);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6">
      <div id="MostFreqProf" />
      <div className="mt-4">
        <hr className="my-3" />
        <h3 className="text-lg font-semibold mb-2">Most Prevalent Professors</h3>
        <p className="text-sm text-gray-600">
          Number of courses taught by each professor
        </p>
      </div>
    </div>
  );
}

export default MostFreqProf;
