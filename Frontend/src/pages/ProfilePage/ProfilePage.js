import Axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const backend = "http://localhost:5000";

  const getDetails = useCallback(async () => {
    const url = `${backend}/user/me`;
    const token = localStorage.getItem("authToken");

    try {
      const res = await Axios.get(url, {
        headers: {
          "auth-token": token,
        },
      });
      setDetails(res.data);
      console.log(res.data);
      
    } catch (error) {
      console.log(error);
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

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
        <span style={{ borderBottom: "3px white solid" }}>EVENT DETAILS</span>
      </h1>
      <div className="event-details-section">
        <div className="event-page-header">
          <div className="event-details-header">
            <h1 className="quiz-name-detail">{details.user.name}</h1>
            <h3 className="quiz-date-detail">{details.user.email}</h3>
          </div>
          <div className="event-certs-header">
            EVENTS CREATED <br />
            <span className="certs-generated">
              {details.user.events ? details.user.events.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
