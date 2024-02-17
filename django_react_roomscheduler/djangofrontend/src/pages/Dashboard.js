import React, {useEffect, useState} from "react";
import Sidebar, {SidebarItem} from '../components/Sidebar';
import BuildingList from '../components/BuildingList';
import FloorList from '../components/FloorList';
import ClassroomList from '../components/ClassroomList';
import {BarChart3, Calendar, FileUp, LayoutDashboard, Settings, UserIcon} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);

    useEffect(() => {
            if(localStorage.getItem('access_token') === null){
                window.location.href = '/login'
            }
         }, []);
    function updateFloorList(building) {
        setSelectedBuilding(building);
        setSelectedFloor(null);
    }

    function updateClassroomList(floor) {
        setSelectedFloor(floor);
    }

    return (
        <div className="d-flex">
            <Sidebar className="sm:w-2/5">
                <SidebarItem
                    icon={<LayoutDashboard size={20}/>}
                    text="Dashboard"
                />
                <SidebarItem
                    icon={<BarChart3 size={20}/>}
                    text="Insights"
                />
                <SidebarItem
                    icon={<Calendar size={20}/>}
                    text="Saved Schedules"
                />
                <SidebarItem
                    icon={<FileUp size={20}/>}
                    text="Import"
                />
                <hr className='my-3'/>
                <SidebarItem
                    icon={<UserIcon size={20}/>}
                    text="Profile"
                />
                <SidebarItem
                    icon={<Settings size={20}/>}
                    text="Settings"
                />

            </Sidebar>
            <div className='sm:w-full'>
                <BuildingList updateFloorList={updateFloorList}/>
                <FloorList selectedBuilding={selectedBuilding} updateClassroomList={updateClassroomList}/>
                <ClassroomList selectedFloor={selectedFloor}/>
            </div>
        </div>
    )
}