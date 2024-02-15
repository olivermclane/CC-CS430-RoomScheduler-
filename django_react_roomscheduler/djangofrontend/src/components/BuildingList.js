import React, {useState} from 'react'

import Building from "./Building";

function BuildingList({updateFloorList}){
    const [buildings, setBuildings] = useState([
        {
            building_id: 1,
            building_name: 'St. Charles'
        },
        {
            building_id: 2,
            building_name: 'Simpermon'
        },
        {
            building_id: 3,
            building_name: 'Trinity'
        }
    ])
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