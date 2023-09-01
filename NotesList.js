

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Note from "./Note";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

function NotesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail || "DefaultUser";
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchNotes(userEmail);
    fetchUsers();
  }, [userEmail]);

  const fetchNotes = async (userEmail) => {
    try {
      let response = await axios.get(
        `https://64e998f4bf99bdcc8e66d163.mockapi.io/notes?email=${userEmail}`
      );
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      let response = await axios.get(
        "https://64e998f4bf99bdcc8e66d163.mockapi.io/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `https://64e998f4bf99bdcc8e66d163.mockapi.io/notes/${id}`
      );
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUserNote = () => {
    navigate(`/texteditor/${userEmail}`, {
      state: {
        userEmail: userEmail,
        isNewNote: true,
      },
    });
  };

  const editNote = (note) => {
    navigate("/texteditor", {
      state: {
        note,
      },
    });
  };

  const handleUserClick = (selectedUser) => {
    setSelectedUser(selectedUser);
    handleShow();
  };

  return (
    <>
      <div>
        <h3>Hi </h3>
        <div className="logout">
          <a href="./signin">Logout</a>
        </div>
        <div className="notes-list">
          {notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              text={note.text}
              date={note.date}
              handleDeleteNote={deleteNote}
              handleEditNote={() => editNote(note)}
            />
          ))}
          <Button onClick={handleAddUserNote}>Add User Note</Button>
        </div>
      </div>

      <div className="logout">
        {users.map((user) => (
          <Button
            key={user.id}
            variant="outline-primary"
            onClick={() => handleUserClick(user)}
            className="logout-"
          >
            Profile
          </Button>
        ))}
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>User Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>Username: {selectedUser.username}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Password: {selectedUser.password}</p>
              <p>Mobile: {selectedUser.mobile}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NotesList;
