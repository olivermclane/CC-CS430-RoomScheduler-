import React from "react";
import UsageChart from "../components/ScheduleInsight";
import DailyScheduleInsight from "../components/DailyScheduleInsight";
import MostFreqProf from "../components/MostFreqProf";
/*
 * Charts made via: https://apexcharts.com
 */
export default function Insight() {
    return (
        <div className="flex flex-1 space-x-10">
            <UsageChart/>
            <DailyScheduleInsight/>
            <MostFreqProf/>
        </div>

    );
}
