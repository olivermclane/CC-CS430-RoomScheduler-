import {useMemo, Fragment, useCallback, useEffect, useState} from "react";
import React from "react";

import {
    Search,
    Check,
    ChevronsLeft,
    ChevronLeft,
    ChevronsRight,
    ChevronRight,
    ChevronDownSquare,
    MoveDown,
    MoveUp
} from 'lucide-react';
import {DOTS, useCustomPagination} from './pagination/CustomPagination';

import {useTable, useGlobalFilter, useAsyncDebounce, usePagination, useRowSelect} from 'react-table'  // new

import {useRowSelectColumn} from '@lineup-lite/hooks';
import axios from "axios";



export function GlobalFilter({globalFilter, setGlobalFilter, placeholder}) {
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span className='flex justify-between ml-auto pt-10 pb-10 '>
        <input
            value={value || ""}
            onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            className='w-8/12 rounded-xl border p-4 text-gray-500 cursor-pointer'
            type="search"
            placeholder={placeholder}
        />
         <button
             className='bg-white rounded-xl p-4 border-1 cursor-pointer'>
            Export
        </button>
      </span>
    )
};

const Table = () => {
    const [tableData, setTableData] = useState([]);
    const fetchData = async () => {
        try {
            const storedToken = localStorage.getItem('access_token'); // Or wherever you store it
            const response = await axios.get('http://localhost:8000/courses/', {
                headers: {
                    Authorization: `Bearer ${storedToken}`, // Redacted access token
                },
            });

             setTableData(response.data)
        } catch (err) {
            if (err.response) {
                // Server-side error
                console.log("Server error:", err.response.data);
            } else if (err.request) {
                // Network error
                console.log("Network error:", err.message);
            } else {
                // Other error
                console.log("Error:", err.message);
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    const data = tableData;

    const columns = useMemo(() => [
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
    ], []);

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
    } =
        useTable({
                columns,
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
        currentPage: pageIndex
    });

    return (
        <div className="mt-2 flex flex-col">
            <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            placeholder="Search..." // or customize your placeholder text
                        />
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-10">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="px-6 py-5 text-left text-20 font-medium text-gray-400 uppercase rounded-sm tracking-wider"
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                            {page.map((row, i) => {
                                prepareRow(row); // Ensure this is called before rendering row cells
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td
                                                {...cell.getCellProps()}
                                                className="px-6 py-10 whitespace-nowrap"
                                            >
                                                {cell.render("Cell")}
                                            </td>
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
                {' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <ChevronLeft/>
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    <ChevronRight/>
                </button>
                {' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <ChevronsRight/>
                </button>
                {' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageCount}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{width: '100px'}}
                    />
                </span>{' '}
                <select
                    value={state.pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Table