import { useState, useEffect } from "react";
import axios from "axios";
import { allData, thresholdCrossings, stablePeriod } from "../Test"; // Adjust path as necessary

const useFormHandler = () => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [gsat, setGsat] = useState("");
  const [pid, setPid] = useState("");
  const [selectedData, setSelectedData] = useState(allData);

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("gsatConfig"));
    if (storedConfig) {
      setGsat(storedConfig.gsat || "");
      setPid(storedConfig.selectedPid || "");
    }
  }, []);

  const handleSubmit = async () => {
    const formattedStartTime = `${startDate}T${startTime}`;
    const formattedEndTime = `${endDate}T${endTime}`;

    try {
      await axios.post("YOUR_BACKEND_URL", {
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  const handleButtonClick = (data) => {
    setSelectedData(data);
  };

  return {
    startDate,
    startTime,
    endDate,
    endTime,
    gsat,
    pid,
    selectedData,
    handleSubmit,
    handleButtonClick,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
  };
};

export default useFormHandler;
