import React, {useState, useEffect, useRef} from 'react';
import logger from "../loggers/logger";
import axios from 'axios';
import {useAuth} from "../service/auth/AuthProvider";
import {ChevronDown} from "lucide-react";

const DropdownClassBuilding = ({onClassroomChange, onTermChange}) => {
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState({id: '', name: 'No Building Selected'});
    const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState({id: '', number: 'No Classroom Selected'});
    const [showClassroomDropdown, setShowClassroomDropdown] = useState(false);
    const [terms, setTerms] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState({term_id: '', term_name: 'No Term Selected'});
    const [showTermDropdown, setShowTermDropdown] = useState(false);
    const termDropdownRef = useRef(null);
    const buildingDropdownRef = useRef(null);
    const classroomDropdownRef = useRef(null);
            const {axiosInstance} = useAuth();

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                logger.debug("Requesting data from terms");
                const response = await axiosInstance.get('/terms/');
                logger.debug(response.data);
                logger.debug("Received data from terms");
                setTerms(response.data);
            } catch (error) {
                logger.error('Failed to fetch terms:', error);
            }
        };
        fetchTerms();
    }, []);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await axiosInstance.get(`/${selectedTerm.term_id}/classrooms/`);
                const parsedBuildings = parseData(response.data);
                setBuildings(parsedBuildings);
            } catch (err) {
                logger.error('Error fetching classrooms:', err);
            }
        };

        if (selectedTerm.term_id) {
            fetchData();
        }
    }, [selectedTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (termDropdownRef.current && !termDropdownRef.current.contains(event.target)) {
                setShowTermDropdown(false);
            }
            if (buildingDropdownRef.current && !buildingDropdownRef.current.contains(event.target)) {
                setShowBuildingDropdown(false);
            }
            if (classroomDropdownRef.current && !classroomDropdownRef.current.contains(event.target)) {
                setShowClassroomDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTermSelect = (term) => {
        setSelectedTerm(term);
        setShowTermDropdown(false);
        setSelectedBuilding({id: '', name: 'No Building Selected'});
        setSelectedClassroom({id: '', number: 'No Classroom Selected'});
        onTermChange(term.term_id);
    };

    const handleBuildingSelect = (buildingName) => {
        setSelectedBuilding({id: buildingName, name: buildingName});
        setShowBuildingDropdown(false);
        setSelectedClassroom({id: '', number: 'No Classroom Selected'});
    };

    const handleClassroomSelect = (classroom) => {
        setSelectedClassroom(classroom);
        setShowClassroomDropdown(false);
        onClassroomChange(classroom.id);
    };

    const parseData = (data) => {
        const buildings = {};
        data.forEach((classroom) => {
            const buildingName = classroom.floor.building.building_name;
            if (!buildings[buildingName]) {
                buildings[buildingName] = [];
            }
            buildings[buildingName].push({
                id: classroom.classroom_id,
                number: classroom.classroom_number,
            });
        });
        return buildings;
    };

    return (
        <div className="flex">
            <div className="relative" ref={termDropdownRef}>
                <div
                    className="flex block cursor-pointer appearance-none bg-white border border-purple-500 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-violet-50 focus:border-purple-500 w-full"
                    onClick={() => {
                        setShowTermDropdown(!showTermDropdown);
                        setShowBuildingDropdown(false);
                        setShowClassroomDropdown(false);
                    }}>
                    {selectedTerm.term_name}
                    <ChevronDown/>
                </div>
                {showTermDropdown && (
                    <div className="absolute z-10 w-auto bg-white mt-1 border border-purple-500 rounded-md">
                        {terms.map((term) => (
                            <div
                                key={term.term_id}
                                className="py-2 px-4 cursor-pointer hover:bg-purple-500"
                                onClick={() => handleTermSelect(term)}
                            >
                                {term.term_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative" ref={buildingDropdownRef}>
                <div
                    className={`flex block cursor-pointer appearance-none bg-white border ${selectedTerm.term_id ? 'border-purple-500' : 'border-gray-300'} text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none ${selectedTerm.term_id ? 'focus:bg-violet-50 focus:border-purple-500' : ''} w-full`}
                    onClick={() => {
                        if (selectedTerm.term_id) {
                            setShowBuildingDropdown(!showBuildingDropdown);
                            setShowTermDropdown(false);
                            setShowClassroomDropdown(false);
                        }
                    }}
                >
                    {selectedBuilding.name}
                    <ChevronDown/>
                </div>
                {showBuildingDropdown && (
                    <div className="absolute z-10 w-auto bg-white mt-1 border border-purple-500 rounded-md">
                        {Object.keys(buildings).map((buildingName) => (
                            <div
                                key={buildingName}
                                className="py-2 px-4 cursor-pointer hover:bg-purple-500"
                                onClick={() => handleBuildingSelect(buildingName)}
                            >
                                {buildingName}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative" ref={classroomDropdownRef}>
                <div
                    className={`flex block cursor-pointer appearance-none bg-white border ${selectedBuilding.id ? 'border-purple-500' : 'border-gray-300'} text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none ${selectedBuilding.id ? 'focus:bg-violet-50 focus:border-purple-500' : ''} w-full`}
                    onClick={() => {
                        if (selectedBuilding.id) {
                            setShowClassroomDropdown(!showClassroomDropdown);
                            setShowTermDropdown(false);
                            setShowBuildingDropdown(false);
                        }
                    }}
                >
                    {selectedClassroom.number ? `Classroom ${selectedClassroom.number}` : 'No Classroom Selected'}
                    <ChevronDown/>
                </div>
                {showClassroomDropdown && (
                    <div className="absolute z-10 w-auto bg-white mt-1 border border-purple-500 rounded-md">
                        {buildings[selectedBuilding.id]?.map((classroom) => (
                            <div
                                key={classroom.id}
                                className="py-2 px-4 cursor-pointer hover:bg-purple-500"
                                onClick={() => handleClassroomSelect(classroom)}
                            >
                                {`Classroom ${classroom.number}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

};

export default DropdownClassBuilding;
