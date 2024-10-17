import { useEffect, useState } from "react";
import { RevolvingDot } from 'react-loader-spinner'

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "https://todolist-backend-c19c.onrender.com";

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      }).then((res) => {
        if (res.ok) {
          getItems();
          setMessage("Item Added Successfully");
          setTitle("");
          setDescription("");
          setError("");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setMessage("");
          setError("Unable to create Todo Item");
        }
      });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    setLoader(true);
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
        setLoader(false);
      });
  };
  const handleEdit = (item)=>{    
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }
  const handleEditCancel = ()=>{
    setEditId(-1);
  }
  const handleUpdate = (updateId)=>{
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/"+updateId, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title:editTitle, description:editDescription }),
      }).then((res) => {
        if (res.ok) {
          setEditId(-1);
          getItems();
          setMessage("Item Updated Successfully");
          setEditTitle("");
          setEditDescription("");
          setError("");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setMessage("");
          setError("Unable to Updated Todo Item");
        }
      });
    }
  }

  const handleDelete = (deleteId) => {
    if(window.confirm("Are you sure want to delete?")){
      fetch(apiUrl+"/todos/"+deleteId, {
        method:"DELETE"
      }).then(()=>{
        const updatedTodos = todos.filter((item)=> item._id !== deleteId);
        setTodos(updatedTodos);
      })
    }
  };
  return (
    <>
      <div className="row p-3 bg-success text-light text-center">
        <h1>Todo List (MERN)</h1>
      </div>
      <div className="container">
        <div className="row">
          <h3>Add Item</h3>
          {message && <p className="text-success">{message}</p>}
          <div className="form-group d-flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Description"
            />
            <button className="btn btn-dark" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>

        <div className="row mt-3">
          <h3>Tasks</h3>
          <ul className="list-group">
            {loader ? 
            
            <RevolvingDot
              visible={true}
              height="80"
              width="80"
              color="#198754"
              ariaLabel="revolving-dot-loading"
              wrapperStyle={{}}
              wrapperClass="d-flex justify-content-around"
              />
            :
            todos.map((data) => {
              return (
                <li key={data._id} className="list-group-item bg-info text-white d-flex justify-content-between align-items-center my-2">
                  <div className="d-flex gap-2 mx-2">
                    {editId !== -1 && editId === data._id ? (
                      <>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="form-control"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="form-control"
                          placeholder="Description"
                        />
                      </>
                    ) : (
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{data.title}</span>
                        <span className="fw-bold">{data.description}</span>
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    {editId === -1 || editId !== data._id ? (
                      <button
                        onClick={() => handleEdit(data)}
                        className="btn btn-warning"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdate(data._id)}
                        className="btn btn-success"
                      >
                        Update
                      </button>
                    )}
                    {editId === -1 || editId !== data._id ? (
                    <button
                      onClick={() => handleDelete(data._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>) :
                    (
                      <button
                      onClick={() => handleEditCancel()}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
