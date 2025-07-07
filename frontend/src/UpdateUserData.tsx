import React, { useEffect, useState } from 'react';
import './UpdateUserData.css';
import theLogo from './assets/logo.png';
import { useNavigate } from 'react-router-dom';
import avatarIcon from './assets/avatar-icon.png';
import AIChat from './components/AIChat';

const UpdateUser = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCurrentUserIdAndData = async () => {
      try {
        const storedData = localStorage.getItem("user-data");
        if (!storedData) {
          setError("User is not logged in");
          return;
        }

        const parsedData = JSON.parse(storedData);
        const token = parsedData.accessToken;

        // Dohvati ID korisnika
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError("Failed to fetch user data");
          return;
        }

        const data = await res.json();
        console.log("User ID:", data.id);
        setUserId(data.id);

        // Dohvati detaljne podatke korisnika po ID-ju
        const userRes = await fetch(`http://localhost:3000/api/Users/${data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          setError("Failed to fetch detailed user data");
          return;
        }

        const user = await userRes.json();

        setName(user.name || '');
        setLastName(user.lastName || '');
        setUsername(user.username || '');
        setEmail(user.email || '');

      } catch (err) {
        setError("Error fetching user data");
        console.error(err);
      }
    };

    fetchCurrentUserIdAndData();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      console.error("No user ID available.");
      return;
    }

    try {
      const storedData = localStorage.getItem("user-data");
      if (!storedData) {
        alert("User not logged in.");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const token = parsedData.accessToken;

      const res = await fetch(`http://localhost:3000/api/users/bez/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          lastName,
          username,
          email
        })
      });

      if (!res.ok) {
        alert("Failed to update user data");
        return;
      }

      alert("User data updated!");

    } catch (err) {
      console.error("Error updating user data:", err);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <img src={theLogo} alt="Logo" className="logo" />
      <div className="back-button" onClick={() => navigate('/tasks')}>
        ← Go back to tasks
      </div>

      <div className="user-container">
        <h1 className="user-header">UPDATE USER DATA</h1>
        <img src={avatarIcon} alt="User avatar" className="avatar-icon" />

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <AIChat />
    </div>
  );
};

export default UpdateUser;
