import React,  {useState} from "react";

import Floor from "./Floor";

function FloorList({selectedBuilding, updateClassroomList}){
    const [floors, setFloors] = useState([
        {
            floor_id: 1,
            floor_name: 'first floor',
            building_id: 1
        },
        {
            floor_id: 2,
            floor_name: 'second floor',
            building_id: 1
        },
        {
            floor_id: 3,
            floor_name: 'first floor',
            building_id: 2
        },
        {
            floor_id: 4,
            floor_name: "second floor",
            building_id: 2
        },
        {
            floor_id: 5,
            floor_name: 'third floor',
            building_id: 2
        },
        {
            floor_id: 6,
            floor_name: 'first floor',
            building_id: 3
        }
    ])

    function selectFloor(floor){
        updateClassroomList(floor)
    }

    function renderFloor(floor){
        if(selectedBuilding != null && floor.building_id == selectedBuilding.building_id) {
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