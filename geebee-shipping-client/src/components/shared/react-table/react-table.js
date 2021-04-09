import './react-table.css';

import { useState } from 'react'
import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import { Redirect } from "react-router-dom";

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';

import { FaTrash, FaPen, FaEye } from 'react-icons/fa';



//data will be the axios request--- formType will be the edit form linked--- tRole will decide if the passed role has edit/delete permissions
function Table({ columns, data, formType, tRole }) {
  const [tableRole, setTableRole] = useState(tRole);
  const [editCheck, setEditCheck] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [disableCheck, setDisableCheck] = useState("");
  const [deleteCheck, setDeleteCheck] = useState(false);
  const [viewCheck, setViewCheck] = useState(false);

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

  const viewSelection = (rowData) => {
    setSelectedRow(rowData);
    setTimeout(setViewCheck(true), 400);
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
      }, useGlobalFilter, useSortBy)


  //checks what table type and sends to respective edit form
  if (editCheck) {
    if (formType === "Company") {
      return <Redirect to={{
        pathname: "./company-manager/edit",
        state: { data: selectedRow }
      }} />;
    } else if (formType === "Fleet Manager") {
      return <Redirect to={{
        pathname: "./fleet/edit",
        state: { data: selectedRow }
      }} />;
    } if (formType === "Order") {
      return <Redirect to={{
        pathname: "./order-manager/edit",
        state: { data: selectedRow }
      }} />;
    } else {
      alert("formType not found")
      return <Redirect to={{
        pathname: "./"
      }} />;
    }
  }

  if (deleteCheck) {
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

  if (viewCheck) {
    if (formType == "Driver") {
      return <Redirect to={{
        pathname: "./driver/route-details",
        state: { data: selectedRow }
      }} />;
    } 
    else if (formType == "Retail") {
      return <Redirect to={{
        pathname: "./retail/order-details",
        state: { data: selectedRow }
      }} />;
    }
    else if (formType == "Order"){
      return <Redirect to={{
        pathname: "./order-manager/order-details",
        state: { data: selectedRow }
      }} />;
    }
  }

  //set input state and checks if input is delete 
  const confirmDeleteInput = e => {
    console.log(selectedRow);
    const value = e.target.value || undefined;
    setDeleteInput(value);
    if (value === "delete") {
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
        <Button className="text-danger" onClick={()=>setDeleteInput("")} variant="link"><FaTrash /></Button>
      </OverlayTrigger>

    </td>
  );

  const editDeleteViewColumn = (
    <td className="text-center m-0 p-0 w-sml-col">
      <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={editPopover}>
        <Button className="text-success" variant="link"><FaPen /></Button>
      </OverlayTrigger>

      <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={deletePopover}>
        <Button className="text-danger" onClick={()=>setDeleteInput("")} variant="link"><FaTrash /></Button>
      </OverlayTrigger>

      <Button onClick={setViewCheck}><FaEye /></Button>
    </td>
  );

  const viewColumn = (
    <td>
      <Button onClick={setViewCheck}><FaEye /></Button>
    </td>
  );

  const editDeleteShow = (tRole) => {
    if (tRole === "Admin" || tRole === "distribution" || tRole === "Fleet Manager") {
      return editDeleteColumn;
    }
    if (tRole === "Driver" || tRole === "Retail") {
      return viewColumn;
    }
    if (tRole === "AdminOrder"){
      return editDeleteViewColumn;
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
          placeholder={"Input keyword"} />
      </div>

      <table className="table table-striped table-hover table-size mb-5" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
               
              ))}
               <th></th>
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
        
      </table>
    </div>
  )
}

export default Table;