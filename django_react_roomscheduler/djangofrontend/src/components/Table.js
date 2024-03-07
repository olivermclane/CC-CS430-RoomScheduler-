import {useMemo, useEffect, useState} from "react";
import React from "react";

import {
    ChevronsLeft,
    ChevronLeft,
    ChevronsRight,
    ChevronRight,
} from "lucide-react";
import {DOTS, useCustomPagination} from "./pagination/CustomPagination";

import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    usePagination,
    useRowSelect,
} from "react-table";
import {useRowSelectColumn} from "@lineup-lite/hooks";
import axios from "axios";
import {GridLoader} from "react-spinners";
import './loadingstyle.css'

export function GlobalFilter({globalFilter, setGlobalFilter, placeholder}) {
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
    const [endpoint, setEndpoint] = useState("/courses"); // Default endpoint
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

    const fetchData = async (endpoint) => {
        setIsLoading(true);
        try {
            const storedToken = localStorage.getItem("access_token");
            const response = await axios.get(`http://localhost:8000${endpoint}/`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            setTableData(response.data);
        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else if (err.request) {
                console.log("Network error:", err.message);
            } else {
                console.log("Error:", err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(endpoint);
    }, [endpoint]);

    const data = tableData;

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
                Header: "Blu-ray Player",
                accessor: "blueray_player",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Laptop HDMI",
                accessor: "laptop_hdmi",
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
                Header: "Piano",
                accessor: "piano",
                Cell: ({value}) => value ? "Yes" : "No",
            },
            {
                Header: "Stereo System",
                accessor: "stereo_system",
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
                accessor: "term",
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

    const toggleColumnVisibility = (columnId) => {
        setHiddenColumns((prevHiddenColumns) => {
            if (prevHiddenColumns.includes(columnId)) {
                return prevHiddenColumns.filter((col) => col !== columnId);
            } else {
                return [...prevHiddenColumns, columnId];
            }
        });
    };

    const columns = endpoint === "/courses" ? columnsCourses : columnsClassroom;

    const modifiedColumns = useMemo(() => {
        return columns.map((column) => ({
            ...column,
            show: !hiddenColumns.includes(column.accessor),
        }));

    }, [columns, hiddenColumns]);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
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
    const paginationRange = useCustomPagination({
        totalPageCount: pageCount,
        currentPage: pageIndex,
    });


    useEffect(() => {
        if (isSelectAllChecked) {
            setSelectedRows([...tableData]); // Select all rows if "Select All" checkbox is checked
        } else {
            setSelectedRows([]); // Deselect all rows if "Select All" checkbox is unchecked
        }
    }, [isSelectAllChecked, tableData]);

    const handleRowCheckboxChange = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleSelectAllChange = () => {
        setIsSelectAllChecked(!isSelectAllChecked);
    };


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


    const exportSelectedRows = () => {
        const allColumns = endpoint === "/courses" ? columnsCourses : columnsClassroom;
        const visibleColumns = allColumns.filter(column => !hiddenColumns.includes(column.accessor));
        const headers = visibleColumns.map(column => column.Header);
        const visibleRows = page.map(row => row.original);
        const selectedVisibleRows = selectedRows.filter(row => visibleRows.includes(row));

        // Include only visible columns in the export
        const data = selectedVisibleRows.map(row => visibleColumns.map(column => {
            // Wrap each field value in double quotes to handle commas
            const cellValue = row[column.accessor];
            return typeof cellValue === 'string' && cellValue.includes(',') ? `"${cellValue}"` : cellValue;
        }));

        // Construct CSV content
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        // Download the CSV file
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Carroll_X_X.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-2 lg:px-8">
                    <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            placeholder="Search..."
                        />

                        <div className="flex p-4">
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white"
                                onClick={() => setEndpoint("/courses")}
                            >
                                Courses
                            </button>
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 hover:text-white"
                                onClick={() => setEndpoint("/classrooms")}
                            >
                                Classrooms
                            </button>
                            <button
                                className="bg-violet-300 text-white font-bold py-2 px-4 rounded ml-auto hover:bg-purple-700 hover:text-white"
                                onClick={exportSelectedRows}
                            >
                                Export Selected
                            </button>
                        </div>

                        <div className="flex p-4">
                            {modifiedColumns.map((column) => (
                                <button
                                    key={column.Header}
                                    onClick={() => toggleColumnVisibility(column.accessor)}
                                    className={`${
                                        column.show ? "bg-violet-300" : "bg-gray-300"
                                    } text-white font-bold py-2 px-4 rounded mr-4 hover:bg-purple-700 hover:text-white`}
                                >
                                    {column.Header}
                                </button>
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
                                                className="px-6 py-3 text-left text-20 font-medium text-gray-400 uppercase rounded-sm tracking-wider"
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
                                        <tr {...row.getRowProps()}>
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
                                                        className="px-6 py-10 whitespace-nowrap"
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
                    <ChevronsLeft/>
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <ChevronLeft/>
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    <ChevronRight/>
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <ChevronsRight/>
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