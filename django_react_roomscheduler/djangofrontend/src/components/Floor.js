import React,  {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'

function Floor({floor, selectFloor}){
    return (
        <div className='floor card col-sm-3 m-1 text-center' onClick={()=>{selectFloor(floor)}}>
            <div className='class-body'>
                {floor.floor_name}
                <br />
                Building ID: {floor.building_id}
            </div>
        </div>
    )

}

export default Floor