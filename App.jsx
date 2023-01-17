import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./style.module.css"

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editing) {
      axios
        .post("http://localhost:3000/users", { name, designation, salary })
        .then((res) => {
          setUsers([...users, res.data]);
          setName("");
          setDesignation("");
          setSalary("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(`http://localhost:3000/users/${id}`, { name, designation, salary })
        .then((res) => {
          const updatedUsers = users.map((user) => {
            if (user.id === id) {
              return res.data;
            }
            return user;
          });
          setUsers(updatedUsers);
          setEditing(false);
          setName("");
          setDesignation("");
          setSalary("");
          setId("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (user) => {
    setEditing(true);
    setName(user.name);
    setDesignation(user.designation);
    setSalary(user.salary);
    setId(user.id);
  };

  const handleReset = () => {
    setName("");
    setDesignation("");
    setSalary("");
    setEditing(false);
    setId("");
  };
  
  return (
    <div>
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> <br></br>
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        /><br></br>
        <input
          type="text"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        /><br></br>
        <button type="submit">{editing ? "Update" : "Save"}</button>
        <button type="reset" onClick={handleReset}>Reset</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.designation}
              </td>
              <td>{user.salary}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

