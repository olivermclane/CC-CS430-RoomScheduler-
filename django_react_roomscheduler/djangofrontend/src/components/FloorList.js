import React, {useEffect, useState} from "react";
import Floor from "./Floor";
import axios from "axios";

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
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            console.log(response.data)
            setFloors(response.data);
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