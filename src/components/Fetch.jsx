/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import styles from "./Fetch.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectValues, fetch, del } from "../features/counter/counterSlice";
import { useState, useEffect } from "react";
export default function Fetch(props) {
  const [details, setDetails] = useState();
  const [cancel, setCancel] = useState(false);
  const [time, setTime] = useState(10);
  const [intervalId, setIntervalId] = useState(0);
  const [timeoutId, setTimeoutId] = useState(0);
  const [usersToDelete, setUsersToDelete] = useState([]);
  const values = useSelector(selectValues);
  const dispatch = useDispatch();
  useEffect(() => {
    clearInterval(intervalId);
  }, [details]);
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
                {el["name"]["last"]}
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
              {cancel === false ? (
                <button
                  onClick={() => {
                    setCancel((val) => true);
                    const id = setInterval(() => {
                      if (time < 0) {
                        clearInterval(id);
                      }
                      setTime((val) => val - 1);
                    }, 1000);
                    setIntervalId((val) => id);
                    const tid = setTimeout(() => {
                      clearInterval(intervalId);
                      setCancel((val) => false);
                      setTime((val) => 10);
                      setDetails((val) => null);
                      dispatch(del(details?.email));
                    }, 10500);
                    setTimeoutId((val) => tid);
                  }}
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    setCancel((val) => false);
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
