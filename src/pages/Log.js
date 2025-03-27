import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Log.css"
import { useNavigate } from 'react-router-dom';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.userId;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/logs/${userId}`);
        setLogs(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchLogs();
    }
  }, [userId]);

  if (!userId) return <p>Please log in first.</p>;
  if (loading) return <p>Loading logs...</p>;

  function handleBack(){
    navigate('/')
  }

  return (
    <div className="logs-container">
        <button className='backtohome' onClick={handleBack}>Back to Home</button>
      <h2>My Mood Logs</h2>
      {logs.length === 0 ? (
        <p className="empty-message">No logs found.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log._id} className="log-item">
              <p><strong>Mood:</strong> {log.mood}</p>
              <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Logs;
