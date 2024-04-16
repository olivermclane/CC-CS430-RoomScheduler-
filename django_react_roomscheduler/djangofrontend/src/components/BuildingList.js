import React, {useEffect, useState} from 'react'

import Building from "./Building";
import {useAuth} from "../service/auth/AuthProvider";
import logger from "../loggers/logger";

function BuildingList({updateFloorList}){
    const [endpoint, setEndpoint] = useState("/buildings")
    const [buildings, setBuildings] = useState([])
    const { axiosInstance } = useAuth();

    const fetchData = async (endpoint) => {
        try {
            const response = await axiosInstance.get(`${endpoint}/`);
            setBuildings(response.data);
            logger.info('Response received:'); // Log the response received

        } catch (err) {
            if (err.response) {
                logger.error('Server error:', err.response.data);
            } else if (err.request) {
                logger.error('Network error:', err.message);
            } else {
                logger.error('Error:', err.message);
            }
        }
    };

    useEffect(() => {
        fetchData(endpoint);
    }, [endpoint]);


    function selectBuilding(building){
        updateFloorList(building)
        let buildings = document.getElementsByClassName("building")
        for (let i = 0; i < buildings.length; i++) {
            buildings[i].style.border = "0px";
        }
        document.getElementById("building-" + building.building_id).style.border = "10px solid violet"
    }

    return (
        <div className='text-gray-700 building-list'>
            <h2>Building list</h2>
            <div className="row">
                {buildings.map((building) => (
                    <Building key={building.id} building={building} selectBuilding={selectBuilding} />
                ))}
            </div>
        </div>
    );
}

export default BuildingList;
