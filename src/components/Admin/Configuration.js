import React, { useState, useEffect } from "react";
import axios from "axios";

const Configuration = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [level, setLevel] = useState(1);
  const [gsat, setGsat] = useState("");
  const [pidOptions, setPidOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isAddingGsat, setIsAddingGsat] = useState(false);
  const [newGsat, setNewGsat] = useState("");
  const [newPids, setNewPids] = useState("");
  const [samplingTimeMin, setSamplingTimeMin] = useState("");
  const [samplingTimeMax, setSamplingTimeMax] = useState("");
  const [period, setPeriod] = useState("");
  const [gsatList, setGsatList] = useState([]);
  const [isGsatEditable, setIsGsatEditable] = useState(false);
  const [isPidEditable, setIsPidEditable] = useState(false);
  const [isRollEditable, setIsRollEditable] = useState(false);
  const [isPitchEditable, setIsPitchEditable] = useState(false);
  const [isYawEditable, setIsYawEditable] = useState(false);
  const [isSamplingTimeEditable, setIsSamplingTimeEditable] = useState(false);
  const [isPeriodEditable, setIsPeriodEditable] = useState(false);

  const [rollMin, setRollMin] = useState("");
  const [rollMax, setRollMax] = useState("");
  const [pitchMin, setPitchMin] = useState("");
  const [pitchMax, setPitchMax] = useState("");
  const [yawMin, setYawMin] = useState("");
  const [yawMax, setYawMax] = useState("");
  const [selectedPid, setSelectedPid] = useState("");
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [deleteGsat, setDeleteGsat] = useState("");

  const fetchGsatAndPid = async () => {
    try {
      const response = await axios.get("http://localhost:4000/gsat/satellite");
      console.log(response)
      setGsatList(response.data.data);
    } catch (error) {
      console.error("Error fetching GSAT and PID data:", error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/threshold");
      const data = response.data.data[0];
      setGsat(data.gsat_number);
      findPid(data.gsat_number);
      setSelectedPid(data.selectedPid);
      setRollMin(data.roll.min);
      setRollMax(data.roll.max);
      setPitchMin(data.pitch.min);
      setPitchMax(data.pitch.max);
      setYawMin(data.yaw.min);
      setYawMax(data.yaw.max);
      setSamplingTimeMin(data.samplingTime.min);
      setSamplingTimeMax(data.samplingTime.max);
      setPeriod(data.period);
    } catch (error) {
      console.error("Error fetching configuration data:", error);
    }
  };

  useEffect(() => {
    fetchGsatAndPid();
    getData();
  }, []);

  const handleEdit = async (section) => {
    // Reset all other edit states
    setIsGsatEditable(false);
    setIsPidEditable(false);
    setIsRollEditable(false);
    setIsPitchEditable(false);
    setIsYawEditable(false);
    setIsSamplingTimeEditable(false);
    setIsPeriodEditable(false);

    // Prepare data to send to backend
    let dataToSend = {};

    switch (section) {
      case "roll":
        dataToSend = {
          key: "roll",
          min: rollMin,
          max: rollMax,
        };
        setIsRollEditable(true);
        break;
      case "pitch":
        dataToSend = {
          key: "pitch",
          min: pitchMin,
          max: pitchMax,
        };
        setIsPitchEditable(true);
        break;
      case "yaw":
        dataToSend = {
          key: "yaw",
          min: yawMin,
          max: yawMax,
        };
        setIsYawEditable(true);
        break;
      case "samplingTime":
        dataToSend = {
          key: "samplingTime",
          min: samplingTimeMin,
          max: samplingTimeMax,
        };
        setIsSamplingTimeEditable(true);
        break;
      case "period":
        dataToSend = {
          key: "period",
          value: period,
        };
        setIsPeriodEditable(true);
        break;
      case "gsat":
        dataToSend = {
          key: "gsat",
          gsat,
          selectedPid,
        };
        setIsGsatEditable(true);
        setIsPidEditable(true);
        break;
      default:
        break;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/threshold/${section}`,
        { value: dataToSend }
      );
      // Handle success response if needed
      console.log("Success:", response.data);
    } catch (error) {
      // Handle error if needed
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const config = {
        gsat,
        selectedPid,
        roll: { min: rollMin, max: rollMax },
        pitch: { min: pitchMin, max: pitchMax },
        yaw: { min: yawMin, max: yawMax },
        samplingTime: { min: samplingTimeMin, max: samplingTimeMax },
        period,
      };
      localStorage.setItem("gsatConfig", JSON.stringify(config));

      await axios.post("http://localhost:4000/threshold", config);
      // Reset all values and states after successful submission
      setGsat("");
      setSelectedPid("");
      setPidOptions([]);
      setRollMin("");
      setRollMax("");
      setPitchMin("");
      setPitchMax("");
      setYawMin("");
      setYawMax("");
      setSamplingTimeMin("");
      setSamplingTimeMax("");
      setPeriod("");
      setIsGsatEditable(false);
      setIsPidEditable(false);
      setIsRollEditable(false);
      setIsPitchEditable(false);
      setIsYawEditable(false);
      setIsSamplingTimeEditable(false);
      setIsPeriodEditable(false);
    } catch (error) {
      console.error("Error submitting configuration:", error);
    }
  };
  const handleAddGsat = async () => {
    if (newGsat && newPids) {
      setIsAddingGsat(false);
      setNewGsat("");
      setNewPids("");

      const pidArray = newPids.split(",").map((pid) => pid.trim());
      const newGsatOption = { gsat: newGsat, pids: pidArray };

      try {
        const response = await axios.post(
          "http://localhost:4000/gsat/satellite",
          newGsatOption
        );
        console.log(response);
        console.log("GSAT added successfully");
        // setGsatList([...gsatList, newGsatOption]); // Update gsatList with new GSAT
        setIsAddingGsat(false);
        fetchGsatAndPid();
        setNewGsat("");
        setNewPids("");
      } catch (error) {
        console.error("Error adding GSAT:", error);
      }
    }
  };

  const handleGsatChange = (e) => {
    const selectedGsat = e.target.value;
    if (selectedGsat === "add-new") {
      setIsAddingGsat(true);
    } else {
      setGsat(selectedGsat);
      const foundGsat = gsatList.find((g) => g.gsat === selectedGsat);
      if (foundGsat) {
        setPidOptions(foundGsat.pids);
        setSelectedPid(foundGsat.pids[0]);
      } else {
        setPidOptions([]);
        setSelectedPid("");
      }
      setIsAddingGsat(false);
    }
  };

  const [pidList, setPidList] = useState([]);

  const findPid = (gsat) => {
    const foundGsat = gsatList.find((g) => g.gsat === gsat);
    console.log(foundGsat)
    if (foundGsat) {
      const pidString = foundGsat.pids.join(',');
      setPidList(pidString)
    } else {
      setPidList("");
    }
  }

  return (
    <div className="gsat-pid-section">
      <h3>Configure</h3>
      <div className="gsat-pid-conf">
        {!isAddingGsat ? (
          <>
            <div className="axis-config">
              <label htmlFor="gsat-select">GSAT</label>
              {!isGsatEditable ? (
                <div className="inputBlk">{gsat}</div>
              ) : (
                <select
                  id="gsat-select"
                  onChange={handleGsatChange}
                  value={gsat}
                >
                  <option value="">Select GSAT</option>
                  {gsatList?.map((option, index) => (
                    <option key={index} value={option.gsat}>
                      {option.gsat}
                    </option>
                  ))}
                  <option value="add-new">Add new GSAT</option>
                </select>
              )}
            </div>

            <div className="axis-config">
              <label htmlFor="pid-select">PID</label>
              {!isPidEditable ? (
                <div className="inputBlk">{pidList}</div>
              ) : (
                <select
                  id="pid-select"
                  value={selectedPid}
                  onChange={(e) => setSelectedPid(e.target.value)}
                >
                  {pidOptions.map((pid) => (
                    <option key={pid} value={pid}>
                      {pid}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!isGsatEditable && !isPidEditable ? (
              <button onClick={() => handleEdit("gsat")}>Edit GSAT/PID</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </>
        ) : (
          <div className="add-gsat-section">
            <label htmlFor="new-gsat">
              New GSAT
              <input
                id="new-gsat"
                placeholder="GSAT-90"
                value={newGsat}
                onChange={(e) => setNewGsat(e.target.value)}
              />
            </label>
            <label htmlFor="new-pids">
              PIDs (comma-separated)
              <input
                id="new-pids"
                placeholder="2100,2101,2501"
                value={newPids}
                onChange={(e) => setNewPids(e.target.value)}
              />
            </label>
            <button onClick={handleAddGsat}>Add</button>
          </div>
        )}
      </div>

      <div className="axis-config">
        <label htmlFor="roll-min">Roll:</label>
        {isRollEditable ? (
          <>
            <input
              id="roll-min"
              placeholder="Min Roll"
              value={rollMin}
              onChange={(e) => setRollMin(e.target.value)}
            />
            <input
              id="roll-max"
              placeholder="Max Roll"
              value={rollMax}
              onChange={(e) => setRollMax(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="inputBlk">Min : {rollMin} deg</div>
            <div className="inputBlk">Max : {rollMax} deg</div>
          </>
        )}
        <button onClick={() => handleEdit("roll")}>
          {isRollEditable ? "Submit" : "Edit"}
        </button>
      </div>

      <div className="axis-config">
        <label htmlFor="pitch-min">Pitch:</label>
        {isPitchEditable ? (
          <>
            <input
              id="pitch-min"
              placeholder="Min Pitch"
              value={pitchMin}
              onChange={(e) => setPitchMin(e.target.value)}
            />
            <input
              id="pitch-max"
              placeholder="Max Pitch"
              value={pitchMax}
              onChange={(e) => setPitchMax(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="inputBlk">Min : {pitchMin} deg</div>
            <div className="inputBlk">Max : {pitchMax} deg</div>
          </>
        )}
        <button onClick={() => handleEdit("pitch")}>
          {isPitchEditable ? "Submit" : "Edit"}
        </button>
      </div>

      <div className="axis-config">
        <label htmlFor="yaw-min">Yaw:</label>
        {isYawEditable ? (
          <>
            <input
              id="yaw-min"
              placeholder="Min Yaw"
              value={yawMin}
              onChange={(e) => setYawMin(e.target.value)}
            />
            <input
              id="yaw-max"
              placeholder="Max Yaw"
              value={yawMax}
              onChange={(e) => setYawMax(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="inputBlk">Min : {yawMin} deg</div>
            <div className="inputBlk">Max : {yawMax} deg</div>
          </>
        )}
        <button onClick={() => handleEdit("yaw")}>
          {isYawEditable ? "Submit" : "Edit"}
        </button>
      </div>

      <div className="axis-config">
        <label htmlFor="sampling-time">Sampling Time:</label>
        {isSamplingTimeEditable ? (
          <>
            <input
              id="sampling-time"
              placeholder="Min Sampling Time"
              value={samplingTimeMin}
              onChange={(e) => setSamplingTimeMin(e.target.value)}
            />
            <input
              id="sampling-time-max"
              placeholder="Max Sampling Time"
              value={samplingTimeMax}
              onChange={(e) => setSamplingTimeMax(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="inputBlk">Start Time : {samplingTimeMin} mins</div>
            <div className="inputBlk">End Time : {samplingTimeMax} mins</div>
          </>
        )}
        <button onClick={() => handleEdit("samplingTime")}>
          {isSamplingTimeEditable ? "Submit" : "Edit"}
        </button>
      </div>

      <div className="axis-config">
        <label htmlFor="period">Period:</label>
        {isPeriodEditable ? (
          <input
            id="period"
            placeholder="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        ) : (
          <div className="inputBlk">{period} hrs</div>
        )}
        <button onClick={() => handleEdit("period")}>
          {isPeriodEditable ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Configuration;
