import React, {useState} from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import logger from "../loggers/logger";
import {BeatLoader} from 'react-spinners';
import {useAuth} from "../service/auth/AuthProvider";

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
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const {axiosInstance} = useAuth();


    const validateFile = (jsonData) => {
        const columnNames = jsonData[0];
        const missingColumns = requiredColumns.filter(column => !columnNames.includes(column));
        if (missingColumns.length > 0) {
            setError(`Missing columns: ${missingColumns.join(', ')}`);
            logger.error(`Missing columns: ${missingColumns.join(', ')}`);
            return false;
        }
        return true;
    };

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        setError('');
        setSuccess(false);
        setLoading(false);

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const workbook = XLSX.read(content, {type: 'binary'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {header: 1});
            if (validateFile(jsonData)) {
                setFileData(jsonData);
            }
        };
        reader.readAsBinaryString(uploadedFile);
    };

    const handleSubmit = async () => {
        if (!file || !fileData) {
            setError('Please select a file.');
            logger.error("No file selected to upload")
            return;
        }

        setSuccess(false);
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        logger.log(formData)

        try {
            const response = await axiosInstance.post('/load/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setSuccess(true);
            logger.info('Response from server:', response.data);
        } catch (error) {
            setLoading(false);
            logger.error('Error uploading file:', error);
            setError('Error uploading file. Please try again.');
        }
    };

    const handleDownloadExampleFile = async () => {
        try {
            const response = await axiosInstance.get('/load-example-excel/', {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'example.xlsx';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            logger.error('Error downloading example file:', error);
        }
    };

    return (
        <div className="mx-auto p-6">
            <h1 className="flex text-gray-700 text-3xl font-bold mb-6">Import New Term </h1>
            <div className="flex mb-6">
                <input type="file" accept=".xlsx" onChange={handleFileUpload}
                       className="py-2 px-4 border rounded bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"/>
                <button onClick={handleDownloadExampleFile}
                        className="bg-violet-300 text-white font-bold py-2 px-4 rounded ml-4 hover:bg-purple-700 hover:text-white">
                    Download Example File
                </button>
                <button onClick={handleSubmit}
                        className="bg-violet-300 text-white font-bold py-2 px-4 rounded ml-4 hover:bg-purple-700 hover:text-white">
                    Save
                </button>
            </div>
            {loading && <BeatLoader color="#3c1952" loading={true}/>}
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">File successfully loaded.</div>}
            {fileData && (
                <div className="mb-6 mx-auto border border-gray-300 bg-white rounded-lg overflow-y-auto"
                     style={{maxWidth: '100%', maxHeight: '20%'}}>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-200">
                            {fileData[0].map((header, index) => (
                                <th key={index} className="px-4 py-2">{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {fileData.slice(1, 6).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}
                                style={{maxHeight: '20%'}}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-2 text-sm">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ImportNewTerm;
