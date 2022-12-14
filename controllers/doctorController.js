const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../Utils/cloudinary");
const moment = require("moment");

const doctorData = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).json({
      message: "Doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({ message: "invalid doctor", success: false, error });
  }
};

const updateDoctorInfo = async (req, res) => {
  console.log(req.body, "qqqqqqqqqqqqqqqqqqqqqqqqqq");
  console.log(req.body.firstname, "sssssssssssssssssss");

  console.log(req.user._id, "vvvvvvvvvvvvvvvvvvvvvvv");
  try {
    const starttime = moment(req.body.start, ["HH:mm"]).format("hh:mm a");
    const endtime = moment(req.body.end, ["HH:mm"]).format("hh:mm a");
    console.log(starttime, "staaaaaaaaaaaaaaaaaa");
    console.log(endtime, "endddddddddddddd");
    const userid = req.user._id;
    console.log(userid, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    const user = await User.findOne({ _id: userid });
    console.log(user._id, "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
    await Doctor.findOneAndUpdate(
      { userId: userid },
      {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        phoneNumber: req.body.phonenumber,
        address: req.body.address,
        specialization: req.body.specialization,
        experience: req.body.experience,
        feePerConsultation: req.body.fee,
        start: starttime,
        end: endtime,
      }
    ).then((response) => {
      console.log(response, "8888888888888888888888888888888888");
      res.status(200).json({
        message: "doctor info updated successfully",
        success: true,
        data: response,
      });
    });
  } catch (error) {
    console.log(error, "5555555555555555");
    res.status(500).send({ message: "invalid doctor", success: false, error });
  }
};

const getDoctorById = async (req, res) => {
  console.log(req.body.doctorId, "body.docid00000000000000000000");

  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    console.log(doctor, "huuuuuuuuuuusjsuuuuuuuuuuuu");
    res.status(200).json({
      message: "doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({ message: "invalid doctor", success: false, error });
  }
};

const getAppointments = async (req, res) => {
  // console.log(req.user._id,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
  try {
    const doctor = await Doctor.findOne({userId:req.user._id});
    // console.log(doctor,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    const appointments = await Appointment.find({doctorInfo_id:doctor._id})
    // console.log(appointments,"apppppppppppppppppppppppppppppppppppppppppppppppppppp");
    res.status(200).json({
      message: "appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "invalid appointments", success: false, error });
  }
};

const changeAppointmentStatus= async(req,res)=>{
  try {
    const {appointmentId,status}= req.body;
    console.log(status,"hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log(appointmentId,"adadadadadadadadadadadadadad");
    const appointments = await Appointment.findByIdAndUpdate(appointmentId,{status});
    console.log(appointments,"hhhhhhhhhhhhhhhhhhhhhh");
    const user = await User.findOne({ _id: appointments.userId });
    console.log(user, "usertttttttt");
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "user-appointment-request-changed",
      message: `your appointment has been ${status}`,
      onClickPath: "/appointments",
    });
      await user.save()

    res.status(200).json({
      message: "appointment status updated successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "updation of status failed ", success: false, error });
  }
}

module.exports = {
  doctorData,
  updateDoctorInfo,
  getDoctorById,
  getAppointments,
  changeAppointmentStatus,
};
