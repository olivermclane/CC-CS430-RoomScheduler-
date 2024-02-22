import React, {useEffect, useState} from 'react'

import Building from "./Building";
import axios from "axios";

function BuildingList({updateFloorList}){
    const [endpoint, setEndpoint] = useState("/buildings")
    const [buildings, setBuildings] = useState([])

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            console.log(response.data)
            setBuildings(response.data);
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

    /*
    let url = "http://127.0.0.1:8000/buildings/"
    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            //console.log(jsonData)
            setBuildings(jsonData)
        })
    */
    function selectBuilding(building){
        updateFloorList(building)
    }
    return (
        <div className='building-list'>
            <h2>Building list</h2>
            <div className='row'>
                {
                    buildings.map(building=>(
                        <Building building={building} selectBuilding = {selectBuilding} />
                        )
                    )
                }
            </div>
        </div>
    )

}

export default BuildingList