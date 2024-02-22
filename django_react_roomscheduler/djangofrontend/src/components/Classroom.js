import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import Calendar from "./Calendar";

function Classroom({classroom, selectClassroom}){
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <div className='classroom card col-sm-3 m-1 text-center' onClick={() => {setShowCalendar(true)}}>
            <div className='card-body'>
                Classroom number: {classroom.classroom_number}
                <br />
                {classroom.total_seats}
                {showCalendar ? (
                     <Calendar selectedClassroom={selectClassroom}/>
                    ) : (
                        <p> No classroom schedule loaded </p>
                )
                    }
                Classroom total seats: {classroom.total_seats}
            </div>
        </div>

    )
}

export default Classroom