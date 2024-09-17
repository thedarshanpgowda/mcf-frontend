// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useFormHandler = () => {
//   const [startDate, setStartDate] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [gsat, setGsat] = useState('');
//   const [pid, setPid] = useState('');
//   const [selectedData, setSelectedData] = useState(allData);

//   useEffect(() => {
//     const storedConfig = JSON.parse(localStorage.getItem('gsatConfig'));
//     if (storedConfig) {
//       setGsat(storedConfig.gsat || '');
//       setPid(storedConfig.selectedPid || '');
//     }
//   }, []);

//   const handleSubmit = () => {
//     const formattedStartTime = `${startDate}T${startTime}`;
//     const formattedEndTime = `${endDate}T${endTime}`;

//     // Send data to the backend
//     axios.post('YOUR_BACKEND_URL', {
//       startTime: formattedStartTime,
//       endTime: formattedEndTime,
//     })
//     .then(response => {
//       console.log('Data submitted successfully', response.data);
//     })
//     .catch(error => {
//       console.error('Error submitting data', error);
//     });
//   };

//   const handleButtonClick = (data) => {
//     setSelectedData(data);
//   };

//   const handleStartDateChange = (e) => setStartDate(e.target.value);
//   const handleStartTimeChange = (e) => setStartTime(e.target.value);
//   const handleEndDateChange = (e) => setEndDate(e.target.value);
//   const handleEndTimeChange = (e) => setEndTime(e.target.value);

//   return {
//     startDate,
//     startTime,
//     endDate,
//     endTime,
//     gsat,
//     pid,
//     selectedData,
//     handleSubmit,
//     handleButtonClick,
//     handleStartDateChange,
//     handleStartTimeChange,
//     handleEndDateChange,
//     handleEndTimeChange
//   };
// };

// export default useFormHandler;
