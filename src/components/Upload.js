import React, { useState, useEffect } from "react";
import classes from "./Upload.module.css";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

const Upload = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const recordsPerPage = 100;

  useEffect(() => {
    const storedData = localStorage.getItem("excelData");
    if (storedData) {
      setData(JSON.parse(storedData));
      setIsTableVisible(true);
      console.log(data);
    }
  }, [localStorage.getItem("excelData")]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      localStorage.setItem("excelData", JSON.stringify(parsedData));
      setData(parsedData);
      setIsTableVisible(true);
      console.log(data);
    };
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = data.slice(firstIndex, lastIndex);

  return (
    <div className={classes.body}>
      <div className="flex justify-center items-center mt-20">
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-84 text-sm text-gray-900 border border-gray-300 cursor-pointer rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            onChange={handleFileUpload}
            type="file"
            accept=".xlsx, .xls"
          />
        </div>
      </div>
      {isTableVisible && (
        <div>
          <div className="flex justify-center mt-8 mx-16 rounded-xl">
            {currentRecords.length > 0 && (
              <table className="w-8/12 border-collapse border rounded-xl border-gray-400">
                <thead>
                  <tr className="bg-gray-600 text-cyan-50 border-b border-gray-400">
                    {Object.keys(currentRecords[0]).map((key) => (
                      <th
                        className="border-r border-gray-400 px-4 py-2"
                        key={key}
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row, index) => (
                    <tr
                      className="bg-gray-50 border-b border-gray-400"
                      key={index}
                    >
                      {Object.values(row).map((value, index) => (
                        <td
                          className="border-r border-gray-400 px-4 py-2"
                          key={index}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <svg
                class="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Previous
            </button>

            <button
              className="flex items-center justify-center px-3 h-8 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(data.length / recordsPerPage)}
            >
              Next
              <svg
                class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-end" style={{ marginTop: "-35px" }}>
            <Link
              to="/url"
              type="button"
              className="text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900 items-end mr-80 p-2"
            >
              Api Calls
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
