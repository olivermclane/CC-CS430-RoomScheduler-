import React, {useEffect, useState, useRef} from 'react';
import {useAuth} from '../service/auth/AuthProvider';
import {ChevronDown} from "lucide-react";
import logger from "../loggers/logger";

const DropdownTerm = ({onTermChange}) => {
    const [terms, setTerms] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState({term_id: '', term_name: 'All Terms'});
    const {axiosInstance} = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await axiosInstance.get('/terms/');
                setTerms(response.data);
                logger.debug('Received data from terms');
            } catch (error) {
                logger.error('Failed to fetch terms:', error);
            }
        };

        fetchTerms();
    }, [axiosInstance]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleTermSelect = (term = {term_id: '', term_name: 'All Terms'}) => {
        setSelectedTerm(term);
        setShowDropdown(false);
        onTermChange(term.term_id);
    };

    return (
        <div className="flex px-3 relative" ref={dropdownRef}>
            <div
                className="flex block cursor-pointer appearance-none bg-white border border-purple-500 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-violet-500 focus:border-purple-500 w-full"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedTerm.term_name}
                <ChevronDown size={10}/>
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full bg-white mt-1 border border-purple-500 rounded-md">
                    <div
                        className="py-2 px-4 cursor-pointer hover:bg-violet-500"
                        onClick={() => handleTermSelect({term_id: '', term_name: 'All Terms'})}
                    >
                        All Terms
                    </div>
                    {terms.map((term) => (
                        <div
                            key={term.term_id}
                            className="py-2 px-4 cursor-pointer hover:bg-violet-500"
                            onClick={() => handleTermSelect(term)}
                        >
                            {term.term_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownTerm;
