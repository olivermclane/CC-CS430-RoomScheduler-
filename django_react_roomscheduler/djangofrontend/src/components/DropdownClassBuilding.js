 import React, { useState, useEffect } from 'react';
import axios from 'axios';
 import logger from "../loggers";

const DropdownClassBuilding = ({ onClassroomChange }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('SIMP');
  const [selectedClassroom, setSelectedClassroom] = useState('101');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        logger.info('Fetching data from endpoint:', endpoint); // Log the endpoint being called
        const response = await axios.get('http://127.0.0.1:8000/classrooms/', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        logger.info("Fetched data:", response.data); // Log fetched data
        const parsedBuildings = parseData(response.data);
        setBuildings(parsedBuildings);
      } catch (err) {
        if (err.response) {
          logger.error('Server error:', err.response.data);
        } else if (err.request) {
          logger.error('Network error:', err.message);
        } else {
          logger.error('Error:', err.message);
        }
      }
    };

    fetchData();
  }, []);

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
    logger.log("Data parsed")
    return buildings;
  };

  const handleBuildingChange = (e) => {
    setSelectedBuilding(e.target.value);
    setSelectedClassroom('');
  };

  const handleClassroomChange = (e) => {
    const selectedClassroomId = e.target.value;
    setSelectedClassroom(selectedClassroomId);
    // Call the callback function with the selected classroom ID
    onClassroomChange(selectedClassroomId);
  };

  return (
    <div className="flex">
      <div className="relative">
        <select
          className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-l-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={selectedBuilding}
          onChange={handleBuildingChange}
        >
          {Object.keys(buildings).map((buildingName, index) => (
            <option key={index} value={buildingName}>
              {buildingName}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.293 11.707a1 1 0 001.414-1.414l3-3a1 1 0 00-1.414-1.414L10 9.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="relative">
        <select
          className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-r-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={selectedClassroom}
          onChange={handleClassroomChange}
          disabled={!selectedBuilding}
        >
          {selectedBuilding &&
            buildings[selectedBuilding]?.map((classroom, index) => (
              <option key={index} value={classroom.id}>
                {classroom.number}
              </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.293 11.707a1 1 0 001.414-1.414l3-3a1 1 0 00-1.414-1.414L10 9.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DropdownClassBuilding;
