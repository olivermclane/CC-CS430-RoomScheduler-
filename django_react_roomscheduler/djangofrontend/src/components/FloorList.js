import React, {useEffect, useState} from "react";
import Floor from "./Floor";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";


function FloorList({selectedBuilding, updateClassroomList}){
    const [endpoint, setEndpoint] = useState("/floors")
    const [floors, setFloors] = useState([])
    const { axiosInstance } = useAuth();

    const fetchData = async (endpoint) => {

        try {
            logger.debug('Requesting received from floors');
            const response = await axiosInstance.get(`${endpoint}/`);
            logger.debug('Received data from floors');
            setFloors(response.data);
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

    function selectFloor(floor){
        updateClassroomList(floor)
        let floors = document.getElementsByClassName("floor")
        for (let i = 0; i < floors.length; i++) {
            floors[i].style.border = "0px";
        }
        document.getElementById("floor-" + floor.floor_id).style.border = "10px solid DarkOrchid"
    }

    function renderFloor(floor){
        if(selectedBuilding != null && floor.building.building_id === selectedBuilding.building_id) {
            return <Floor floor={floor} selectFloor={selectFloor}/>
        } else {
            return null
        }
    }

    return (
        <div className='text-gray-700 floor-list'>
            <hr className="my-4 w-full"/>

            <h2>
                Floor list
            </h2>
            <div className='row'>
                {
                    floors.map(floor => (
                            renderFloor(floor)
                        )
                    )
                }
            </div>
        </div>
    )

}

export default FloorList