import React, { useState, useEffect } from "react";
import "../../styles/Home.css";
import axios from "axios";
const dummyData = {
  result: [
    {
      date: "2024-09-01",
      time: "12:00:00",
      yaw: -1.48,
      roll: -3.35,
      pitch: 12.7,
    },
    {
      date: "2024-09-02",
      time: "14:30:00",
      yaw: -1.46,
      roll: -3.35,
      pitch: 12.9,
    },
    {
      date: "2024-09-03",
      time: "16:45:00",
      yaw: -1.47,
      roll: -3.35,
      pitch: 12.9,
    },
    {
      date: "2024-09-03",
      time: "16:45:00",
      yaw: -1.47,
      roll: -3.32,
      pitch: 12.9,
    },
    {
      date: "2024-09-03",
      time: "16:45:00",
      yaw: -1.47,
      roll: -3.32,
      pitch: 12.6,
    },
  ],
  thresholdArr: [
    {
      actualObj: {
        date: "2024-09-02",
        time: "14:30:00",
        yaw: -1.46,
        roll: -3.35,
        pitch: 12.7,
      },
      crossedVal: [
        { type: "yaw", value: -1.46, amount: 0.03 },
        { type: "roll", value: -3.35, amount: 0.02 },
        { type: "pitch", value: -12.7, amount: 0.01 },
      ],
    },
  ],
  inactivity: [
    {
      type: "inactivity",
      value: "stable",
      start: { date: "2024-09-03", time: "09:00:00" },
      end: { date: "2024-09-03", time: "14:00:00" },
    },
  ],
  stabilityArr: [
    {
      date: "2024-09-04",
      key: "yaw",
      value: -1.5,
      startTime: "10:00:00",
      endTime: "12:00:00",
    },
    {
      date: "2024-09-04",
      key: "pitch",
      value: -1.5,
      startTime: "10:00:00",
      endTime: "12:00:00",
    },
    {
      date: "2024-09-04",
      key: "roll",
      value: -1.5,
      startTime: "10:00:00",
      endTime: "12:00:00",
    },
  ],
};

const Table = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [gsat, setGsat] = useState("");
  const [pid, setPid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [result, setResult] = useState({});
  const [thresholdBreachedPeriods, setThresholdBreachedPeriods] = useState([]);
  const [selectedTable, setSelectedTable] = useState("allData");

  const formatDateTime = (date, time) => `${date}T${time}`;

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("gsatConfig"));
    if (storedConfig) {
      setGsat(storedConfig.gsat || "");
      setPid(storedConfig.selectedPid || "");
    }
  }, []);

  const handleNormalResultClick = () => {
    setSelectedData(result.result);
    setSelectedTable("allData");
  };

  const handleButtonClick = () => {
    setSelectedData(result.thresholdArr);
    setSelectedTable("thresholdCrossings");
  };

  const handleActiveButtonClick = () => {
    setSelectedData(result.inactivity);
    setSelectedTable("stablePeriod");
  };

  const handleThresholdBreachedButtonClick = () => {
    setSelectedData(thresholdBreachedPeriods);
    setSelectedTable("thresholdBreachedPeriods");
  };
  useEffect(() => {
    // Set dummy data to mimic actual API response
    setResult(dummyData);
    setSelectedData(dummyData.result);
    setThresholdBreachedPeriods(dummyData.stabilityArr);
  }, []);

  // Function to compare values and add highlight class
  const compareWithPrevious = (currentVal, previousVal) => {
    return currentVal !== previousVal ? "highlight" : "";
  };

  const renderTableRows = (data) => {
    let previousRow = null; // Initialize previousRow outside the map function

    return data.map((item, index) => {
      const isYawChanged = previousRow && item.yaw !== previousRow.yaw;
      const isRollChanged = previousRow && item.roll !== previousRow.roll;
      const isPitchChanged = previousRow && item.pitch !== previousRow.pitch;

      const row = (
        <tr key={index}>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td
            style={{
              backgroundColor: isYawChanged ? "#ff5e5e62" : "",
            }}
          >
            {item.yaw}
          </td>
          <td
            style={{
              backgroundColor: isRollChanged ? "#5eff9e62" : "",
            }}
          >
            {item.roll}
          </td>
          <td
            style={{
              backgroundColor: isPitchChanged ? "#fcff5e62" : "",
            }}
          >
            {item.pitch || "null"}
          </td>
        </tr>
      );

      previousRow = item; // Update previousRow after rendering the current row

      return row;
    });
  };

  const renderTableForInactivity = (data) => {
    if (data.length > 0) {
      return data.map((item, index) => (
        <tr
          key={index}
          className={
            Math.abs(
              item.end.time.split(":")[0] - item.start.time.split(":")[0]
            ) >= 4
              ? "red"
              : ""
          }
        >
          <td>{item.type}</td>
          <td>{item.value}</td>
          <td>{`${item.start.date} ${item.start.time}`}</td>
          <td>{`${item.end.date} ${item.end.time}`}</td>
        </tr>
      ));
    }
    return (
      <tr>
        <td colSpan="4">No data found</td>
      </tr>
    );
  };

  const renderCrossedVal = (crossedVals, actualObj) => {
    return crossedVals.map((val, index) => {
      let color = "black"; // Default color

      if (val.type === "yaw") color = "#ff5e5e";
      if (val.type === "pitch") color = "green";
      if (val.type === "roll") color = "blue";

      return (
        <tr key={index} className="crossed-val-row">
          <td>{`${actualObj.date} ${actualObj.time}`}</td>
          <td style={{ color }}>{val.type}</td>
          <td style={{ color }}>{val.value}</td>
          <td style={{ color }}>{val.amount.toFixed(4) || "N/A"}</td>
        </tr>
      );
    });
  };

  const renderTableRowsWithCrossedVal = (data) => {
    return data.map((item, index) => (
      <React.Fragment key={Math.random()}>
        {item.crossedVal && renderCrossedVal(item.crossedVal, item.actualObj)}
      </React.Fragment>
    ));
  };

  const renderThresholdBreachedPeriods = (data) => {
    return data.map((item, index) => {
      let color = "black"; // Default color

      if (item.key === "yaw") color = "red";
      if (item.key === "pitch") color = "green";
      if (item.key === "roll") color = "blue";

      return (
        <tr key={index}>
          <td>{item.date}</td>
          <td style={{ color }}>{item.key}</td>
          <td style={{ color }}>{item.value}</td>
          <td style={{ color }}>{item.startTime}</td>
          <td style={{ color }}>{item.endTime}</td>
        </tr>
      );
    });
  };

  const handleSubmit = async () => {
    const formattedStartDateTime =
      startDate && startTime ? formatDateTime(startDate, startTime) : null;
    const formattedEndDateTime =
      endDate && endTime ? formatDateTime(endDate, endTime) : null;

    try {
      const response = await axios.post("http://localhost:4000/check-details", {
        startDateTime: formattedStartDateTime,
        endDateTime: formattedEndDateTime,
      });

      const data = response.data.data;
      setResult(data);
      setSelectedData(data.result);
      setThresholdBreachedPeriods(data.stabilityArr || []);
      setSelectedTable("allData");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  return (
    <div>
      <div className="button-section">
        <button onClick={handleNormalResultClick}>All Data</button>
        <button onClick={handleButtonClick}>Threshold Crossings</button>
        <button onClick={handleActiveButtonClick}>Stable Period</button>
        <button onClick={handleThresholdBreachedButtonClick}>
          Threshold Breached Periods
        </button>
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
                  <th>Yaw</th>
                  <th>Roll</th>
                  <th>Pitch</th>
                </tr>
              </thead>
              <tbody>{renderTableRows(selectedData)}</tbody>
            </table>
          </>
        )}

        {selectedTable === "thresholdCrossings" && (
          <>
            <h3>Threshold Crossings</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date-Time</th>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Crossed By</th>
                </tr>
              </thead>
              <tbody>{renderTableRowsWithCrossedVal(selectedData)}</tbody>
            </table>
          </>
        )}

        {selectedTable === "stablePeriod" && (
          <>
            <h3>Stable Period</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>{renderTableForInactivity(selectedData)}</tbody>
            </table>
          </>
        )}

        {selectedTable === "thresholdBreachedPeriods" && (
          <>
            <h3>Threshold Breached Periods</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>{renderThresholdBreachedPeriods(selectedData)}</tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
