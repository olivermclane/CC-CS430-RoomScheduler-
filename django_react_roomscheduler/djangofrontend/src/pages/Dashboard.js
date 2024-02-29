import React, {useEffect, useState} from "react";
import Sidebar, {SidebarItem} from '../components/Sidebar';
import TableTiles from './TableTiles'

import {BarChart3, Calendar, FileUp, LayoutDashboard, Settings, UserIcon} from "lucide-react";
import ImportPage from "./Import";
import Insight from "./Insight";
import ImportNewTerm from "./ImportNewTerm";
export default function Dashboard() {

    const [selectedItem, setSelectedItem] = useState("dashboard");

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
    }, []);

    // Function to handle sidebar item click
    function handleSidebarItemClick(item) {
        setSelectedItem(item);
    }

    return (
        <div style={{width:"100vw", height: "100vh"}} className="d-flex bg-gray-100">
            <Sidebar className="sm:w-2/5">
                <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard"
                             onClick={() => handleSidebarItemClick("dashboard")}/>
                <SidebarItem icon={<BarChart3 size={20}/>} text="Insights"
                             onClick={() => handleSidebarItemClick("insights")}/>
                <SidebarItem icon={<Calendar size={20}/>} text="Saved Schedules"/>
                <SidebarItem icon={<FileUp size={20}/>} text="Import Schedule"
                             onClick={() => handleSidebarItemClick("import")}/>
                <SidebarItem icon={<FileUp size={20}/>} text="Import New Term"
                             onClick={() => handleSidebarItemClick("import new term")}/>
                <hr className='my-3'/>
                <SidebarItem icon={<UserIcon size={20}/>} text="Profile"/>
                <SidebarItem icon={<Settings size={20}/>} text="Settings"/>
            </Sidebar>
            <div className="sm:w-full mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                {selectedItem === "dashboard" && (
                    <TableTiles/>
                )}
                {selectedItem === "insights" && (
                    <Insight/>
                )}
                {selectedItem === "schedules" && (
                    <p>Saved Schedules</p>
                )}
                {selectedItem === "import" && (
                    <ImportPage/>
                )}
                {selectedItem === "profile" && (
                    <p>Profile</p>
                )}
                {selectedItem === "import new term" && (
                    <ImportNewTerm/>
                )}
                {selectedItem === "settings" && (
                    <p>Settings</p>
                )}
            </div>
        </div>
    );
}
