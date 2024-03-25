import React, {useState} from 'react';

function ImportPage() {
    // State variables to manage input data
    const [csvData, setCsvData] = useState('');

    // Function to handle CSV file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            setCsvData(content);
        };

        reader.readAsText(file);
    };

    // Function to handle CSV data submission
    const handleSubmit = () => {
        // Perform actions with the imported CSV data
        console.log('CSV data:', csvData);
        // Example: send data to backend API for processing
    };

    return (
        <div className="text-white container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Import Schedule Page</h1>
            <div className="mb-6">
                <input type="file" accept=".csv" onChange={handleFileUpload}
                       className="py-2 px-4 border rounded bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"/>
            </div>
            <div className="mb-6">
        <textarea
            rows="10"
            cols="50"
            value={csvData}
            readOnly
            className="border rounded w-full"
        />
            </div>
            <div>
                <button onClick={handleSubmit}
                        className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white">
                    Submit
                </button>
            </div>
        </div>
    );
}

export default ImportPage;