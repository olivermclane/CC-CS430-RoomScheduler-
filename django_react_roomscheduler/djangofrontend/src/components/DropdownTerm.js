import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DropdownTerm = ({ onTermChange }) => {
    const [terms, setTerms] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState({ term_id: '', term_name: 'All Terms' });

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const storedToken = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/terms/', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                console.log(response.data);
                setTerms(response.data);
            } catch (error) {
                console.error('Failed to fetch terms:', error);
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
                className="block cursor-pointer appearance-none bg-white border border-purple-500 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-violet-50 focus:border-purple-500 w-full"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedTerm.term_name}
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full bg-white mt-1 border border-purple-500 rounded-md">
                    <div
                        className="py-2 px-4 cursor-pointer hover:bg-purple-100"
                        onClick={() => handleTermSelect({ term_id: '', term_name: 'All Terms' })}
                    >
                        All Terms
                    </div>
                    {terms.map((term) => (
                        <div
                            key={term.term_id}
                            className="py-2 px-4 cursor-pointer hover:bg-purple-100"
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