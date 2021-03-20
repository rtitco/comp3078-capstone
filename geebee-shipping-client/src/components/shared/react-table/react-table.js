import { useState, useEffect } from 'react'
import BTable from 'react-bootstrap/Table';
import { useTable, useGlobalFilter } from 'react-table'




const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [canEdit, setCanEdit] = useState(false);

  //This returns a different element for input
  const onClick = e => {
      setCanEdit(true);
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateData(index, id, value)
    setCanEdit(false);
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if(!canEdit){
    return <input value={value} className="form-control-plaintext" onClick={onClick}/>
  } else {
    return <input value={value} className="form-control" onChange={onChange} onClick={onClick} onBlur={onBlur} />
  }
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}



function Table({ columns, data, updateDB }) {
  // 


  //------Selected Row  will be passed to the updateData function so it may update the Data
  const [selectedRow, setSelectedRow] = useState([]);

  //------Search Filter
  const [filterInput, setFilterInput] = useState("");
  
  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setGlobalFilter(value)
    setFilterInput(value);
  };

    //------Editable Column 
    const [lines, setLines] = useState([data]);
    const updateData = (rowIndex, columnID, value) => {
      debugger
      //We need the row information which has the old data, so we take the new value, figure out where it came from (fname, lName etc.)
      //And update the new value accordingly
      const x = selectedRow;
      setLines(old =>
        old.map((row, index) => {
          console.log(row, index)
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnID]: value
            };
          }
          return row;
        })
      );
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
        defaultColumn,
        updateData,
      }, useGlobalFilter)


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
              </tr>
            )
          })}
        </tbody>
      </BTable>
    </div>
  )
}

export default Table;