import React from "react";
import { useState, useEffect, useRef } from "react";
import UserCard from "./UserCard";
import UserUpdateModal from "./UserUpdateModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const userNameRef = useRef();

  //fetch users on mount
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

  //adding new users (PUT)
  const addUser = async () => {
    const trimmedName = userNameRef.current.value.trim(); // removes space
    const isDuplicate = users.some(
      //validate user no duplicate
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
          name: trimmedName,
        }),
      });
      if (res.ok) {
        setErrorMessage("Username successfully added!");
        userNameRef.current.value = ""; //clear fill
        getUsers(); // refresh
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //delete users (DELETE)
  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/lab/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        setErrorMessage("User deleted successfully!");
        getUsers(); // refresh the user list
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Error deleting user.");
    }
  };

  //edit button
  const handleEditClick = (userId) => {
    const user = users.find((u) => u.id === userId);
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
          ref={userNameRef}
        ></input>
        <button className="col-md-4" onClick={addUser}>
          Submit
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          name={user.name}
          age={user.age}
          languages={user.languages}
          getUsers={getUsers}
          onDelete={deleteUser}
          onEdit={handleEditClick}
        ></UserCard>
      ))}

      {showUpdateModal && userToUpdate && (
        <UserUpdateModal
          id={userToUpdate.id}
          name={userToUpdate.name}
          age={userToUpdate.age}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={getUsers}
        />
      )}
    </div>
  );
};

export default Users;
