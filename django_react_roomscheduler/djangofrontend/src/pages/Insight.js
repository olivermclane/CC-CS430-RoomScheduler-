// Insight.js
import React, { useState } from 'react';
import UsageChart from '../components/ScheduleInsight';
import DailyScheduleInsight from '../components/DailyScheduleInsight';
import MostFreqProf from '../components/MostFreqProf';
import DropdownClassBuilding from '../components/DropdownClassBuilding';
import DailyScheduleInsight2 from "../components/DailyScheduleInsights2";

export default function Insight() {
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const handleClassroomChange = (classroomId) => {
    setSelectedClassroom(classroomId);
  };

  return (
    <div className="flex flex-1 flex-col items-start"> {/* Adjust alignment */}
      <div className="mt-8 mb-4"> {/* Added more padding top and bottom */}
        <DropdownClassBuilding onClassroomChange={handleClassroomChange} />
      </div>
      <div className="flex flex-1 space-x-10">
        <UsageChart selectedClassroom={selectedClassroom} />
        <DailyScheduleInsight selectedClassroom={selectedClassroom} />
        <MostFreqProf selectedClassroom={selectedClassroom} />
        <DailyScheduleInsight2 selectedClassroom={selectedClassroom}/>
      </div>
    </div>
  );
}
