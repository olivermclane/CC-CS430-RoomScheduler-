import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./Calendar";

function Classroom({classroom, selectClassroom}) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showDetials, setShowDetials] = useState(false)
  const handleCalendarClick = (e) => {
    // Prevent event propagation when clicking inside the calendar
    e.stopPropagation();
  };

  return (
      <div
          className="classroom card max-w-sm w-full bg-white rounded-lg shadow p-4 mx-2 md:p-6"
      >
        <div className="card-body">
          <strong>Building name: {classroom.floor.building.building_name + ' ' +  classroom.classroom_number}</strong>
          <br/>
          <strong>Floor: {classroom.floor.floor_name}</strong>
          <br/>
          Classroom total seats: {classroom.total_seats}
          <br/><br/>
          <button className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 my-2 hover:bg-purple-700 hover:text-white" type="button" data-toggle="modal" data-target={"#modal-" + classroom.classroom_id} onClick={() => setShowDetials(!showDetials)}>
            more details
          </button>
          <br/>
          <button className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 my-2 hover:bg-purple-700 hover:text-white" type="button" onClick={()=>{
            setShowCalendar(!showCalendar);
          }} >
            view calendar
          </button>
        </div>
        {showCalendar ? (
            <div id={"calendar-" + classroom.classroom_id} style={{zIndex: "2", position: "fixed", left: "5%", top: "10%", width: "70%", background: "white", padding: "50px"}}>
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
        {showDetials ? (
            <div className="modal" id={"modal-" + classroom.classroom_id}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                Classroom name: {classroom.classroom_name}
                <br/>
                Width of room: {classroom.width_of_room}
                <br/>
                Length of room: {classroom.length_of_room}
                <br/>
                Projectors: {classroom.projectors}
                <br/>
                Microphone system: {classroom.microphone_system}
                <br/>
                Blueray player : {classroom.blueray_player}
                <br/>
                Laptop HDMI: {classroom.lapton_hdmi}
                <br/>
                Zoom camera: {classroom.zoom_camera}
                <br/>
                Document camera: {classroom.document_camera}
                <br/>
                Storage: {classroom.storage}
                <br/>
                Movable chairs: {classroom.movable_chairs}
                <br/>
                Printer: {classroom.printer}
                <br/>
                Piano: {classroom.piano}
                <br/>
                Stereo system: {classroom.stereo_system}
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
