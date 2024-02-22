import React, {useEffect, useState} from "react";
import Classroom from "./Classroom";
import axios from "axios";

function ClassroomList({selectedFloor}){
    const [endpoint, setEndpoint] = useState("/classrooms")
    const [classrooms, setClassrooms] = useState([])


    /*let url = "http://127.0.0.1:8000/classrooms/"
    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            //console.log(jsonData)
            setClassrooms(jsonData)
        })*/

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            console.log(response.data)
            setClassrooms(response.data);
        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else if (err.request) {
                console.log("Network error:", err.message);
            } else {
                console.log("Error:", err.message);
            }
        }
    };
    useEffect(() => {
        fetchData(endpoint);
    }, [endpoint]);


    function renderClassroom(classroom){
        if(selectedFloor != null && classroom.floor.floor_id == selectedFloor.floor_id) {
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