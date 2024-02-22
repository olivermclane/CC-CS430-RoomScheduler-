import React,  {useState} from "react";
import Classroom from "./Classroom";
import Calendar from "./Calendar";

function ClassroomList({selectedFloor}){
    const [classrooms, setClassroom] = useState([
        {
            classroom_id: 1,
            classroom_number: '123',
            total_seats: 15,
            floor_id: 2
        },
        {
            classroom_id: 2,
            classroom_number: '465',
            total_seats: 25,
            floor_id: 2
        },
        {
            classroom_id: 3,
            classroom_number: '789A',
            total_seats: 150,
            floor_id: 5
        }

    ])


    function renderClassroom(classroom){
        if(selectedFloor != null && classroom.floor_id == selectedFloor.floor_id) {
            return <Classroom classroom={classroom}/>
        } else {
            return null
        }
    }

    return (
        <div className='classroom-list'>
            <h2>
                Classroom list
            </h2>
            <div className='row'>
                {
                    classrooms.map(classroom =>(
                            renderClassroom(classroom)
                        )
                    )
                }
            </div>
        </div>
    )

}

export default ClassroomList