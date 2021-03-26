import { useState } from 'react'
import BTable from 'react-bootstrap/Table';
import { useTable, useGlobalFilter } from 'react-table'
import { Redirect } from "react-router-dom";

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';

import { FaTrash, FaPen } from 'react-icons/fa';

// import EditCompanyForm from '../../admin/forms/edit/edit-company';

function Table({ columns, data, formType }) {

  const [editCheck, setEditCheck] = useState(false);
  //------Selected Row  will be passed to the edit data form
  const [selectedRow, setSelectedRow] = useState([]);

  const editSelection = (rowData) => {
    console.log("We got here");
    setSelectedRow(rowData);
    setTimeout(setEditCheck(true), 1000);
  }

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
        data,
      }, useGlobalFilter)

  if (editCheck) {
    //Will need pathname to be passed on creation of react-table
    if(formType === "company"){
      return <Redirect to={{
        pathname: "./company-manager/edit",
        state: { data: selectedRow }
      }} />;
    }
    else{
      alert("formType not found")
      return <Redirect to={{
        pathname: "./company-manager/"
      }} />;
    }
  }


  const editPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <button type='button' onClick={() => editSelection(selectedRow)} className="btn btn-sm btn-link">Edit Entry</button>
        </Popover.Content>
    </Popover>
  );

  //We will get to this later - needs a confirm delete
  const deletePopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <button type='button' className="btn btn-sm btn-link">Delete Entry</button>
        </Popover.Content>
    </Popover>
  );


  // Render the UI for your table
  return (
    <div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="lblSearch">Search</span>
        <input type="text" className={"form-control col-sm-5 col-md-3 col-lg-2"}
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Input keyword here..."} />
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
              <tr {...row.getRowProps()} onClick={() => setSelectedRow(row.original)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
                <td class="text-center m-0 p-0">
                <OverlayTrigger rootClose="true" trigger="click" placement="top" overlay={editPopover}>
                <Button variant="link"><FaPen/></Button>
                </OverlayTrigger>
                 
                <OverlayTrigger rootClose="true" trigger="click" placement="top" overlay={deletePopover}>
                <Button variant="link"><FaTrash /></Button>
                </OverlayTrigger>
                </td>
              </tr>
            )
          })}
        </tbody>
      </BTable>
    </div>
  )
}

export default Table;