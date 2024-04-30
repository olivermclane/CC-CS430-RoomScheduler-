import React, {useEffect, useState} from "react";
import Classroom from "./Classroom";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger"
import DropdownTerm from "./DropdownTerm";

function ClassroomList({selectedFloor}){
    const [endpoint, setEndpoint] = useState("/classrooms")
    const [classrooms, setClassrooms] = useState([])
    const [selectedTerm, setSelectedTerm] = useState('')

    const { axiosInstance } = useAuth();

    const fetchData = async (endpoint) => {
        let complete_url = ""
        if(selectedTerm == ""){
            complete_url += endpoint;
        }else{
            complete_url = `/${selectedTerm}${endpoint}`
        }
        try {
            const response = await axiosInstance.get(`${complete_url}/`);
            logger.debug('Fetching data from endpoint:', selectedTerm, endpoint);
            setClassrooms(response.data);

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
    }, [endpoint, selectedTerm]);


    function renderClassroom(classroom){
        if(selectedFloor != null && classroom.floor.floor_id == selectedFloor.floor_id) {
            return <Classroom classroom={classroom}/>
        } else {
            return null
        }
    }

    const handleTermChange = (termId) => {
        logger.debug(termId)
        setSelectedTerm(termId);
    }

    return (
        <div className='text-gray-700 classroom-list'>
            <hr className="my-4 w-full"/>

            <div className="flex items-center justify-between mb-4">

                <h2>
                    Classroom List
                </h2>
                <DropdownTerm onTermChange={handleTermChange}/>
            </div>
            <div className='row pr-3'>
                {
                    classrooms.map(classroom => (
                            renderClassroom(classroom)
                        )
                    )
                }
            </div>
        </div>

    )

}

export default ClassroomList