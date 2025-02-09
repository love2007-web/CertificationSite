import {
  CircularProgress,
  Container,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GetAppIcon from "@mui/icons-material/GetApp";
import Axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ActionButton from "../../components/ActionButton/ActionButton";
import DashNavbar from "../../components/DashNavbar/DashNavbar";
import Loading from "../Loading/Loading";
import "./EventPage.css";
import Dropzone from "react-dropzone";
import ImageSelect from "../../components/ImageSelect/ImageSelect";
import { templates } from "../../templates/templates";
import { useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";

function EventPage() {
  const toast = useRef(null);
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(true);
  const [details, setDetails] = useState(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(0);

  const [submitLoading, setSubmitLoading] = useState(false);

  const backend = "https://certification-project-backend-ayzx.onrender.com";

  const onCloseHandle = () => {
    setOpen(false);
  };

  const handleFileDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    let data = new FormData();
    data.append("file", file);
    data.append("templateNumber", selected);
    data.append("event_id", id);

    let url = `${backend}/event/certificates`;
    let token = localStorage.getItem("authToken");

    try {
      const response = await Axios.post(url, data, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data.message || "Operation successful",
      });
      await getDetails();
      setSubmitLoading(false);
      setFile(null);
      onCloseHandle();
    } catch (error) {
      console.error(
        "Error during submission:",
        error.response ? error.response.data : error.message
      );
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response
          ? typeof error.response.data === "object"
            ? JSON.stringify(error.response.data)
            : error.response.data.message || "Operation failed"
          : error.message,
      });
      setSubmitLoading(false); // Ensure to reset loading state in case of error
    }
  };

  // Memoize getDetails using useCallback
  const getDetails = useCallback(async () => {
    let url = `${backend}/event/${id}`;

    try {
      const res = await Axios.get(url);
      console.log(res.data);
      setDetails(res.data.event);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [backend, id]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  if (loading) return <Loading />;

  return (
    <div className="event-details-page">
      <DashNavbar back={true} />
      <Container>
        <h1 className="section-heading">
          <span style={{ borderBottom: "3px white solid" }}>Event Details</span>
        </h1>
        <div className="event-details-section">
          <div className="event-page-header">
            <div className="event-details-header">
              <h1 className="quiz-name-detail">{details.name}</h1>
              <h3 className="quiz-date-detail">
                {new Date(details.date).toLocaleDateString()}
              </h3>
            </div>
            <div className="event-certs-header">
              CERTIFICATES GENERATED <br />
              <span className="certs-generated">
                {details.participants.length}
              </span>
            </div>
          </div>
          <Divider light className="divider-1" />
          <div className="event-participants">
            <h1 className="section-heading">
              <span style={{ borderBottom: "3px white solid" }}>
                Participants
              </span>
            </h1>
            <div className="participant-btn-bar">
              <ActionButton onClick={() => setOpen(true)}>
                Add Participant <AddIcon />
              </ActionButton>
            </div>
            <div className="participants-list">
              {details.participants.length === 0 ? (
                <h3 className="no-cert">
                  There are currently no participants.
                </h3>
              ) : (
                <List>
                  {details.participants.map((participant, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      className="participant-item"
                    >
                      <ListItem>
                        <ListItemText
                          primary={participant.participant_name.toUpperCase()}
                          secondary={`Email: ${participant.participant_email}`}
                        />
                      </ListItem>
                      <ActionButton
                        download={true}
                        link={participant.certificate_link}
                      >
                        <GetAppIcon />
                      </ActionButton>
                    </div>
                  ))}
                </List>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Dialog
        open={open}
        onClose={onCloseHandle}
        aria-labelledby="add-event-modal"
        PaperProps={{
          style: {
            backgroundColor: "black",
            color: "white",
            minWidth: "40%",
          },
        }}
        style={{ width: "100%" }}
      >
        <div className="add-participants-modal">
          {/* Template Selection Section */}
          <div className="template-zone">
            <h3>Select a template:</h3>
            <ImageSelect
              images={templates}
              selected={selected}
              setSelected={setSelected}
            />
          </div>

          {/* Enhanced Dropzone Section */}
          <div className="dropzone">
            <h3>Upload a file:</h3>
            <Dropzone
              onDrop={handleFileDrop}
              accept=".csv"
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    style={{
                      border: isDragging
                        ? "2px dashed #4caf50"
                        : "2px dashed #ccc",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: isDragging ? "#e8f5e9" : "#f9f9f9",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <input {...getInputProps()} />
                    <AddCircleIcon
                      style={{
                        fontSize: "48px",
                        color: isDragging ? "#4caf50" : "#9e9e9e",
                        marginBottom: "8px",
                      }}
                    />
                    <p
                      style={{
                        color: isDragging ? "#4caf50" : "#9e9e9e",
                        fontWeight: isDragging ? "bold" : "normal",
                        margin: "0",
                      }}
                    >
                      {file
                        ? `Selected file: ${file.name}`
                        : "Drag and drop or click to select a CSV file"}
                    </p>
                    {file && (
                      <p
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#616161",
                        }}
                      >
                        File size: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          {/* Action Button Section */}
          <div className="add-participants-btn">
            <ActionButton onClick={handleSubmit}>
              {!submitLoading ? (
                "CONFIRM"
              ) : (
                <CircularProgress color="secondary" size={20} thickness={5} />
              )}
            </ActionButton>
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
}

export default EventPage;
