import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import axios from "axios";
import Configuration from "../components/Admin/Configuration";
import "../styles/Admin.css"

const AdminPage = () => {
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
  const [samplingTimeMin, setSamplingTimeMin] = useState(""); // Correctly defined
  const [samplingTimeMax, setSamplingTimeMax] = useState(""); // Correctly defined
  const [period, setPeriod] = useState(""); // Correctly defined
  const [gsatList, setGsatList] = useState([]);

  const [isEditableOpt, setIsEditableOpt] = useState({
    status: false,
    isEditable: false,
    data: {},
  });

  let gsatOptions = [
    { gsat: "GSAT-9", pids: [2044, 2045, 2046] },
    { gsat: "GSAT-10", pids: [2054, 2057, 2058] },
  ];

  const fetchGsatAndPid = async () => {
    try {
      const response = await axios.get("http://localhost:4000/gsat/satellite");
      const gsatOptionsnew = response.data.data;
      console.log(response);
      console.log(response.data.data);
      setGsatList(gsatOptionsnew);
    } catch (error) {
      console.error("Error fetching GSAT and PID data:", error);
    }
  };

  const getData = async () => {
    const responses = await axios.get("http://localhost:4000/threshold");
    const data = responses.data.data[0];
    console.log(responses.data.data);
    setIsEditableOpt((prev) => ({
      ...prev,
      data: {
        yaw: data.yaw,
        roll: data.roll,
        pitch: data.pitch,
        samplingTime: data.samplingTime,
        period: data.period,
        gsat: data.gsat,
        selectedPid: data.selectedPid,
      },
    }));
  };

  useEffect(() => {
    fetchGsatAndPid();
    const data = JSON.parse(localStorage.getItem("gsatConfig"));

    getData();
    console.log(data);

    setIsEditableOpt((prev) => ({
      ...prev,
      data: data,
    }));
  }, []);

  // State for axis configuration values
  const [rollMin, setRollMin] = useState("");
  const [rollMax, setRollMax] = useState("");
  const [pitchMin, setPitchMin] = useState("");
  const [pitchMax, setPitchMax] = useState("");
  const [yawMin, setYawMin] = useState("");
  const [yawMax, setYawMax] = useState("");
  const [selectedPid, setSelectedPid] = useState("");

  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [deleteGsat, setDeleteGsat] = useState("");

  const handleAddUser = async () => {
    try {
      let response = null;
      if (isEditing) {
        response = await axios.post(`http://localhost:4000/updateUser`, {
          name,
          email: emailId,
          level,
        });
      } else {
        // Add new user
        response = await axios.post(
          "http://localhost:4000/addPeople",
          {
            name,
            email: emailId,
            level,
          },
          {
            withCredentials: true,
          }
        );
      }
      // Update local state after API call
      // const updatedUsers = [...users];
      // if (isEditing) {
      //   updatedUsers[editUserIndex] = { name, emailId, level };
      // } else {
      //   updatedUsers.push({ name, emailId, level });
      // }

      if (response) {
        fetchData();
      }
      // setUsers(updatedUsers);
      setName("");
      setEmailId("");
      setLevel(1);
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding/updating user:", error);
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

  const handleEditUser = (index) => {
    const user = users[index];
    setName(user.name);
    setEmailId(user.email);
    setLevel(user.level);
    setIsEditing(true);
    setEditUserIndex(index);
  };

  const handleDeleteUser = async (email) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete user ${email}?`
      );
      if (confirmDelete) {
        await axios.post(
          `http://localhost:4000/deletePeople`,
          { email },
          {
            withCredentials: true,
          }
        );
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Add new GSAT and PIDs

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
        setGsatList([...gsatList, newGsatOption]); // Update gsatList with new GSAT
        setIsAddingGsat(false);
        fetchGsatAndPid();
        setNewGsat("");
        setNewPids("");
      } catch (error) {
        console.error("Error adding GSAT:", error);
      }
    }
  };

  // Function to handle deleting the typed GSAT
  const handleDeleteGsat = async () => {
    try {
      setGsatList(gsatList.filter((g) => g.gsat !== deleteGsat));
      // setDeleteGsat(""); // Clear input after deletion
      setShowDeleteSection(false); // Hide delete section
      const response = await axios.delete(
        `http://localhost:4000/gsat/satellite/${deleteGsat}`
      );
      console.log(response);
      console.log("GSAT deleted successfully");
      setGsatList(gsatList.filter((g) => g.gsat !== deleteGsat));
      setDeleteGsat("");
      setShowDeleteSection(false);
    } catch (error) {
      console.error("Error deleting GSAT:", error);
    }
  };

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:4000/users");
      // console.log(response.data.data);
      setUsers(response.data?.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Handle submit for configuration settings
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

      const response = await axios.post(
        "http://localhost:4000/threshold",
        config
      );
      console.log("Configuration submitted successfully");
      // Reset the form values without hiding the configuration section
      setGsat("");
      setSelectedPid(""); // Reset selected PID
      setPidOptions([]);
      setRollMin("");
      setRollMax("");
      setPitchMin("");
      setPitchMax("");
      setYawMin("");
      setYawMax("");
      setIsEditableOpt((prev) => ({
        ...prev,
        isEditable: false,
      }));
    } catch (error) {
      console.error("Error submitting configuration:", error);
    }
  };

  const handleEdit = () => {
    setIsEditableOpt((prev) => ({
      ...prev,
      isEditable: true,
    }));
  };

  return (
    <div className="admin-container">
      <IoMdSettings
        className="settings-icon"
        onClick={() => setShowConfig(!showConfig)}
      />

      {showConfig ? (
        <Configuration />
      ) : (
        <>
          <div className="form-section">
            <h3>{isEditing ? "Edit User" : "Add User"}</h3>
            <div className="add-user-form">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="email"
                placeholder="Email-ID"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              <select
                value={level}
                className="level"
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
              </select>
              <button
                onClick={handleAddUser}
                disabled={!name || !emailId || !level}
              >
                Add
              </button>
            </div>
          </div>

          <div className="user-list">
            <h3>Users</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th colSpan={2}>Email-ID</th>
                    <th colSpan={0.5}>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td colSpan={2}>{user.email}</td>
                      <td colSpan={0.5}>{user.level}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditUser(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.email)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isEditing && (
            <div className="modal-overlay">
              <div className="edit-card">
                <h3>Edit User</h3>
                <div className="add-user-form">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    className="email"
                    placeholder="Email-ID"
                    value={emailId}
                    isEditing={false}
                  />
                  <select
                    value={level}
                    className="level"
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                  </select>
                  <button onClick={handleAddUser}>Save</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
