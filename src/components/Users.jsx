import React, { use } from "react";
import { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLanguage, setUsersLanguage] = useState([]);
  const [newUsersLanguage, setNewUsersLanguage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const addUser = async () => {
    const trimmedName = newUserName.trim();
    const isDuplicate = users.some(
      (user) => user.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setIsError(true);
      setErrorMessage("Username already exists.");
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName,
        }),
      });
      if (res.ok) {
        setIsError(false);
        setErrorMessage("Username successfully added! Please refresh page!");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateUser = async (updatedName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedName }),
        }
      );
      if (res.ok) {
        setErrorMessage("User updated successfully!");
        setIsError(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/${selectedUser.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setErrorMessage("User deleted successfully!");
        setIsError(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER +
          "/lab/users/" +
          `${user.id}` +
          "/languages"
        }`
      );
      if (res.ok) {
        const data = await res.json();
        setUsersLanguage(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const addLangToUser = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER +
          "/lab/users/" +
          `${selectedUser.id}` +
          "/languages"
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: newUsersLanguage }),
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="user-container">
      <h2>All Users</h2>
      <div className="row">
        <input
          type="text"
          className="col-md-8"
          placeholder="Add new username"
          value={newUserName}
          onChange={(event) => setNewUserName(event.target.value)}
        ></input>
        <button className="col-md-4" onClick={addUser}>
          Submit
        </button>
      </div>
      <div className="row">{errorMessage}</div>
      {users.map((user) => (
        <button
          key={user.id}
          className="user-btn"
          onClick={() => setSelectedUser(user)}
        >
          {user.name}
        </button>
      ))}
      {selectedUser && (
        <div className="user-details">
          <h3>{selectedUser.name}'s Languages</h3>
          <ul>
            {usersLanguage.map((lang) => (
              <li key={lang.language}>{lang.language}</li>
            ))}
          </ul>
          <button onClick={updateUser}>Update User</button>
          <button onClick={deleteUser}>Delete User</button>
        </div>
      )}
    </div>
  );
};

export default Users;
