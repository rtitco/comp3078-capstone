import './react-table.css';

import { useState } from 'react'
import BTable from 'react-bootstrap/Table';
import { useTable, useGlobalFilter } from 'react-table'
import { Redirect } from "react-router-dom";

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';

import { FaTrash, FaPen } from 'react-icons/fa';



//data will be the axios request--- formType will be the edit form linked--- tRole will decide if the passed role has edit/delete permissions
function Table({ columns, data, formType, tRole }) {
  const [tableRole, setTableRole] = useState(tRole);
  const [editCheck, setEditCheck] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [disableCheck, setDisableCheck] = useState("");
  const [deleteCheck, setDeleteCheck] = useState(false);

  //------Selected Row  will be passed to the edit data form
  const [selectedRow, setSelectedRow] = useState([]);

  const editSelection = (rowData) => {
    setSelectedRow(rowData);
    setTimeout(setEditCheck(true), 400);
  }
  

  const deleteSelection = (rowData) => {
    setSelectedRow(rowData);
    setTimeout(setDeleteCheck(true), 400);
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


  //checks what table type and sends to respective edit form
  if (editCheck) {
    if (formType === "company") {
      return <Redirect to={{
        pathname: "./company-manager/edit",
        state: { data: selectedRow }
      }} />;
    } else if (formType === "Fleet Manager") {
      console.log(selectedRow)
      return <Redirect to={{
        pathname: "./fleet/edit",
        state: { data: selectedRow }
      }} />;
    } else {
      alert("formType not found")
      return <Redirect to={{
        pathname: "./"
      }} />;
    }
  }

  if(deleteCheck){
    if (formType != "") {
      return <Redirect to={{
        pathname: "./row/delete",
        state: { data: selectedRow, deleteType: formType }
      }} />;
    } else {
      alert("formType not found")
      return <Redirect to={{
        pathname: "./"
      }} />;
    }
  }

  //set input state and checks if input is delete 
  const confirmDeleteInput = e => {
    const value = e.target.value || undefined;
    setDeleteInput(value);
    if(value === "delete"){
      setDisableCheck("delete")
    } else {
      setDisableCheck("")
    }
  }



  const editPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <button type='button' onClick={() => editSelection(selectedRow)} className="btn btn-sm btn-success">Edit Entry</button>
      </Popover.Content>
    </Popover>
  );

  //We will get to this later - needs a confirm delete
  const deletePopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <p className="text-center p-0 m-0">Type <b>delete</b> to confirm. </p>
        <br />
          <div className="input-group mb-3">
            <input type="text" className={"form-control"}
              value={deleteInput}
              onChange={confirmDeleteInput}
              placeholder={"Confirm here..."} />
            <button disabled={!disableCheck} onClick={() => deleteSelection(selectedRow)} type='button' className="btn btn-sm btn-danger p-1">Delete</button>
          </div>

      </Popover.Content>
    </Popover>
  );

  const editDeleteColumn = (
    <td className="text-center m-0 p-0 w-sml-col">
      <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={editPopover}>
        <Button className="text-success" variant="link"><FaPen /></Button>
      </OverlayTrigger>

      <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={deletePopover}>
        <Button className="text-danger" variant="link"><FaTrash /></Button>
      </OverlayTrigger>
    </td>
  );
  const editDeleteShow = (tRole) => {
    if (tRole === "admin" || tRole === "distribution" || tRole === "Fleet Manager") {
      return editDeleteColumn;
    }
  }


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
                {
                  editDeleteShow(tableRole)
                }
              </tr>

            )
          })}
        </tbody>
      </BTable>
    </div>
  )
}

export default Table;