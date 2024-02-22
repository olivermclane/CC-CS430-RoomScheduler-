import React from "react";
import UsageChart from "../components/UsageChart";
import DailyScheduleInsight from "../components/TimeBarChart";
import MostFreqProf from "../components/MostFreqProf";

export default function Insight() {
    return (
        <div className="flex flex-1 space-x-10">
            <UsageChart/>
            <DailyScheduleInsight/>
            <MostFreqProf/>
        </div>

    );
}
