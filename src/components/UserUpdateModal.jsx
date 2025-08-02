import React, { useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const OverLay = ({ id, name, age, onClose, onUpdate }) => {
  const nameRef = useRef();
  const ageRef = useRef();

  const handleUpdate = async () => {
    const newName = nameRef.current.value.trim();
    const newAge = ageRef.current.value.trim();

    if (!newName || isNaN(Number(newAge))) return; //name cannot empty, age cannot NaN

    const res = await fetch(`${import.meta.env.VITE_SERVER}/lab/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
        name: newName,
        age: Number(newAge),
      }),
    });

    if (res.ok) {
      onUpdate(); // Refresh data
      onClose();  // Close modal
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className="row">
          <label htmlFor="username">Username:</label>
          <input id="username" ref={nameRef} type="text" defaultValue={name} />
        </div>
        <div className="row">
          <label htmlFor="age">Age:</label>
          <input id="age" ref={ageRef} type="text" defaultValue={age ?? ""} />
        </div>
        <div className="row">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const UserUpdateModal = (props) => {
  return ReactDOM.createPortal(
    <OverLay
      id={props.id}
      name={props.name}
      age={props.age}
      onClose={props.onClose}
      onUpdate={props.onUpdate}
    />,
    document.querySelector("#modal-root")
  );
};

export default UserUpdateModal;
