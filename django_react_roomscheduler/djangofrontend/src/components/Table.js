import {useMemo, useEffect, useState} from "react";
import React from "react";
import ExportComponent from "./ExportComponent"
import * as XLSX from 'xlsx';

import {
    ChevronsLeft,
    ChevronLeft,
    ChevronsRight,
    ChevronRight,
    Minus,
    Plus,
} from "lucide-react";

import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    usePagination,
    useRowSelect, useFlexLayout,
} from "react-table";
import {useRowSelectColumn} from "@lineup-lite/hooks";
import {GridLoader} from "react-spinners";
import './loadingstyle.css'
import logger from "../loggers/logger";
import DropdownTerm from "./DropdownTerm";
import {useAuth} from "../service/auth/AuthProvider";

export function GlobalFilter({
                                 globalFilter,
                                 setGlobalFilter,
                                 placeholder,
                             }) {
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span className="flex justify-between ml-auto pt-4 pb-2 px-3">
      <input
          value={value || ""}
          onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
          }}
          className="w-4/12 rounded-xl border p-4 text-gray-500 cursor-pointer"
          type="search"
          placeholder={placeholder}
      />
    </span>
    );
}

const Table = () => {
    const [tableData, setTableData] = useState([]);
    const [endpoint, setEndpoint] = useState("/courses/"); // Default endpoint
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState('')
    const [columnOrder, setColumnOrder] = useState([]);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const {axiosInstance} = useAuth();
    const data = tableData;

    const fetchData = async (endpoint) => {
        setIsLoading(true); // Ensure loading starts every time fetchData is called
        try {
            const authToken = localStorage.getItem('access_token');
            if (authToken) {
                let requestUrl = "";
                if (selectedTerm === "") {
                    requestUrl += endpoint;
                } else {
                    requestUrl += `/${selectedTerm}${endpoint}`;
                }
                const response = await axiosInstance.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (response.data && response.data.length > 0) {
                    setTableData(response.data);
                    setIsLoading(false);
                } else {
                    // Handle the case where data is successfully fetched but empty
                    setTableData([]);
                    setIsLoading(false);
                }
            } else {
                // Handle the case where access token is not available
            }
        } catch (err) {
            if (err.response) {
                logger.error("Server error:", err.response.data);
            } else if (err.request) {
                logger.error("Network error:", err.message);
            } else {
                logger.error("Error:", err.message);
            }
        }
    };


    const columnsClassroom = useMemo(
        () => [
            {
                Header: "Floor Name",
                accessor: "floor.floor_name",
            },
            {
                Header: "Building Name",
                accessor: "floor.building.building_name",
            },
            {
                Header: "Classroom Number",
                accessor: "classroom_number",
            },
            {
                Header: "Total Seats",
                accessor: "total_seats",
            },
            {
                Header: "Term",
                accessor: "term.term_name",
            },
            {
                Header: "Width of Room",
                accessor: "width_of_room",
            },
            {
                Header: "Length of Room",
                accessor: "length_of_room",
            },
            {
                Header: "Projectors",
                accessor: "projectors",
            },
            {
                Header: "Microphone System",
                accessor: "microphone_system",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Laptop HDMI",
                accessor: "laptop_hdmi",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Storage",
                accessor: "storage",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Movable Chairs",
                accessor: "movable_chairs",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Printer",
                accessor: "printer",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Stereo System",
                accessor: "stereo_system",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Blu-ray Player",
                accessor: "blueray_player",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Zoom Camera",
                accessor: "zoom_camera",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Document Camera",
                accessor: "document_camera",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Piano",
                accessor: "piano",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Total TVs",
                accessor: "total_tv",
            },
            {
                Header: "Sinks",
                accessor: "sinks",
            },
            {
                Header: "Notes",
                accessor: "notes",
            },
        ],
        []
    );

    const columnsCourses = useMemo(
        () => [
            {
                Header: "Course ID",
                accessor: "course_id",
            },
            {
                Header: "Start Time",
                accessor: "start_time",
            },
            {
                Header: "End Time",
                accessor: "end_time",
            },
            {
                Header: "Instructor",
                accessor: "instructor",
            },
            {
                Header: "First Day",
                accessor: "first_day",
            },
            {
                Header: "Last Day",
                accessor: "last_day",
            },
            {
                Header: "Course Name",
                accessor: "course_name",
            },
            {
                Header: "Term",
                accessor: "term.term_name",
            },
            {
                Header: "Credits",
                accessor: "credits",
            },
            {
                Header: "Course Cap",
                accessor: "course_cap",
            },
            {
                Header: "Waitlist Cap",
                accessor: "waitlist_cap",
            },
            {
                Header: "Waitlist Total",
                accessor: "waitlist_total",
            },
            {
                Header: "Enrollment Total",
                accessor: "enrollment_total",
            },
            {
                Header: "Course Level",
                accessor: "course_level",
            },
        ], []
    );


    const orderedColumns = useMemo(() => {
        const baseColumns = endpoint === "/courses/" ? columnsCourses : columnsClassroom;
        return columnOrder
            .map(accessor => baseColumns.find(col => col.accessor === accessor))
            .filter(Boolean);
    }, [columnOrder, endpoint, columnsCourses, columnsClassroom]);

    const handleExportButtonClick = () => {
        setExportModalOpen(true);
    };

    const toggleColumnVisibility = (columnId) => {
        setHiddenColumns(prevHiddenColumns => {
            const isNowHidden = !prevHiddenColumns.includes(columnId);
            const newHiddenColumns = isNowHidden
                ? [...prevHiddenColumns, columnId]
                : prevHiddenColumns.filter(id => id !== columnId);

            if (isNowHidden) {
                setColumnOrder(prevOrder => {
                    const newOrder = prevOrder.filter(id => id !== columnId);
                    newOrder.push(columnId); // Move to end
                    return newOrder;
                });
            } else {
                setColumnOrder(prevOrder => {
                    const newOrder = prevOrder.filter(id => id !== columnId);
                    newOrder.unshift(columnId); // Move to beginning
                    return newOrder;
                });
            }

            return newHiddenColumns;
        });
    };

    const moveColumn = (
            dragIndex, hoverIndex
        ) => {
            const dragColumn = columnOrder[dragIndex];
            const newColumnOrder = [...columnOrder];
            newColumnOrder.splice(dragIndex, 1);
            newColumnOrder.splice(hoverIndex, 0, dragColumn);
            console.log(columnOrder)
            setColumnOrder(newColumnOrder);
        }
    ;

    const columns = endpoint === "/courses/" ? columnsCourses : columnsClassroom;

    const modifiedColumns = useMemo(() => {
        const orderedColumnAccessors = orderedColumns.map(col => col.accessor);
        return columns.map((column) => ({
            ...column,
            show: orderedColumnAccessors.includes(column.accessor) && !hiddenColumns.includes(column.accessor),
        }));
    }, [columns, hiddenColumns, orderedColumns]);


    const handleRowCheckboxChange = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };
    const handleTermChange = (termId) => {
        console.log(termId)
        setSelectedTerm(termId);
    }

    const handleSelectAllChange = () => {
        setIsSelectAllChecked(!isSelectAllChecked);
    };


    useEffect(() => {
        if (isSelectAllChecked) {
            setSelectedRows([...tableData]);
        } else {
            setSelectedRows([]);
        }
    }, [isSelectAllChecked, tableData]);


    useEffect(() => {
        fetchData(endpoint);
        const initialOrder = endpoint === "/courses/" ? columnsCourses.map(c => c.accessor) : columnsClassroom.map(c => c.accessor);
        setColumnOrder(initialOrder);
    }, [endpoint, selectedTerm]);

    useEffect(() => {
        console.log(orderedColumns);
    }, [orderedColumns]);

    useEffect(() => {
        console.log(data);
    }, [data]);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        rows,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,

    } = useTable(
        {
            columns: modifiedColumns,
            data,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect,
        useRowSelectColumn
    );
    const {pageIndex} = state;


    useEffect(() => {
        if (isSelectAllChecked) {
            setSelectedRows([...tableData]); // Select all rows if "Select All" checkbox is checked
        } else {
            setSelectedRows([]); // Deselect all rows if "Select All" checkbox is unchecked
        }
    }, [isSelectAllChecked, tableData]);


    const loadingRows = isLoading ? Array.from({length: 13}).map((_, rowIndex) => (
        <tr key={`loading-row-${rowIndex}`}>
            {columns.map((column, columnIndex) => (
                <td
                    key={`loading-cell-${rowIndex}-${columnIndex}`}
                    className="px-6 py-10 whitespace-nowrap bg-gray-200 bg-violet-100"
                >
                    <div className="flex items-center">
                    </div>
                </td>
            ))}
            <td
                key={`extra-column-${rowIndex}`}
                className="px-6 py-10 whitespace-nowrap bg-violet-100"
            >
                <div className="flex items-center">
                </div>
            </td>
        </tr>
    )) : null;

    const exportSelectedRows = (fileName, fileType) => {
        // Filter columns based on columnOrder
        const orderedColumns = columnOrder.map(accessor => {
            return (endpoint === "/courses/" ? columnsCourses : columnsClassroom).find(col => col.accessor === accessor);
        });
        // Filter visible columns
        const visibleColumns = orderedColumns.filter(column => !hiddenColumns.includes(column.accessor)
            )
        ;
        const headers = visibleColumns.map(column => ({header: column.Header, key: column.accessor}));

        const selectedVisibleRows = selectedRows.map(selectedRow => {
            const correspondingRow = rows.find(row => row.original.course_id === selectedRow.course_id);
            return correspondingRow ? correspondingRow.original : null;
        }).filter(row => row);

        // Map data to array of objects for each row
        const data = selectedVisibleRows.map(row => {
            const rowData = {};
            visibleColumns.forEach(column => {
                rowData[column.Header] = row[column.accessor];
            });
            return rowData;
        });

        if (fileType === 'csv') {
            // Convert to CSV
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            XLSX.writeFile(wb, `${fileName}.csv`);
        } else {
            // Convert to Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            XLSX.writeFile(wb, `${fileName}.xlsx`);
        }
    };


    return (
        <div className="flex flex-col w-full overflow-hidden">
            <div className="overflow-x-auto">
                <div className="py-2 align-middle inline-block min-w-full sm:px-2 lg:px-8">
                    <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            placeholder="Search..."
                        />

                        <div className="flex flex-wrap p-4 gap-4">
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 hover:text-white flex-1 sm:flex-none"
                                onClick={() => setEndpoint("/courses/")}
                            >
                                Courses
                            </button>
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 hover:text-white flex-1 sm:flex-none"
                                onClick={() => setEndpoint("/classrooms/")}
                            >
                                Classrooms
                            </button>
                            <DropdownTerm onTermChange={handleTermChange} className="flex-grow sm:flex-grow-0"/>
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 hover:text-white flex-1 sm:flex-none ml-auto"
                                onClick={handleExportButtonClick}
                            >
                                Export Selected
                            </button>
                            <ExportComponent
                                isOpen={isExportModalOpen}
                                onClose={() => setExportModalOpen(false)}
                                onExport={(fileName, fileType) => exportSelectedRows(fileName, fileType)}
                            />
                        </div>
                        <div className="flex flex-wrap p-2 gap-1">
                            {orderedColumns.map((column, index) => (
                                <div key={column.Header} className="flex flex-col items-center">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => index > 0 && moveColumn(index, index - 1)}
                                            className="text-gray-500 shrink hover:text-gray-700 px-2 sm:px-3 text-xs"
                                        >
                                            <ChevronLeft/>
                                        </button>
                                        <button
                                            className={`text-white font-bold px-4 py-2 rounded min-h-10 min-w-0 shrink ${
                                                !hiddenColumns.includes(column.accessor) ? "bg-violet-300" : "bg-gray-300"
                                            }`}
                                            disabled={true}
                                        >
                                            {column.Header}
                                        </button>
                                        <button
                                            onClick={() => index < orderedColumns.length - 1 && moveColumn(index, index + 1)}
                                            className="text-gray-500 hover:text-gray-700 shrink px-2 sm:px-3 text-xs"
                                        >
                                            <ChevronRight/>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => toggleColumnVisibility(column.accessor)}
                                        className={`mt-2 shrink ${!hiddenColumns.includes(column.accessor) ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}     px-2 sm:px-3 text-xs`}
                                    >
                                        {!hiddenColumns.includes(column.accessor) ? (
                                            <Minus/>
                                        ) : (
                                            <Plus/>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {isLoading && (
                            <div
                                className="table-loading-overlay absolute top-0 left-0 w-full h-full flex items-center justify-center"
                            >
                                <GridLoader color="#4A148C"/>
                            </div>
                        )}
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-10">
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        className="ml-4"
                                        checked={isSelectAllChecked}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                {headerGroups.map((headerGroup) => (
                                    headerGroup.headers.map((column) => (
                                        // Conditionally render the table header cell based on column visibility
                                        column.show && (
                                            <th
                                                {...column.getHeaderProps()}
                                                className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase rounded-sm tracking-wider"
                                            >
                                                {column.render("Header")}
                                            </th>
                                        )
                                    ))
                                ))}
                            </tr>
                            </thead>
                            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                            {loadingRows}
                            {!isLoading &&
                                page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()} key={`row-${i}`}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="ml-4"
                                                    checked={selectedRows.includes(row.original)}
                                                    onChange={() => handleRowCheckboxChange(row.original)}
                                                />
                                            </td>
                                            {row.cells.map((cell, cellIndex) => (
                                                // Only render the cell if the corresponding column is visible
                                                cell.column.show && (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        key={`cell-${cellIndex}`}
                                                        className="px-2 py-4 whitespace-nowrap"
                                                    >
                                                        {cell.render("Cell")}
                                                    </td>
                                                )
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div className="py-3 flex items-center text-center justify-center pt-10">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    <ChevronsLeft size={30}/>
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <ChevronLeft size={30}/>
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    <ChevronRight size={30}/>
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <ChevronsRight size={30}/>
                </button>
                <span>
                Page{" "}
                    <strong>
                    {pageIndex + 1} of {pageCount}
                </strong>{" "}
            </span>
                <span>
                | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{width: "100px"}}
                    />
            </span>{" "}
                <select
                    value={state.pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Table;