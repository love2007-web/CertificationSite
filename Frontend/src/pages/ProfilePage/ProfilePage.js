import Axios from "axios";
import React, { useState, useEffect } from "react";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const backend = process.env.REACT_APP_BACKEND_URL;

  const getDetails = async () => {
    const url = `${backend}/user/me`;
    const token = localStorage.getItem("authToken");

    try {
      const res = await Axios.get(url, {
        headers: {
          "auth-token": token,
        },
      });
      setDetails(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!details) {
    return <div>No details available</div>;
  }

  return (
    <div className="profile-section">
      <h1 className="section-heading">
        <span style={{ borderBottom: "3px white solid" }}>Event Details</span>
      </h1>
      <div className="event-details-section">
        <div className="event-page-header">
          <div className="event-details-header">
            <h1 className="quiz-name-detail">{details.name}</h1>
            <h3 className="quiz-date-detail">{details.email}</h3>
          </div>
          <div className="event-certs-header">
            EVENTS CREATED <br />
            <span className="certs-generated">
              {details.events ? details.events.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
