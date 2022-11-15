import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import List from "../src/Components/List";
import Alerts from "../src/Components/Alerts";

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if(list) {
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
	const [name, setName] = useState("");
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			// display alert
			showAlert(true, "danger", "Please Enter Value");
		} else if (name && isEditing) {
			// deal with edit
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				})
			);
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'value changed!')
		} else {
			// show alert
			const newItem = { id: new Date().getTime().toString(), title: name };
			setList([...list, newItem]);
			showAlert(true, "success", "input added to list");
			setName("");
		}
	};

	const showAlert = (show = false, type = "", msg = "") => {
		setAlert({ show, type, msg });
	};

	const clearList = () => {
		showAlert(true, "danger", "empty list");
		setList([]);
	};

	const removeItem = (id) => {
		showAlert(true, "danger", "item removed from list");
		setList(list.filter((item) => item.id !== id));
	};

	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setName(specificItem.title);
	};

	const FocusOnEdit = useRef(null)

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

	useEffect(() => {
		FocusOnEdit.current.focus()
	}, [isEditing])

	return (
		<section className="section-center">
			<form className="grocery-form" onSubmit={handleSubmit}>
				{alert.show && (
					<Alerts {...alert} removeAlert={showAlert} list={list} />
				)}
				<h3>Books Read</h3>
				<div className="form-control">
					<input
						ref={FocusOnEdit}
						type="text"
						className="grocery"
						placeholder="e.g. Icarius Agenda"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button type="submit" className="submit-btn">
						{isEditing ? "Edit" : "Submit"}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<List items={list} removeItem={removeItem} editItem={editItem} />
					<button className="clear-btn" onClick={clearList}>
						Clear Items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
