import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const { authUser } = useAuthContext();
  const [selectedData, setSelectedData] = useState([]); // Initialize as empty array
  const [gsat, setGsat] = useState("GSAT-10");
  const [pid, setPid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [result, setResult] = useState({});
  const [gsatList, setGsatList] = useState([]);
  const [thresholdBreachedPeriods, setThresholdBreachedPeriods] = useState([]);
  const [selectedTable, setSelectedTable] = useState("allData");

  const fetchGsatAndPid = async () => {
    try {
      const response = await axios.get("http://localhost:4000/gsat/satellite");
      setGsatList(response.data.data);
    } catch (error) {
      console.error("Error fetching GSAT and PID data:", error);
    }
  };

  useEffect(() => {
    fetchGsatAndPid();
  }, []);

  const formatDateTime = (date, time) => {
    console.log(date, time);
    return `${date}T${time}`
  };

  const handleSubmit = async () => {
    const formattedStartDateTime =
      startDate ? formatDateTime(startDate, startTime === "" ? "00:00:00" : startTime) : null;
    const formattedEndDateTime =
      endDate ? formatDateTime(endDate, endTime === "" ? "23:59:59" : endTime) : null;

    try {
      const response = await axios.post("http://localhost:4000/check-details", {
        startDate: formattedStartDateTime,
        endDate: formattedEndDateTime
      });

      const data = response.data.data;
      setResult(data);
      console.log(response);
      setSelectedData(data.hourlyData || []); // Ensure hourlyData is always an array
      setThresholdBreachedPeriods(data.stabilityResult || {});
      setSelectedTable("allData");
    } catch (error) {
      console.error("Error posting data:", error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("gsatConfig"));
    if (storedConfig) {
      setGsat(storedConfig.gsat || "");
      setPid(storedConfig.selectedPid || "");
    }
  }, []);

  const handleNormalResultClick = () => {
    setSelectedData(result.hourlyData || []); // Ensure data is an array
    setSelectedTable("allData");
  };

  const handleButtonClick = () => {
    setSelectedData(result.thresholdBreach || []); // Ensure data is an array
    setSelectedTable("thresholdCrossings");
  };

  // const handleThresholdBreachedButtonClick = () => {
  //   setSelectedData(Object.entries(result.stabilityResult || {})); // Ensure data is an array
  //   setSelectedTable("thresholdBreachedPeriods");
  // };

  const handleStablePeriodClick = () => {
    setSelectedData(Object.entries(result.stabilityResult || {})); // Ensure data is an array
    setSelectedTable("stablePeriods");
  };

  // Function to render hourly data (all data table)
  const renderTableRows = (data) => {
    let previousRow = null; // Initialize previousRow outside the map function

    return (data || []).map((item, index) => {
      // Check if current row values differ from the previous row
      const isYawChanged = previousRow && item.yaw !== previousRow.yaw;
      const isRollChanged = previousRow && item.roll !== previousRow.roll;
      const isPitchChanged = previousRow && item.pitch !== previousRow.pitch;

      const row = (
        <tr key={index}>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td style={{ backgroundColor: isYawChanged ? "#ff7b7b91" : "" }}>
            {item.yaw.toFixed(4)}
          </td>
          <td
            style={{
              backgroundColor: isRollChanged ? "#fff02591" : "",
            }}
          >
            {item.roll.toFixed(4)}
          </td>
          <td
            style={{
              backgroundColor: isPitchChanged ? "#25ffa191" : "",
            }}
          >
            {item.pitch ? item.pitch.toFixed(4) : "null"}
          </td>
        </tr>
      );

      previousRow = item; // Update previousRow after rendering the current row

      return row;
    });
  };

  // Function to render threshold breached data
  // const renderThresholdBreachedPeriods = (data) => {
  //   return (data || []).map((item, index) => (
  //     <React.Fragment key={index}>
  //       {item.thresholdCrossedObj.map((val, subIndex) => (
  //         <tr key={subIndex}>
  //           <td>{`${item.date} ${item.time}`}</td>
  //           <td>{val.type}</td>
  //           <td>{val.value.toFixed(4)}</td>
  //           <td>{val.threshold.toFixed(4)}</td>
  //           <td>{val.difference.toFixed(4)}</td>
  //           <td>{val.status}</td>
  //         </tr>
  //       ))}
  //     </React.Fragment>
  //   ));
  // };
  // Function to render threshold crossings


  const renderCrossedVal = (thresholdBreach) => {
    if (!thresholdBreach.length) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            No threshold crossings available
          </td>
        </tr>
      );
    }

    return thresholdBreach.map((val, index) => {
      // Set color based on the parameter type
      let color;
      if (val.type === "yaw") color = "red";
      if (val.type === "pitch") color = "#00c06d";
      if (val.type === "roll") color = "blue";

      return (
        <tr key={index}>
          <td colSpan={2} style={{ color }}>{`${val.date} ${val.time}`}</td>
          <td style={{ color }}>{val.type}</td>
          <td style={{ color }}>{val.value.toFixed(4)}</td>
          <td style={{ color }}>{val.threshold.toFixed(4)}</td>
          <td style={{ color }}>{val.difference.toFixed(4)}</td>
          <td colSpan={2} style={{ color }}>{`Crossed ${val.status} limit`}</td>
        </tr>
      );
    });
  };



  const renderStablePeriods = (stabilityResult) => {
    // Check if the data is empty or all arrays are empty for all dates
    const hasNoStablePeriods = Object.keys(stabilityResult).every((date) =>
      Object.values(stabilityResult[date]).every((arr) => Array.isArray(arr) && arr.length === 0)
    );

    // Display fallback message if no stable periods are detected
    if (!stabilityResult || hasNoStablePeriods) {
      return (
        <tr>
          <td colSpan="5">No stable periods yet</td>
        </tr>
      );
    }

    // Log stabilityResult for debugging
    console.log("Stability Result:", stabilityResult);

    // Render table headers and data
    return (
      <>

        {Object.entries(stabilityResult).map(([date, parameters]) => {
          console.log(date, parameters)
          return Object.entries(parameters[1]).map(([parameterKey, values]) => {
            return values.map((item, subIndex) => (
              <tr key={`${parameters[0]}`}>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>{parameterKey}</td>
                <td>{item.value.toFixed(4)}</td>
                <td>{item.duration}</td>
              </tr>
            ));
          });
        })}
      </>
    );
  };





  return (
    <div className="home">
      <div className="input-section">
        <div className="chld">
          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Start Time
            <input
              type="text"
              placeholder="hh:mm:ss"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
        </div>
        <div className="chld">
          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label>
            End Time
            <input
              type="text"
              placeholder="hh:mm:ss"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>
      </div>

      <button className="submit" onClick={handleSubmit}>
        Submit
      </button>

      <div className="button-section">
        <button onClick={handleNormalResultClick}>All Data</button>
        <button onClick={handleButtonClick}>Threshold Crossings</button>
        {/* <button onClick={handleThresholdBreachedButtonClick}>
          Threshold Breached Periods
        </button> */}
        <button onClick={handleStablePeriodClick}>Stable Periods</button>
      </div>

      <div className="table-section">
        {selectedTable === "allData" && (
          <>
            <h3>All Data</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Pitch</th>
                  <th>Roll</th>
                  <th>Yaw</th>
                </tr>
              </thead>
              <tbody>{selectedData.length > 0 ? renderTableRows(selectedData) :
                <tr style={{ padding: "20px", display: "block", width: "400px" }}>No data to show here.</tr>
              }</tbody>
            </table>
          </>
        )}

        {selectedTable === "thresholdCrossings" && (
          <>
            <h3>Threshold Crossings</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th colSpan={2}>Date-Time</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Threshold</th>
                  <th>Difference</th>
                  <th colSpan={2}>Status</th>
                </tr>
              </thead>
              <tbody>{selectedData.length > 0 ? renderCrossedVal(selectedData) :
                <tr style={{ padding: "20px", display: "block", width: "400px" }}>No data to show here.</tr>
              }</tbody>
            </table>
          </>
        )}

        {/* {selectedTable === "thresholdBreachedPeriods" && (
          <>
            <h3>Threshold Breached Periods</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Parameter</th>
                  <th>Average Value</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>{renderThresholdBreachedPeriods(selectedData)}</tbody>
            </table>
          </>
        )} */}

        {selectedTable === "stablePeriods" && (
          <>
            <h3>Stable Periods</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>{selectedData.length > 0 ? renderStablePeriods(selectedData) :
                <tr style={{ padding: "20px", display: "block", width: "400px" }}>No data to show here.</tr>
              }</tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
