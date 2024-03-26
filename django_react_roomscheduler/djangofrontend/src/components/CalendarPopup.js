import {useState} from "react";
import Calendar from "./Calendar";
const CalendarPopup = ({ selectedClassroom }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
            className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white"
                onClick={() => setShowModal(true)}
            >
                Load Classroom Schedule
            </button>

            {showModal && (
                <div id="info-popup" tabIndex="-1"
                     className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full h-modal md:h-full flex justify-end items-center">
                    <div
                        className="relative p-4 w-full max-w-3xl h-full md:h-auto">
                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
                            <Calendar selectedClassroom={selectedClassroom}/>

                            <div className="flex justify-end pt-4">
                                <button
                                    className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CalendarPopup;