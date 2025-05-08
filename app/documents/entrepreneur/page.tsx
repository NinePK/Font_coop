"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, MenuItem, InputLabel, FormControl, TextField, Button, Box, Snackbar, Alert } from "@mui/material";

const CreateEntrepreneurPage = () => {
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [province, setProvince] = useState([]);
  const [amphur, setAmphur] = useState([]);
  const [tambon, setTambon] = useState([]);
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState(""); // Email field - Optional
  const [business, setBusiness] = useState("");
  const [employee, setEmployee] = useState(""); // Employee field - Should be integer
  const [address, setAddress] = useState("");
  const [manager, setManager] = useState("");
  const [managerPosition, setManagerPosition] = useState("");
  const [managerDept, setManagerDept] = useState("");
  const [contact, setContact] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [contactDept, setContactDept] = useState("");
  const [contactTel, setContactTel] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(""); 
  const [selectedAmphur, setSelectedAmphur] = useState("");
  const [selectedTambon, setSelectedTambon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to show in Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success"); // "success" or "error"
  const router = useRouter();

  // Fetch Province Data
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/province`);
      const data = await res.json();
      setProvince(data);
    };
    fetchProvinces();
  }, []);

  // Fetch Amphur Data based on selected Province
  useEffect(() => {
    if (selectedProvince) {
      const fetchAmphur = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/amphur/province_id-${selectedProvince}`);
        const data = await res.json();
        setAmphur(data);
      };
      fetchAmphur();
    }
  }, [selectedProvince]);

  // Fetch Tambon Data based on selected Amphur
  useEffect(() => {
    if (selectedAmphur) {
      const fetchTambon = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/tambon/amphur_id-${selectedAmphur}`);
        const data = await res.json();
        setTambon(data);
      };
      fetchTambon();
    }
  }, [selectedAmphur]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert employee value to integer, and handle non-integer values
    const employeeValue = parseInt(employee);
    if (isNaN(employeeValue)) {
      setErrorMessage("Please enter a valid number for the number of employees.");
      return;
    }

    const data = {
      name_th: nameTh,
      name_en: nameEn,
      province_id: selectedProvince,
      amphur_id: selectedAmphur,
      tambon_id: selectedTambon, 
      address,
      manager,
      manager_position: managerPosition,
      manager_dept: managerDept,
      contact: contact || null,
      contact_position: contactPosition || null,
      contact_dept: contactDept || null,
      contact_tel: contactTel || null,
      contact_email: contactEmail || null,
      tel,
      email: email || null, 
      business,
      employees: employeeValue, 
    };

    // Log data to check
    console.log("Data being sent to API:", data);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/entrepreneur`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("ข้อมูลถูกส่งเรียบร้อยแล้ว!");
        setOpenSnackbar(true);

        // Redirect to /documents after Snackbar has shown for 6 seconds
        setTimeout(() => {
          router.push("/documents");
        }, 2000); // Delay the redirection for 6 seconds to show Snackbar
      } else {
        const errorData = await res.json();
        setSnackbarSeverity("error");
        setSnackbarMessage(errorData.message || "เกิดข้อผิดพลาดในการส่งข้อมูล.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("เกิดข้อผิดพลาด. โปรดลองใหม่.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box p={3} className="bg-white">
      <h1 className="text-2xl font-bold">Create Entrepreneur</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        {/* Existing form fields */}
        <div className="mb-4">
          <TextField
            label="ชื่อสถานประกอบการ (ภาษาไทย)"
            variant="outlined"
            value={nameTh}
            onChange={(e) => setNameTh(e.target.value)}
            fullWidth
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            label="ชื่อสถานประกอบการ (ภาษาอังกฤษ)"
            variant="outlined"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
            required
          />
        </div>

        {/* Province, Amphur, Tambon Selects */}
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel>จังหวัด</InputLabel>
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              label="จังหวัด"
              required
            >
              <MenuItem value="">
                <em>เลือกจังหวัด</em>
              </MenuItem>
              {province.map((item: { id: number; value: string }) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Amphur Select */}
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel>อำเภอ</InputLabel>
            <Select
              value={selectedAmphur}
              onChange={(e) => setSelectedAmphur(e.target.value)}
              label="อำเภอ"
              required
              disabled={!selectedProvince}
            >
              <MenuItem value="">
                <em>เลือกอำเภอ</em>
              </MenuItem>
              {amphur.map((item: { id: number; value: string }) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Tambon Select */}
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel>ตำบล</InputLabel>
            <Select
              value={selectedTambon}
              onChange={(e) => setSelectedTambon(e.target.value)}
              label="ตำบล"
              required
              disabled={!selectedAmphur}
            >
              <MenuItem value="">
                <em>เลือกตำบล</em>
              </MenuItem>
              {tambon.map((item: { id: number; value: string }) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* New form fields for Email and Employee */}
        <div className="mb-4">
          <TextField
            label="อีเมล (ไม่บังคับ)"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <TextField
            label="จำนวนพนักงาน"
            variant="outlined"
            type="number"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            fullWidth
            required
          />
        </div>

        {/* New form fields for Address, Manager, Contact */}
        <div className="mb-4">
          <TextField
            label="ที่อยู่"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            label="ชื่อผู้จัดการสถานประกอบการ"
            variant="outlined"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            fullWidth
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            label="ตำแหน่งผู้จัดการ"
            variant="outlined"
            value={managerPosition}
            onChange={(e) => setManagerPosition(e.target.value)}
            fullWidth
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            label="แผนกผู้จัดการ"
            variant="outlined"
            value={managerDept}
            onChange={(e) => setManagerDept(e.target.value)}
            fullWidth
            required
          />
        </div>

        {/* Contact Information */}
        <div className="mb-4">
          <TextField
            label="ผู้ประสานงาน"
            variant="outlined"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <TextField
            label="ตำแหน่งผู้ประสานงาน"
            variant="outlined"
            value={contactPosition}
            onChange={(e) => setContactPosition(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <TextField
            label="แผนกผู้ประสานงาน"
            variant="outlined"
            value={contactDept}
            onChange={(e) => setContactDept(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <TextField
            label="โทรศัพท์ผู้ประสานงาน"
            variant="outlined"
            value={contactTel}
            onChange={(e) => setContactTel(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <TextField
            label="อีเมลผู้ประสานงาน"
            variant="outlined"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            fullWidth
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {/* Snackbar to display success or error message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity} 
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          สร้างสถานประกอบการ
        </Button>
      </form>
    </Box>
  );
};

export default CreateEntrepreneurPage;
