import React from "react";
import { useState, useEffect, useRef } from "react";

const Display = () => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");

  const getData = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/lab/languages");
      if (res.ok) {
        const data = await res.json();
        setLanguages(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteLanguage = async (languageName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/languages/${languageName}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setLanguages((prev) =>
          prev.filter((lang) => lang.language !== languageName)
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const addLanguage = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/lab/languages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: newLanguage }),
      });
      if (res.ok) {
        const added = await res.json();
        setNewLanguage(""); //clear input
        setLanguages((prevState) => [...prevState, added]);
        getData();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="list-container">
      <h1>Language List</h1>
      {/* {JSON.stringify(languages)} */}
      <div className="addNew">
        <input
          placeholder="Enter new language"
          value={newLanguage}
          onChange={(event) => setNewLanguage(event.target.value)}
        ></input>
        <button className="addLanguage" onClick={addLanguage}>
          Add
        </button>
      </div>
      <div className="list">
        {languages.map((item, idx) => {
          return (
            <div key={idx} className="language-items">
              {item.language}
              <button onClick={() => deleteLanguage(item.language)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Display;
