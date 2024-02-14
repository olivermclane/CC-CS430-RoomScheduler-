import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"

function Building({building, selectBuilding}){
    return (
        <div className='building card col-sm-3 m-1 text-center' onClick={() => {selectBuilding(building)}}>
            <div className='card-body'>
                {building.building_name}
            </div>
        </div>
    )
}

export default Building