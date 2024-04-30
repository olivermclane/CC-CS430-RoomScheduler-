// Insight.js
import React, {useState} from 'react';
import UsageChart from '../components/ScheduleInsight';
import DailyScheduleInsight from '../components/DailyScheduleInsight';
import MostFreqProf from '../components/MostFreqProf';
import DropdownClassBuilding from '../components/DropdownClassBuilding';
import DailyScheduleInsight2 from "../components/DailyScheduleInsights2";
import ScoreVisualization from "../components/ScoreVisualization";
import MonthlyHeatMap from "../components/MonthlyHeatMap"
import CalendarPopup from "../components/CalendarPopup";
import ClassroomDetails from "../components/ClassroomDetails";
import logger from "../loggers/logger";
import SeatVisualization2 from "../components/SeatVisualization2";

export default function Insight() {
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('')
    const handleClassroomChange = (classroomId) => {
        logger.debug("Classroom ID: ", classroomId)
        setSelectedClassroom(classroomId);
    };

    const handleTermChange = (termId) => {
        logger.debug("Term ID: ")
        setSelectedTerm(termId)
    }

    return (
        <div className="flex flex-col">
            <div className="flex mb-2">
                <DropdownClassBuilding onClassroomChange={handleClassroomChange} onTermChange={handleTermChange}/>
                <div className="ml-auto">
                    <CalendarPopup selectedClassroom={selectedClassroom}/>
                </div>
            </div>
            <div className="flex space-x-10">
                <DailyScheduleInsight selectedClassroom={selectedClassroom}/>
                <MostFreqProf selectedClassroom={selectedClassroom}/>
                <DailyScheduleInsight2 selectedClassroom={selectedClassroom}/>
            </div>
            <div className="mt-4">
                <ScoreVisualization selectedClassroom={selectedClassroom}/>
            </div>
            <div className="flex space-x-10">
                <MonthlyHeatMap selectedClassroom={selectedClassroom}/>
            </div>
            <div className="flex space-x-10">
                <ClassroomDetails selectedClassroom={selectedClassroom}/>
                <SeatVisualization2 selectedClassroom={selectedClassroom}/>
                <UsageChart selectedClassroom={selectedClassroom}/>
            </div>
        </div>
    );
}
