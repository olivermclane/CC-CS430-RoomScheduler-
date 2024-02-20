import logo from './logo.svg';
import './App.css';
import BuildingList from "./components/BuildingList";
import FloorList from "./components/FloorList";
import ClassroomList from "./components/ClassroomList";
import {useState} from "react";
import Calendar from "./components/Calendar";

function App() {

    const [selectedBuilding, setSelectedBuilding] = useState(null)
    const [selectedFloor, setSelectedFloor] = useState(null)
    function updateFloorList(building){
        setSelectedBuilding(building)
        setSelectedFloor(null)
    }
    function updateClassroomList(floor){
        setSelectedFloor(floor)
    }

  return (
    <div className="App">
        <BuildingList updateFloorList = {updateFloorList} />
        <br /><br />
        <FloorList selectedBuilding={selectedBuilding} updateClassroomList={updateClassroomList} />
        <br /><br />
        <ClassroomList selectedFloor={selectedFloor} />
        <Calendar />
    </div>
  );
}

export default App;
