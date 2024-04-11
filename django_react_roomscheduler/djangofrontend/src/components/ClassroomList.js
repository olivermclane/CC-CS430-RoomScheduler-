import React, {useEffect, useState} from "react";
import Classroom from "./Classroom";
import axios from "axios";
import {useAuth} from "../service/AuthProvider";
import DropdownTerm from "./DropdownTerm";

function ClassroomList({selectedFloor}){
    const [endpoint, setEndpoint] = useState("/classrooms")
    const [classrooms, setClassrooms] = useState([])
    const [selectedTerm, setSelectedTerm] = useState('')

    const { axiosInstance } = useAuth();

    const fetchData = async (endpoint) => {

        try {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/${selectedTerm}${endpoint}/`);
            setClassrooms(response.data);
            console.log(response.data)
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
    }, [endpoint, selectedTerm]);


    function renderClassroom(classroom){
        if(selectedFloor != null && classroom.floor.floor_id == selectedFloor.floor_id) {
            return <Classroom classroom={classroom}/>
        } else {
            return null
        }
    }

    const handleTermChange = (termId) => {
        console.log(termId)
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