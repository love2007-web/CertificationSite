import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashNavbar from "../../components/DashNavbar/DashNavbar";
import Navbar from "../../components/Navbar/Navbar";
import Loading from "../Loading/Loading";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "./VerifyPage.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [details, setDetails] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const backend = "http://localhost:5000";

  const getCertificate = useCallback(
    async (code) => {
      try {
        const res = await Axios.post(`${backend}/certificate/verify`, { code });
        if (res.data.certificateDoc) {
          setDetails(res.data.certificateDoc);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    },
    [backend]
  );

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("id");

    if (code) {
      getCertificate(code);
      return true;
    }

    return false;
  }, [getCertificate]);

  const nav = () =>
    localStorage.getItem("authToken") ? <DashNavbar back={true} /> : <Navbar />;

  useEffect(() => {
    if (!getQueryParams()) {
      console.log("No query parameters found.");
      setLoading(false);
      setRedirect(true);
    }
  }, [getQueryParams]);

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="verify-page">
      {nav()}
      <Container className="verify-page-section">
        <h1>
          {isValid
            ? "This certificate is valid."
            : "This certificate is Invalid."}
        </h1>
        {isValid && (
          <Grid container>
            <Grid item sm={12} md={8}>
              <Document
                file={details?.certificate_link}
                onLoadError={(error) =>
                  console.error("Error loading PDF:", error)
                }
              >
                <Page pageNumber={1} />
              </Document>
            </Grid>
            {/* <Grid item sm={12} md={4}>
              <h1 className="quiz-name-detail">{details?.user_name}</h1>
              <h3 className="quiz-date-detail">{details?.user_email}</h3>
            </Grid> */}
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default VerifyPage;
