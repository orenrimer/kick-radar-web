import React from "react";
import "./Table.css";


const Table = ({ columns, data, handleOnClick }) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} onClick={() => handleOnClick(row[columns[0].accessor])}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} >
                                        {row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr >
                            <td colSpan={columns.length} className="no-data" >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
