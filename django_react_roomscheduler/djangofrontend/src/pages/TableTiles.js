import React, { Fragment, useState } from "react";
import Table from "../components/Table";
import BuildingList from "../components/BuildingList";
import FloorList from "../components/FloorList";
import ClassroomList from "../components/ClassroomList";
import Calendar from "../components/Calendar";
import logger from "../loggers/logger";

export default function DashboardPage() {
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [showTable, setShowTable] = useState(true);

    let calendarShowing = false;


    function updateFloorList(building) {
        setSelectedBuilding(building);
        logger.info("Selected building updated")
        setSelectedFloor(null);
    }

    function updateClassroomList(floor) {
        setSelectedFloor(floor);
        logger.info("Classroom list updated")
    }

    function updateClassroom(classroom){
        setSelectedClassroom(classroom)
        logger.info("Classroom updated")
    }


    return (
        <Fragment>
            {showTable ? (
                <Fragment>
                    <Table />
                    <button
                        className="mt-4 p-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 flex items-center justify-center"
                        onClick={() => setShowTable(false)}
                    >
                        Show Tiles
                    </button>
                </Fragment>
            ) : (
                <Fragment>
                    <BuildingList updateFloorList={updateFloorList}/>
                    <br/><br/>
                    <FloorList selectedBuilding={selectedBuilding} updateClassroomList={updateClassroomList}/>
                    <br/><br/>
                    <ClassroomList selectedFloor={selectedFloor} updateClassroom={updateClassroom}/>
                    <br/><br/>

                    <button
                        className="mt-4 p-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 flex items-center justify-center"
                        onClick={() => setShowTable(true)}
                    >
                        Show Table
                    </button>
                </Fragment>
            )}


        </Fragment>
    );
}