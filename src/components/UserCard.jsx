import React, { useEffect, useState } from "react";

const UserCard = (props) => {
  const [globalLanguages, setGlobalLanguages] = useState([]); // from /lab/languages
  const [userLanguages, setUserLanguages] = useState([]);     // from /lab/users/languages
  const [isLoading, setIsLoading] = useState(true);

  // fetch global language pool
  const fetchGlobalLanguages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/lab/languages`);
      if (res.ok) {
        const data = await res.json();
        setGlobalLanguages(data.map((l) => l.language)); // extract string only
      }
    } catch (err) {
      console.error("Failed to fetch global languages:", err);
    }
  };

  // fetch languages for specific user
  const fetchUserLanguages = async () => {
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
        setUserLanguages(data);
      }
    } catch (err) {
      console.error("Failed to fetch user languages:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await fetchGlobalLanguages();
      await fetchUserLanguages();
      setIsLoading(false);
    };
    loadAll();
  }, [props.id]);

  // add language for the user
  const handleAddLanguage = async (language) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/languages`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: props.id,
            language: language,
          }),
        }
      );
      if (res.ok) {
        await fetchUserLanguages(); // refresh list
      }
    } catch (err) {
      console.error("Failed to add language:", err);
    }
  };

  // delete language for user
  const handleDeleteLanguage = async (language) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/lab/users/languages`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: props.id,
            language: language,
          }),
        }
      );
      if (res.ok) {
        await fetchUserLanguages(); // refresh list
      }
    } catch (err) {
      console.error("Failed to delete language:", err);
    }
  };

  return (
    <div className="user-card">
      <div><b>Name:</b> {props.name}</div>
      <div><b>Age:</b> {props.age ?? "N/A"}</div>

      <div>
        <b>Languages known:</b>
        <span style={{ marginLeft: "2px"}}>{userLanguages.length > 0 ? userLanguages.join(", ") : "None"}</span>
        {/* to display as text for easier view */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {globalLanguages.map((lang) => {
              const knowsLang = userLanguages.includes(lang);
              return (
                <li key={lang}>
                  {lang}
                  {knowsLang ? (
                    <button onClick={() => handleDeleteLanguage(lang)}>
                      Remove
                    </button>
                  ) : (
                    <button onClick={() => handleAddLanguage(lang)}>
                      Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          
        )}
       
      </div>

      <button onClick={() => props.onDelete(props.id)}>Delete User</button>
      <button onClick={() => props.onEdit(props.id)}>Update</button>
       <hr/>
    </div>
  );
};

export default UserCard;
