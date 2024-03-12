import React, {useEffect, useState} from "react";
import Floor from "./Floor";
import axios from "axios";

function FloorList({selectedBuilding, updateClassroomList}){
    const [endpoint, setEndpoint] = useState("/floors")
    const [floors, setFloors] = useState([])

    const fetchData = async (endpoint) => {

        try {
            const storedToken = localStorage.getItem("access_token");
            const response = await axios.get(`http://127.0.0.1:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
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
        let floors = document.getElementsByClassName("floor")
        for (let i = 0; i < floors.length; i++) {
            floors[i].style.border = "0px";
        }
        document.getElementById("floor-" + floor.floor_id).style.border = "10px solid violet"
    }

    function renderFloor(floor){
        if(selectedBuilding != null && floor.building.building_id == selectedBuilding.building_id) {
            return <Floor floor={floor} selectFloor={selectFloor}/>
        } else {
            return null
        }
    }

    return (
        <div className='text-white floor-list'>
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