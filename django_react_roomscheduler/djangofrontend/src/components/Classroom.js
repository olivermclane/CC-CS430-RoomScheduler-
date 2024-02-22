import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import Calendar from "./Calendar";

function Classroom({classroom, selectClassroom}){
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <div className='classroom card col-sm-15 m-1 text-center' onClick={() => {
            if(showCalendar === true) {
                setShowCalendar(false)
            }else{setShowCalendar(true)}}}>



            <div className='card-body'>
                Classroom number: {classroom.classroom_number}
                <br />
                Classroom total seats: {classroom.total_seats}
                {showCalendar ? (
                     <Calendar selectedClassroom={classroom.classroom_id}/>
                    ) : (
                        <p> No classroom schedule loaded </p>
                )
                    }
            </div>
        </div>

    )
}

export default Classroom