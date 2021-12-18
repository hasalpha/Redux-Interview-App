/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import styles from "./Fetch.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectValues, fetch, del } from "../features/counter/counterSlice";
import { useState, useEffect } from "react";
export default function Fetch(props) {
  const [details, setDetails] = useState(null);
  const [time, setTime] = useState(10);
  const [intervalId, setIntervalId] = useState(0);
  const [timeoutId, setTimeoutId] = useState(0);
  const [usersToDelete, setUsersToDelete] = useState([]);
  const values = useSelector(selectValues);
  const dispatch = useDispatch();
  const handleClick = async (e) => {
    let res = await axios.get("https://randomuser.me/api/?results=50");
    dispatch(fetch(res.data.results));
  };
  const handleDetails = (e) => {
    const [user] = values.filter((el) => el.email === e.target.id);
    setDetails((details) => user);
  };
  const handleDelete = (e) => {
    dispatch(del());
  };
  return (
    <>
      <div className={styles.navbar}>
        <h2>Count: {values.length}</h2>
        <button className={styles.button} onClick={handleClick}>
          Fetch
        </button>
      </div>
      {values.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.nameList}>
            {values.map((el, i) => (
              <p
                id={el["email"]}
                key={el["login"]["uuid"]}
                className={`${styles.names} ${
                  details?.email === el["email"] ? styles.activeName : ""
                }`}
                onClick={handleDetails}
              >
                {el["name"]["last"]}{" "}
                <span className={styles.timer}>
                  {usersToDelete.includes(el.email) && time}
                </span>
              </p>
            ))}
          </div>
          {details && (
            <div className={styles.details}>
              <img
                alt="profile"
                className={styles.profile}
                src={details?.picture.large}
              />
              <pre>{details?.email}</pre>
              {usersToDelete.includes(details?.email) === false ? (
                <button
                  onClick={() => {
                    setUsersToDelete((val) => [...val, details?.email]);
                    const id = setInterval(() => {
                      if (time < 0) {
                        clearInterval(id);
                      }
                      setTime((val) => val - 1);
                    }, 1000);
                    setIntervalId((val) => id);
                    const tid = setTimeout(() => {
                      clearInterval(id);
                      setTime((val) => 10);
                      setDetails((val) =>
                        val.email === details?.email ? null : val
                      );
                      dispatch(del(details?.email));
                      setUsersToDelete((val) =>
                        val.filter((el) => el !== details?.email)
                      );
                    }, 10000);
                    setTimeoutId((val) => tid);
                  }}
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUsersToDelete((val) =>
                      val.filter((el) => el !== details?.email)
                    );
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    setTime((val) => 10);
                  }}
                >
                  Cancel {time}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
