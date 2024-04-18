"use client";

import "./globals.css";
import Image from "next/image";
import Signin from "./components/SignIn";
import { useEffect } from "react";
import axiosInstance from "./utils/api";
import axios from "axios";

export default function Home() {

  const fetchData = async ()=>{

    const {data} = await axios.get("http://localhost:5095/api/Grocery");

    console.log(data);

  }

  useEffect(()=>{
    fetchData();
  },[]);
  
  return (
   
       <Signin />
  
  );
}
