import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./Calendar";

function Classroom({classroom}) {
    const [showCalendar, setShowCalendar] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    function boolToText(value) {
        return value ? "Yes" : "No";
    }

    const handleCalendarClick = (e) => {
        // Prevent event propagation when clicking inside the calendar
        e.stopPropagation();
    };

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-4 mx-2 my-4">
            <div className="flex-row mb-4">
                <p class="text-lg">Classroom
                    name: {classroom.floor.building.building_name + ' ' + classroom.classroom_number}</p>
                <br></br>
                <strong>Term: {classroom.term.term_name}</strong>
                <br></br>
                <strong>Floor: {classroom.floor.floor_name}</strong>
                <p>Classroom total seats: {classroom.total_seats}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:outline-none w-full sm:w-auto"
                >
                    More details
                </button>
                <button
                    onClick={() => {
                        let calendars = document.getElementsByClassName("calendars")
                        for (let i = 0; i < calendars.length; i++) {
                            calendars[i].style.zIndex = -1;
                            calendars[i].style.display = "none";
                        }
                        setShowCalendar(!showCalendar)
                    }}
                    className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:outline-none w-full sm:w-auto"
                >
                    View calendar
                </button>
            </div>
            {showCalendar ? (
                <div className="calendars" id={"calendar-" + classroom.classroom_id} style={{
                    display: "auto",
                    zIndex: "2",
                    position: "fixed",
                    left: "5%",
                    top: "10%",
                    width: "70%",
                    background: "white",
                    padding: "50px"
                }}>
                    {
                        showCalendar ? (
                            <div>
                                <div onClick={() => {

                                    setShowCalendar(!showCalendar);
                                }}><h1 style={{cursor: "pointer"}}>&times; Close</h1></div>
                                <Calendar selectedClassroom={classroom.classroom_id}/>
                            </div>
                        ) : (
                            <p>No classroom schedule loaded</p>
                        )
                    }
                </div>
            ) : (
                <p></p>
            )}
            {showDetails ? (
                <div className="modal show d-block" id={"modal-" + classroom.classroom_id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={() => setShowDetails(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                Classroom name: {classroom.floor.building.building_name + ' ' + classroom.classroom_number}
                                <br/>
                                Width of room: {classroom.width_of_room}
                                <br/>
                                Length of room: {classroom.length_of_room}
                                <br/>
                                Projectors: {classroom.projectors}
                                <br/>
                                Microphone system: {boolToText(classroom.microphone_system)}
                                <br/>
                                Blueray player : {boolToText(classroom.blueray_player)}
                                <br/>
                                Laptop HDMI: {boolToText(classroom.lapton_hdmi)}
                                <br/>
                                Zoom camera: {boolToText(classroom.zoom_camera)}
                                <br/>
                                Document camera: {boolToText(classroom.document_camera)}
                                <br/>
                                Storage: {boolToText(classroom.storage)}
                                <br/>
                                Movable chairs: {boolToText(classroom.movable_chairs)}
                                <br/>
                                Printer: {boolToText(classroom.printer)}
                                <br/>
                                Piano: {boolToText(classroom.piano)}
                                <br/>
                                Stereo system: {boolToText(classroom.stereo_system)}
                                <br/>
                                Total tv: {classroom.total_tv}
                                <br/>
                                Sinks: {classroom.sinks}
                                <br/>
                                Notes: {classroom.notes}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default Classroom;

