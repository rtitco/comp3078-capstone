import '../../shared/react-table/react-table.css';
import { useEffect, useState } from 'react';
import BTable from 'react-bootstrap/Table';
import { useTable, useGlobalFilter } from 'react-table';
import axios from 'axios';

function OrderSchedule({ columns, data }) {

    //------Search Filter
    const [filterInput, setFilterInput] = useState("");
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setGlobalFilter(value)
        setFilterInput(value);
    };

    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter
    } =
        useTable(
            {
                columns,
                data
            },
            useGlobalFilter
        )


    // Render the UI for your table
    return (
        <div>
            <label><h4></h4></label>
            <div className="input-group mb-3">
                <span className="input-group-text" id="lblSearch">Search</span>
                <input type="text" className={"form-control col-sm-5 col-md-3 col-lg-2"}
                    value={filterInput}
                    onChange={handleFilterChange}
                    placeholder={"Input keyword"} />
            </div>

            <BTable striped bordered hover size="sm" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>

            </BTable>
        </div>
    )
}

export default OrderSchedule;