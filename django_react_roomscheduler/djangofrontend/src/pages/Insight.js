// Insight.js
import React, {useState} from 'react';
import UsageChart from '../components/ScheduleInsight';
import DailyScheduleInsight from '../components/DailyScheduleInsight';
import MostFreqProf from '../components/MostFreqProf';
import DropdownClassBuilding from '../components/DropdownClassBuilding';
import DailyScheduleInsight2 from "../components/DailyScheduleInsights2";
import ScoreVisualization from "../components/ScoreVisualization";
import MonthlyHeatMap from "../components/MonthlyHeatMap"

export default function Insight() {
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('')
    const handleClassroomChange = (classroomId) => {
        console.log(classroomId)
        setSelectedClassroom(classroomId);
    };

    const handleTermChange = (termId) => {
        console.log(termId)
        setSelectedTerm(termId)
    }

    return (
        <div className="flex flex-col">
            <div className="mt-8 mb-4">
                <DropdownClassBuilding onClassroomChange={handleClassroomChange} onTermChange={handleTermChange}/>
            </div>
            <div className="flex space-x-10">
                <UsageChart selectedClassroom={selectedClassroom}/>
                <DailyScheduleInsight selectedClassroom={selectedClassroom}/>
                <MostFreqProf selectedClassroom={selectedClassroom}/>
                <DailyScheduleInsight2 selectedClassroom={selectedClassroom}/>
            </div>
            <div className="mt-4">
                <ScoreVisualization selectedClassroom={selectedClassroom}/>
            </div>
            <div>
                <MonthlyHeatMap selectedClassroom={selectedClassroom}/>
            </div>
        </div>
    );
}
