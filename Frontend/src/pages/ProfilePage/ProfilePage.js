import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Avatar,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

function ProfilePage() {
  const test = "test";
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [previewPic, setPreviewPic] = useState("");

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
      setName(res.data.user.name);
      setProfilePic(res.data.user.profilePic || "");
    } catch (error) {
      console.log(error);
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  const handleSave = async () => { 
    const url = `${backend}/user/update`;
    const token = localStorage.getItem("authToken");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (previewPic) formData.append("profilePic", previewPic);

      await Axios.put(url, formData, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      setDetails((prev) => ({
        ...prev,
        user: { ...prev.user, name, profilePic: previewPic || profilePic },
      }));
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4}>
        <Avatar
          alt={details.user.name}
          src={details.user.profilePic || "/default-avatar.png"}
          sx={{ width: 120, height: 120, margin: "auto" }}
        />
        <IconButton
          onClick={() => setEditMode(true)}
          color="primary"
          sx={{ position: "absolute", transform: "translate(-40px, 90px)" }}
        >
          <Edit />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" mt={2}>
          {details.user.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {details.user.email}
        </Typography>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Events Created
          </Typography>
          <Typography variant="h3" color="primary">
            {details.user.events ? details.user.events.length : 0}
          </Typography>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box mt={2} textAlign="center">
            <input
              accept="image/*"
              type="file"
              id="profile-pic"
              style={{ display: "none" }}
              onChange={(e) => setPreviewPic(e.target.files[0])}
            />
            <label htmlFor="profile-pic">
              <Button variant="outlined" component="span">
                Upload Profile Picture
              </Button>
            </label>
          </Box>
          {previewPic && (
            <Box mt={2} textAlign="center">
              <Avatar
                src={URL.createObjectURL(previewPic)}
                alt="Profile Preview"
                sx={{ width: 80, height: 80, margin: "auto" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProfilePage;
