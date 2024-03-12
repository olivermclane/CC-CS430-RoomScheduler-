import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const requiredColumns = [
    'CSM_BLDG',
    'CSM_ROOM',
    'CSM_SUNDAY',
    'CSM_MONDAY',
    'CSM_TUESDAY',
    'CSM_WEDNESDAY',
    'CSM_THURSDAY',
    'CSM_FRIDAY',
    'CSM_SATURDAY',
    'SEC_START_DATE',
    'SEC_END_DATE',
    'CSM_START_TIME',
    'CSM_END_TIME',
    'SEC_SHORT_TITLE',
    'SEC_TERM',
    'SEC_MIN_CRED',
    'SEC_FACULTY_INFO',
    'STUDENTS_AND_RESERVED_SEATS',
    'SEC_CAPACITY',
    'XL_WAITLIST_MAX',
    'WAITLIST',
    'SEC_COURSE_NO'
];

function ImportNewTerm() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Function to handle file upload
    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
        setError(''); // Clear any previous errors
        setSuccess(false); // Reset success state
        setLoading(false)
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setSuccess(false)
        setError('')
        setLoading(true);

        try {
            // Read the file content
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const content = e.target.result;
                // Parse Excel file
                const workbook = XLSX.read(content, { type: 'binary' });
                // Get the first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                // Get column headers
                const columns = Object.keys(firstSheet);
                // Get column names as the value of the keys
                const columnNames = columns.map(key => firstSheet[key].v);

                // Check if all required columns are present
                const missingColumns = requiredColumns.filter(column => !columnNames.includes(column));
                if (missingColumns.length > 0) {
                    setLoading(false);
                    setError(`Missing columns: ${missingColumns.join(', ')}`);
                    return;
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('file', file);

                // Send POST request to backend API
                axios.post('http://localhost:8000/load/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    setLoading(false);
                    setSuccess(true);
                    console.log('Response from server:', response.data);
                    // Add any further handling for successful upload if needed
                }).catch(error => {
                    setLoading(false);
                    console.error('Error uploading file:', error);
                    setError('Error uploading file. Please try again.');
                });
            };
            fileReader.readAsBinaryString(file);
        } catch (error) {
            setLoading(false);
            console.error('Error uploading file:', error);
            setError('Error uploading file. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Import New Term </h1>
            <div className="mb-6">
                <input type="file" accept=".xlsx" onChange={handleFileUpload} className="py-2 px-4 border rounded bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300" />
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">File successfully loaded.</div>}
            <div>
                <button onClick={handleSubmit} className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white">
                    Submit
                </button>
            </div>
        </div>
    );
}

export default ImportNewTerm;
