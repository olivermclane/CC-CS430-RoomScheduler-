import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"

function Building({building, selectBuilding}){
    return (
        <div className='building card col-sm-3 m-1 text-center' style={{
                backgroundImage: `url(`+building.image_url+`)`
            }} onClick={() => {selectBuilding(building)}}>
            <div className='card-body'>
                <div className='building-name'>
                    {building.building_name}
                </div>
            </div>
        </div>
    )
}

export default Building