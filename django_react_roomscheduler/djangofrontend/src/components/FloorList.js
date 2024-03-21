import React, {useEffect, useState} from "react";
import Floor from "./Floor";
import axios from "axios";
import logger from "../loggers";

function FloorList({selectedBuilding, updateClassroomList}){
    const [endpoint, setEndpoint] = useState("/floors")
    const [floors, setFloors] = useState([])

    /*let url = "http://127.0.0.1:8000/floors/"
    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            //console.log(jsonData)
            setFloors(jsonData)
        })*/

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            logger.info('Response received:', response.data); // Log the response received
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
    }

    function renderFloor(floor){
        if(selectedBuilding != null && floor.building.building_id == selectedBuilding.building_id) {
            return <Floor floor={floor} selectFloor={selectFloor}/>
        } else {
            return null
        }
    }

    return (
        <div className='floor-list'>
            <h2>
                Floor list
            </h2>
            <div className='row'>
                {
                    floors.map(floor =>(
                            renderFloor(floor)
                        )
                    )
                }
            </div>
        </div>
    )

}

export default FloorList