import React from "react";
import { useState, useEffect } from "react";

const UserCard = (props) => {
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");

  // to fetch languages
  const fetchLanguages = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/languages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: props.id }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setLanguages(data);
      } else {
        setLanguages([]);
      }
    } catch (err) {
      console.error("Failed to fetch languages", err);
      setLanguages([]);
    }
  };
  useEffect(() => {
    fetchLanguages();
  }, [props.id]);

  // Add a new language
  const handleAddLanguage = async () => {
    const trimmedLang = languageInput.trim();
    if (!trimmedLang) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/languages`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: props.id,
            language: trimmedLang,
          }),
        }
      );
      if (res.ok) {
        setLanguageInput("");
        // refresh languages after adding
        const updatedRes = await fetch(
          `${import.meta.env.VITE_SERVER}/lab/users/languages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: props.id }),
          }
        );
        const updatedLanguages = await updatedRes.json();
        setLanguages(updatedLanguages);
      }
    } catch (err) {
      console.error("Failed to add language", err);
    }
  };

  //delete language

  const handleDeleteLanguage = async (lang) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/languages`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: props.id,
            language: lang,
          }),
        }
      );
      if (res.ok) {
        // Refresh languages after delete
        setLanguages(languages.filter((l) => l.language !== lang));
      }
    } catch (err) {
      console.error("Failed to delete language", err);
    }
  };

  return (
    <div className="user-card">
      <div>Name: {props.name}</div>
      <div>Age: {props.age ?? "N/A"}</div>
      <div>
        <b>Languages known:</b>
        {languages.length === 0 ? (
          <div>None</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Language</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang) => (
                <tr key={lang.language}>
                  <td>{lang.language}</td>
                  <td>
                    <button onClick={() => handleDeleteLanguage(lang.language)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <input
        type="text"
        placeholder="Add language"
        value={languageInput}
        onChange={(e) => setLanguageInput(e.target.value)}
      />
      <button onClick={handleAddLanguage}>Add</button>
      <button onClick={() => props.onDelete(props.id)}>Delete User</button>
      <button onClick={() => props.onEdit(props.id)}>Update</button>
    </div>
  );
};

export default UserCard;
