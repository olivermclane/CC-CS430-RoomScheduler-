import { useAuth } from "../service/auth/AuthProvider";
import React, { useEffect, useState } from "react";
import logger from "../loggers/logger";

const ClassroomDetails = ({ selectedClassroom }) => {
    const { axiosInstance } = useAuth();
    const [classroomData, setClassroomData] = useState(null);
    const [classroomName, setClassroomName] = useState('')

    const fetchData = async () => {
            try {
                if(selectedClassroom) {
                    const response = await axiosInstance.get(`/classroom-courses/${selectedClassroom}/`);
                    setClassroomName(response.data[0].classroom.floor.building.building_name + ' ' + response.data[0].classroom.classroom_number)
                    setClassroomData(response.data[0].classroom);
                }
            } catch (err) {
                logger.error("Error fetching calendar data:", err);
            }
    };

    useEffect(() => {
        fetchData();
    }, [selectedClassroom, axiosInstance]);

    return (
        <div className="max-w-auto w-full bg-white rounded-lg shadow p-4 mt-4 md:p-6">
            {classroomData && (
                <>
                    <p>Classroom Name: {classroomName}</p>
                    <p>Projectors: {classroomData.projectors}</p>
                    <p>Sinks: {classroomData.sinks}</p>
                    <p>Total Seats: {classroomData.total_seats}</p>
                    <p>Total TVs: {classroomData.total_tv}</p>
                    <p>Width of Room: {classroomData.width_of_room} ft</p>
                    <p>Blu-ray Player: <span
                        className={`badge ${classroomData.blueray_player ? 'bg-success' : 'bg-danger'}`}>{classroomData.blueray_player ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Document Camera: <span
                        className={`badge ${classroomData.document_camera ? 'bg-success' : 'bg-danger'}`}>{classroomData.document_camera ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Laptop HDMI: <span
                        className={`badge ${classroomData.laptop_hdmi ? 'bg-success' : 'bg-danger'}`}>{classroomData.laptop_hdmi ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Microphone System: <span
                        className={`badge ${classroomData.microphone_system ? 'bg-success' : 'bg-danger'}`}>{classroomData.microphone_system ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Movable Chairs: <span
                        className={`badge ${classroomData.movable_chairs ? 'bg-success' : 'bg-danger'}`}>{classroomData.movable_chairs ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Piano: <span
                        className={`badge ${classroomData.piano ? 'bg-success' : 'bg-danger'}`}>{classroomData.piano ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Printer: <span
                        className={`badge ${classroomData.printer ? 'bg-success' : 'bg-danger'}`}>{classroomData.printer ? 'Yes' : 'No'}</span>
                    </p>

                    <p>Stereo System: <span
                        className={`badge ${classroomData.stereo_system ? 'bg-success' : 'bg-danger'}`}>{classroomData.stereo_system ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Storage: <span
                        className={`badge ${classroomData.storage ? 'bg-success' : 'bg-danger'}`}>{classroomData.storage ? 'Yes' : 'No'}</span>
                    </p>
                    <p>Zoom Camera: <span
                        className={`badge ${classroomData.zoom_camera ? 'bg-success' : 'bg-danger'}`}>{classroomData.zoom_camera ? 'Yes' : 'No'}</span>
                    </p>
                    <div>
                        <h4>Notes:</h4>
                        <p>{classroomData.notes}</p>
                    </div>
                </>
            )}
            <div className="mt-4"/>
            <hr className="my-3"/>
            <h3 className="text-lg font-semibold mb-2">Classroom Details</h3>
            <p className="text-sm text-gray-600">
                Basic information regarding the currently selected classroom, including insights into classroom aspects such as number of projectors, storage, chairs, along with the notes attached to the classroom.
            </p>
        </div>
    );
};

export default ClassroomDetails;
