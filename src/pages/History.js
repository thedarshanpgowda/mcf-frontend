import React, { useState, useEffect } from "react";
import axios from "axios";

const data = [
  {
    _id: "66e1cf39e009e237b5effebf",
    id: "17fbe527-ce06-4db3-a3e2-4ea3c455e7f2",
    userId: "975043c8-5181-495e-bf51-f8a7a281d7b5",
    name: "Karthik V",
    date: "2024-09-11T17:11:15.197Z",
    gsat: "9",
    searchedDate: "Wed Aug 21 2024 00:00:01 GMT+0530 (India Standard Time)",
  },
  {
    _id: "77e1cf39e009e237b5effebf",
    id: "28fbe527-ce06-4db3-a3e2-4ea3c455e7f3",
    userId: "975043c8-5181-495e-bf51-f8a7a281d7b6",
    name: "Anita Sharma",
    date: "2024-09-12T14:22:00.000Z",
    gsat: "10",
    searchedDate: "Thu Sep 05 2024 12:30:00 GMT+0530 (India Standard Time)",
  },
  {
    _id: "88e1cf39e009e237b5effebf",
    id: "39fbe527-ce06-4db3-a3e2-4ea3c455e7f4",
    userId: "975043c8-5181-495e-bf51-f8a7a281d7b7",
    name: "Raj Patel",
    date: "2024-09-13T09:45:30.123Z",
    gsat: "11",
    searchedDate: "Mon Sep 09 2024 09:00:00 GMT+0530 (India Standard Time)",
  },
  {
    _id: "99e1cf39e009e237b5effebf",
    id: "49fbe527-ce06-4db3-a3e2-4ea3c455e7f5",
    userId: "975043c8-5181-495e-bf51-f8a7a281d7b8",
    name: "Sonia Gupta",
    date: "2024-09-14T16:10:45.789Z",
    gsat: "12",
    searchedDate: "Fri Sep 06 2024 16:15:00 GMT+0530 (India Standard Time)",
  },
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/history");
      const formattedData = response.data.data.map((item) => ({
        ...item,
        date: formatDate(item.date),
        searchedDate: formatSearchedDate(item.searchedDate),
      }));
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}${hours}:${minutes}:${seconds}`;
  };

  const formatSearchedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString().split(" GMT")[0]; // Remove the GMT offset
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter the data based on the search term
  const filteredData = data.filter(
    (row) =>
      row?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row?.gsat_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row?.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row?.searchedDate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <h1 className="history-title">History</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-box"
      />
      <table className="history-table">
        <thead>
          <tr>
            <th className="history-table-header">Name</th>
            {/* <th className="history-table-header">GSAT</th> */}
            <th className="history-table-header">Search Time</th>
            <th className="history-table-header">Time Searched For</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td className="history-table-data">{row.userId}</td>
              {/* <td className="history-table-data">{row.gsat_number}</td> */}
              <td className="history-table-data">{row.date}</td>
              <td className="history-table-data">{row.searchedDate}</td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="4" className="history-table-data">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
