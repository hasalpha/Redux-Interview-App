/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import styles from "./Fetch.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectValues, fetch, del } from "../features/counter/counterSlice";
import { useState, useEffect } from "react";
export default function Fetch(props) {
  const values = useSelector(selectValues);
  const [details, setDetails] = useState(null);
  const [time, setTime] = useState(Array.from({ length: 50 }, (el) => 10));
  const [intervalId, setIntervalId] = useState(
    Array.from({ length: 50 }, (el) => 0)
  );
  const [timeoutId, setTimeoutId] = useState(
    Array.from({ length: 50 }, (el) => 0)
  );
  const [usersToDelete, setUsersToDelete] = useState([]);
  const dispatch = useDispatch();
  const handleClick = async (e) => {
    let res = await axios.get("https://randomuser.me/api/?results=50");
    dispatch(fetch(res.data.results));
  };
  const handleDetails = (e) => {
    let u = null;
    for (let i = 0; i < values.length; i++) {
      if (values[i]["email"] === e.target.id) {
        u = { ...values[i] };
        break;
      }
    }
    setDetails((details) => u);
  };
  const handleDelete = (e) => {
    dispatch(del());
  };
  const index = details?.index;
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
              <div key={el["login"]["uuid"]} className={styles.nameRow}>
                <p
                  id={el["email"]}
                  className={`${styles.names} ${
                    details?.email === el["email"] ? styles.activeName : ""
                  }`}
                  onClick={handleDetails}
                >
                  {el["name"]["last"]}{" "}
                  <span className={styles.timer}>
                    {usersToDelete.includes(el.email) && time[el?.index]}
                  </span>
                </p>
              </div>
            ))}
          </div>
          {details && (
            <div className={styles.details}>
              <img
                alt="profile"
                className={styles.profile}
                src={details?.picture.large}
              />
              <pre>
                {details?.name.title}.{details?.name.first} {details?.name.last}
              </pre>
              <pre>{details?.email}</pre>
              <pre>{details?.phone}</pre>
              <pre>{details?.cell}</pre>
              {usersToDelete.includes(details?.email) === false ? (
                <button
                  onClick={() => {
                    setUsersToDelete((val) => [...val, details?.email]);
                    const id = setInterval(() => {
                      if (time[details.index] < 0) {
                        clearInterval(id);
                      }
                      setTime((val) => {
                        const newVal = [...val];
                        newVal[details.index] -= 1;
                        return newVal;
                      });
                    }, 1000);
                    setIntervalId((val) => {
                      const newVal = [...val];
                      newVal[details?.index] = id;
                      return newVal;
                    });
                    const tid = setTimeout(() => {
                      clearInterval(id);
                      setDetails((val) =>
                        val.email === details?.email ? null : val
                      );
                      dispatch(del(details?.email));
                      setUsersToDelete((val) =>
                        val.filter((el) => el !== details?.email)
                      );
                    }, 10000);
                    setTimeoutId((val) => {
                      const newVal = [...val];
                      newVal[details?.index] = tid;
                      return newVal;
                    });
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
                    clearInterval(intervalId[details?.index]);
                    clearTimeout(timeoutId[details?.index]);
                    setTime((val) => {
                      const newVal = [...val];
                      newVal[details.index] = 10;
                      return newVal;
                    });
                  }}
                >
                  Cancel {time[details?.index]}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
