import React, { useState } from 'react';
import axios from 'axios';

function ImportNewTerm() {
    const [file, setFile] = useState(null);

    // Function to handle file upload
    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send POST request to backend API
            const response = await axios.post('http://localhost:8000/load/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Import New Term Page</h1>
            <div className="mb-6">
                <input type="file" accept=".xlsx" onChange={handleFileUpload} className="py-2 px-4 border rounded bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300" />
            </div>
            <div>
                <button onClick={handleSubmit} className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white">
                    Submit
                </button>
            </div>
        </div>
    );
}

export default ImportNewTerm;
