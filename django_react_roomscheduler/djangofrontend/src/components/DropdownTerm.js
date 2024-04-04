import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../service/AuthProvider';
import {faChevronDown} from 'react-icons/fa';
import {ChevronDown} from "lucide-react";
import logger from "../loggers/logger";

const DropdownTerm = ({ onTermChange }) => {
    const [terms, setTerms] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState({ term_id: '', term_name: 'All Terms' });
    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                logger.info('Requested data from terms');
                const response = await axiosInstance.get('http://127.0.0.1:8000/terms/');
                setTerms(response.data);
                logger.info('Received data from terms');

            } catch (error) {
                logger.error('Failed to fetch terms:', error);
            }
        };

        fetchTerms();
    }, []);

    const handleTermSelect = (term) => {
        setSelectedTerm(term);
        setShowDropdown(false);
        onTermChange(term.term_id);
    };

    return (
        <div className="flex px-3 relative">
            <div
                className="flex block cursor-pointer appearance-none bg-white border border-purple-500 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-violet-500 focus:border-purple-500 w-full"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedTerm.term_name}
                <ChevronDown/>
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full bg-white mt-1 border border-purple-500 rounded-md">
                    <div
                        className="py-2 px-4 cursor-pointer hover:bg-violet-500"
                        onClick={() => handleTermSelect({ term_id: '', term_name: 'All Terms' })}
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