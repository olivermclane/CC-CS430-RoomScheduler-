import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./Calendar";

function Classroom({ classroom, selectClassroom }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleCalendarClick = (e) => {
    // Prevent event propagation when clicking inside the calendar
    e.stopPropagation();
  };

  return (
    <div
      className="classroom card max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6"
      onClick={() => setShowCalendar(!showCalendar)} // Toggle showCalendar state
    >
      <div className="card-body">
        Classroom number: {classroom.classroom_number}
        <br />
        Classroom total seats: {classroom.total_seats}
        {showCalendar ? (
          <div onClick={handleCalendarClick}>
            <Calendar selectedClassroom={classroom.classroom_id} />
          </div>
        ) : (
          <p> No classroom schedule loaded </p>
        )}
      </div>
    </div>
  );
}

export default Classroom;
