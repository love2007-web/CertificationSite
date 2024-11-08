import { Container, Grid } from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashNavbar from "../../components/DashNavbar/DashNavbar";
import Navbar from "../../components/Navbar/Navbar";
import Loading from "../Loading/Loading";
import { Document, Page } from "react-pdf";
import "./VerifyPage.css";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const backend = "http://localhost:5000";

  // Move getCertificate above getQueryParams
  const getCertificate = useCallback(
    async (code) => {
      let url = `${backend}/certificate/verify`;
      let data = { code: code };

      console.log(url, data);

      try {
        const res = await Axios.post(url, data);
        console.log(res.data);
        setDetails(res.data.certificateDoc);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    },
    [backend]
  );

  const getQueryParams = useCallback(() => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    let code = null;
    let found = false;

    // Use forEach instead of map
    vars.forEach((det) => {
      const sp = det.split("=");
      if (sp[0] === "id") {
        code = decodeURIComponent(sp[1]);
        found = true;
        // setId(decodeURIComponent(sp[1])); // optional, if you're planning to use id in future
      }
    });

    if (found) {
      getCertificate(code);
    }

    return found;
  }, [getCertificate]);

  const nav = () => {
    if (localStorage.getItem("authToken")) {
      return <DashNavbar back={true} />;
    } else {
      return <Navbar />;
    }
  };

  useEffect(() => {
    if (!getQueryParams()) {
      console.log("No query parameters found.");
      setLoading(false);
      setRedirect(true);
    }
  }, [getQueryParams]);

  if (loading) {
    return <Loading />;
  } else if (redirect) {
    navigate("/");
  }

  return (
    <div className="verify-page">
      {nav()}
      <Container className="verify-page-section">
        <h1>This certificate is valid.</h1>
        <Grid container>
          <Grid item sm={12} md={8}>
            <Document file={details?.certificate_link}>
              <Page pageNumber={1} />
            </Document>
          </Grid>
          <Grid item sm={12} md={4}>
            <h1 className="quiz-name-detail">{details?.user_name}</h1>
            <h3 className="quiz-date-detail">{details?.user_email}</h3>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default VerifyPage;
