// src/components/EmployeeDocument/EmployeeDocumentDialogs.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { UploadFile, Delete as DeleteIcon } from "@mui/icons-material";

import { employeeService } from "../../services/employeeService";
import employeedocService  from "../../services/employeedocService";
import { useEmployeeDocs } from "../../hooks/useEmployeeDocs";
import { DOCUMENT_TYPES } from "../../constants";
import toast from "react-hot-toast";

// =====================================================
// ADD / EDIT DOCUMENT DIALOG
// =====================================================
export const AddEditDocumentDialog = ({ open, onClose, onConfirm, document }) => {
  const isEdit = !!document;
  const [isUploading, setIsUploading] = useState(false);

  const { uploadDocumentFile } = useEmployeeDocs(); // <-- dùng hook của bạn

  const getInitialFormData = () => ({
    empId: document?.empId || "",
    docType: document?.docType || "",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [employees, setEmployees] = useState([]);
  const [file, setFile] = useState(null);

  // Load employees
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!open) return;
      try {
        const res = await employeeService.getAllEmployees({ page: 0, pageSize: 100 });
        if (res.data?.code === 0) {
          setEmployees(res.data.data.content || []);
        }
      } catch (err) {
        toast.error("Failed to load employees.");
      }
    };
    fetchEmployees();
  }, [open]);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setFile(null);
    }
  }, [document, open]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };

  // ===========================================
  // SUBMIT FORM
  // ===========================================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.empId || !formData.docType) {
    return toast.error("Please fill in all required fields.");
  }

  if (!isEdit && !file) {
    return toast.error("You must select a file.");
  }

  setIsUploading(true);

  try {
    let finalUploadedData = null;

    // If new file selected → upload to S3
    if (file) {
      const uploadResult = await uploadDocumentFile(file, formData.empId);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "File upload failed");
      }

      // ✔ Đúng: backend trả về { objectKey, fileName }
      finalUploadedData = uploadResult.data;  
      console.log("Uploaded data:", finalUploadedData);
    }

    // ✔ Build payload ĐÚNG CHUẨN backend yêu cầu
    const payload = {
      empId: formData.empId,
      docType: formData.docType,
      fileUrl: finalUploadedData?.objectKey,   
      originalName: finalUploadedData?.fileName,  
      fileSize: file?.size || 0,                  
    };

    console.log("Final payload:", payload);

    // Call API create / update
    if (isEdit) {
      await employeedocService.updateDocument(document.id, payload);
      toast.success("Document updated successfully!");
      window.location.reload();
    } else {
      await employeedocService.createDocument(payload);
      toast.success("Document created successfully!");
    }

    onClose();
    onConfirm?.();
  } catch (err) {
    toast.error(err.message || "Submit failed");
  } finally {
    setIsUploading(false);
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" component="form" onSubmit={handleSubmit}>
      <DialogTitle>{isEdit ? "Edit Document" : "Add Document"}</DialogTitle>

      <DialogContent>
        {/* Select employee */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Employee</InputLabel>
          <Select
            name="empId"
            label="Employee"
            disabled={isEdit}
            value={formData.empId}
            onChange={(e) => setFormData((p) => ({ ...p, empId: e.target.value }))}
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select document type */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Document Type</InputLabel>
          <Select
            name="docType"
            label="Document Type"
            value={formData.docType}
            onChange={(e) => setFormData((p) => ({ ...p, docType: e.target.value }))}
          >
            {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Upload UI */}
        {!file ? (
          <Paper
            variant="outlined"
            component="label"
            htmlFor="file-upload"
            sx={{
              mt: 2,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed #ccc",
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            {isUploading ? (
              <CircularProgress />
            ) : (
              <UploadFile sx={{ fontSize: 50, color: "grey.500" }} />
            )}

            <Typography variant="h6" mt={1}>
              {isUploading ? "Uploading..." : "Upload a file"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Drag & drop or click to browse
            </Typography>

            <input id="file-upload" type="file" hidden onChange={handleFileChange} disabled={isUploading} />
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              borderColor: "primary.light",
              bgcolor: "#f7faff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <UploadFile sx={{ fontSize: 32, color: "primary.main" }} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            </Stack>

            <IconButton color="error" onClick={() => setFile(null)}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        )}

        {isEdit && document && (
          <Typography variant="caption" color="text.secondary" mt={1}>
            Current file: <strong>{document.originalName}</strong>
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isUploading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isUploading}>
          {isUploading ? "Submitting..." : isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =====================================================
// DELETE DIALOG
// =====================================================
export const DeleteDocumentDialog = ({ open, onClose, onConfirm, document }) => {
  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Document</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{DOCUMENT_TYPES[document.docType]}</strong> for{" "}
          <strong>{document.employeeName}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =====================================================
// VIEW DIALOG
// =====================================================
export const ViewDocumentDialog = ({ open, onClose, document }) => {
  if (!document) return null;

  const fileUrl = document.fileUrl;
  const fileName = fileUrl?.split("?")[0].split("/").pop();
  const ext = fileName?.split(".").pop().toLowerCase();

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPDF = ext === "pdf";
  const isOffice = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);
  const isText = ["txt", "json", "csv"].includes(ext);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Document Details</DialogTitle>

      <DialogContent sx={{ minHeight: "600px" }}>
        {/* 1️⃣ IMAGE PREVIEW */}
        {isImage && (
          <img
            src={fileUrl}
            alt="preview"
            style={{ width: "100%", borderRadius: 8 }}
          />
        )}

        {/* 2️⃣ PDF PREVIEW */}
        {isPDF && (
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            style={{ border: "none" }}
          />
        )}

        {/* 3️⃣ OFFICE FILE PREVIEW */}
        {isOffice && (
          <iframe
            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
              fileUrl
            )}`}
            width="100%"
            height="800px"
            style={{ border: "none" }}
          />
        )}

        {/* 4️⃣ TEXT / CSV / JSON PREVIEW */}
        {isText && (
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            style={{ border: "none" }}
          />
        )}

        {/* 5️⃣ FILE KHÔNG HỖ TRỢ */}
        {!isImage && !isPDF && !isOffice && !isText && (
          <Typography>
            Preview không được hỗ trợ cho loại file này. Bạn có thể tải xuống.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        {fileUrl && (
          <Button
            variant="outlined"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<UploadFile />}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
