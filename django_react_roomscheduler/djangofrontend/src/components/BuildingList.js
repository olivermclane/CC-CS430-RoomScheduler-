import React, { useEffect, useState } from 'react';
import Building from './Building';
import logger from "../loggers";
import {useAuth} from "../service/AuthProvider";

function BuildingList({updateFloorList}){
    const [endpoint, setEndpoint] = useState("/buildings")
    const [buildings, setBuildings] = useState([])
    const { axiosInstance } = useAuth();

    const fetchData = async (endpoint) => {
        try {
            logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
            const response = await axiosInstance.get(`http://127.0.0.1:8000${endpoint}/`);
            setBuildings(response.data);
            logger.info('Response received:', response.data); // Log the response received

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
