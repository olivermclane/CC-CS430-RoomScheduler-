import {useState} from "react";

const ExportComponent = ({isOpen, onClose, onExport}) => {
    const [fileName, setFileName] = useState('Carroll_College_Scheduling');
    const [fileType, setFileType] = useState('csv');

    const handleExport = () => {
        onExport(fileName, fileType);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Export Settings</h2>
                <div className="mb-4">
                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">File Name</label>
                    <input
                        type="text"
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">File Type</label>
                    <select
                        id="fileType"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:ring-purple-900 sm:text-sm rounded-md"
                    >
                        <option value="csv">CSV</option>
                        <option value="xls">Excel</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportComponent;
