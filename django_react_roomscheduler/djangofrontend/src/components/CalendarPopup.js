import {useState} from "react";
import Calendar from "./Calendar";

const CalendarPopup = ({selectedClassroom}) => {
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
                <div id="info-popup"
                     className="fixed top-10 right-10 z-50 max-w-3xl w-full md:w-3/4 lg:w-1/2 xl:w-2/3">
                    <div className="relative p-4 w-full h-full md:h-auto md:max-h-screen">
                        <div
                            className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8 w-full h-full">
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