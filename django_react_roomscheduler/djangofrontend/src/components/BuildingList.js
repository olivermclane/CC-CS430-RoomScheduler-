import React, { useEffect, useState } from 'react';
import Building from './Building';
import axios from 'axios';
import logger from "../loggers";

function BuildingList({ updateFloorList }) {
    const [endpoint, setEndpoint] = useState('/buildings');
    const [buildings, setBuildings] = useState([]);

    const fetchData = async (endpoint) => {
        try {
            const storedToken = localStorage.getItem('access_token');
            logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            logger.info('Response received:', response.data); // Log the response received
            setBuildings(response.data);
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

    function selectBuilding(building) {
        updateFloorList(building);
    }

    return (
        <div className="building-list">
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
