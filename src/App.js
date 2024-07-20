import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import Chat from './Chat';
import './Chat.css';

const App = () => {
  const [auth, setAuth] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (auth) {
      fetchUsers();
    }
  }, [auth]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:1337/users', {
        headers: {
          Authorization: `Bearer ${auth.jwt}`, 
        },
      });
      const filteredUsers = response.data.filter(user => user.id !== auth.user.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  return (
    <div>
      {auth ? (
        <div className="chat-app">
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} onClick={() => setSelectedUser(user)} className="user-item">
                {user.username}
              </div>
            ))}
          </div>
          {selectedUser && <Chat auth={auth} selectedUser={selectedUser} />}
        </div>
      ) : (
        <div className="auth-container">
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Sign Up</button>
          {isLogin ? <Login setAuth={setAuth} /> : <Signup setAuth={setAuth} />}
        </div>
      )}
    </div>
  );
};

export default App;
