import React from "react";
import { useState, useEffect } from "react";
import UserUpdateModal from "./UserUpdateModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLanguage, setUsersLanguage] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);

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
        setErrorMessage("Username successfully added! Please refresh page!");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateUser = async (updatedName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/${userToUpdate.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedName }),
        }
      );
      if (res.ok) {
        setErrorMessage("User updated successfully!");
        setShowUpdateModal(false);
        getUsers(); // Refresh list after update
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setErrorMessage("User deleted successfully!");
        getUsers(); // Refresh list
        setSelectedUser(null); // Clear selected user if deleted
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete user.");
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

  const openUserUpdateModal = (user) => {
    setUserToUpdate(user);
    setShowUpdateModal(true);
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
          <div className="user-row">
            <button onClick={() => openUserUpdateModal(selectedUser)}>
              Edit
            </button>
            <button onClick={() => deleteUser(selectedUser.id)}>Delete</button>
          </div>

          {showUpdateModal && userToUpdate && (
            <UserUpdateModal
              id={userToUpdate.id}
              name={userToUpdate.name}
              onClose={() => setShowUpdateModal(false)}
              onUpdate={updateUser}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
