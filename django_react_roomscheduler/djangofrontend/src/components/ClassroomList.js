import React, {useEffect, useState} from "react";
import Classroom from "./Classroom";
import axios from "axios";
import logger from "../loggers"

function ClassroomList({selectedFloor}){
    const [endpoint, setEndpoint] = useState("/classrooms")
    const [classrooms, setClassrooms] = useState([])

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            setClassrooms(response.data);
            logger.info('Response received:', response.data); // Log the response received
        } catch (err) {
            if (err.response) {
                logger.error("Server error:", err.response.data);
            } else if (err.request) {
                logger.error("Network error:", err.message);
            } else {
                logger.error("Error:", err.message);
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
        <div className='text-white classroom-list'>
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