import React, {useEffect, useState} from "react";
import Sidebar, {SidebarItem} from '../components/Sidebar';
import TableTiles from './TableTiles'

import {BarChart3, Calendar, FileUp, LayoutDashboard, Settings, UserIcon} from "lucide-react";
import Insight from "./Insight";
import ImportNewTerm from "./ImportNewTerm";
import {useNavigate} from "react-router-dom";
export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState("dashboard");

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            navigate('/login')
        }
    }, []);

    // Function to handle sidebar item click
    function handleSidebarItemClick(item) {
        setSelectedItem(item);
    }

    return (
        <div className="d-flex bg-violet-100">
            <Sidebar className="sm:w-2/5">
                <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard"
                             onClick={() => handleSidebarItemClick("dashboard")}/>
                <SidebarItem icon={<BarChart3 size={20}/>} text="Insights"
                             onClick={() => handleSidebarItemClick("insights")}/>
                <SidebarItem icon={<FileUp size={20}/>} text="Import New Term"
                             onClick={() => handleSidebarItemClick("import new term")}/>
            </Sidebar>
        <div className="sm:w-full mt-4 p-4 bg-violet-100 rounded-lg shadow-md flex-1" style={{minHeight: 'calc(100vh - 64px)'}}>
                {selectedItem === "dashboard" && (
                    <TableTiles/>
                )}
                {selectedItem === "insights" && (
                    <Insight/>
                )}
                {selectedItem === "import new term" && (
                    <ImportNewTerm/>
                )}
            </div>
        </div>
    );
}
