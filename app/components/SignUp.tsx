"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import axiosInstance from "../utils/api";

// Define interface for user data
interface UserData {
  g_email: string;
  g_username: string;
  g_password: string;
}

const SignUp = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const generateRandomPassword = () => {
    const length = 10;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(
        Math.floor(Math.random() * charset.length)
      );
    }
    return generatedPassword;
  };

  const handleSuggestPassword = () => {
    const suggestedPassword = generateRandomPassword();
    setGeneratedPassword(suggestedPassword);
    setPassword(suggestedPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [showModal, setShowModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  // const router = useRouter();

  const [userData, setUserData] = useState<UserData[]>([]); // State to hold fetched user data

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/GrocerryAuth");
      setUserData(data); // Set fetched data into state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setShowModal(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);

    if (email.length < 11) {
      setErrorMsg("Email must be at least 8 characters long.");
      setShowModal(true);
      return;
    }

    if (user.length < 8) {
      setErrorMsg("Username must be at least 8 characters long.");
      setShowModal(true);
      return;
    }

    if (firstname.length < 1) {
      setErrorMsg("Firstname alteast be of 2 characters.");
      setShowModal(true);
      return;
    }

    if (lastname.length < 1) {
      setErrorMsg("Lastname alteast be of 2 characters.");
      setShowModal(true);
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      setShowModal(true);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(password) && password.length >= 8) {
      setErrorMsg("Password must contain only alphanumeric characters.");
      setShowModal(true);
      return;
    }

    if (/^\d+$/.test(password)) {
      setErrorMsg("Password must contain at least one letter.");
      setShowModal(true);
      return;
    }

    if (/^[a-zA-Z]+$/.test(password)) {
      setErrorMsg("Password must contain at least one number.");
      setShowModal(true);
      return;
    }

    const emailExists = userData.find((data) => data.g_email === email);

    if (emailExists) {
      setErrorMsg("Email already registered. Please use a different email.");
      setShowModal(true);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/GrocerryAuth", {
        email: email,
        firstname:firstname,
        lastname:lastname,
        username: user,
        password: password,
      });

      // console.log(data);

    } catch (error:any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with an error:", error.response.data);
        // Handle specific error cases, such as displaying error messages to the user
        setErrorMsg("An error occurred during sign-up. Please try again.");
        setShowModal(true);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        // Handle cases where the request was made but the server did not respond
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        // Handle other types of errors, such as network errors
        setErrorMsg(
          "An error occurred. Please check your internet connection and try again."
        );
        setShowModal(true);
      }
    }
  };

  // Modal Component

  interface ModalShowProps {
    open: boolean;
    msg: string;
    flg?:boolean;
  }

  const ModalShow: React.FC<ModalShowProps> = ({ open, msg, flg=false}) => {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
        <div className="bg-white p-8 rounded-lg border border-gray-300 z-50">
          <div className="flex flex-col justify-center items-center gap-5">
            <div>
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                src={flg?"/success.svg":"/invalid.svg"}
              />
            </div>
            <div>
              <p className="text-sm">{msg}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-3 py-2 bg-[#FF7645] rounded-lg text-white hover:scale-110 transition-all duration-300 ease-out"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  //   useEffect(() => {
  //     console.log("showModal:", showModal);
  //   }, [showModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "username") {
      setUser(value);
    }
    else if (name === "firstname") {
      setFirstName(value);
    }
    else if (name === "lastname") {
      setLastName(value);
    }
  };

  //   interface ModalShowProps {
  //     open: boolean;
  //     msg: string;
  //   }

  //   const ModalShow: React.FC<ModalShowProps> = ({ open, msg }) => {
  //     const [modal, setModal] = useState(open);

  //     return (
  //       <motion.div
  //         initial={{ scale: 0 }}
  //         animate={{ scale: 1 }}
  //         transition={{ duration: 0.5 }}
  //         className="fixed inset-0 flex items-center justify-center z-50"
  //       >
  //         <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
  //         <div className="bg-white p-8 rounded-lg border border-gray-300 z-50">
  //           <div className="flex flex-col justify-center items-center gap-5">
  //             <div>
  //               <motion.img
  //                 initial={{ scale: 0 }}
  //                 animate={{ scale: 1 }}
  //                 transition={{ duration: 0.8 }}
  //                 src="/invalid.svg"
  //               />
  //             </div>
  //             <div>
  //               <p className="text-sm">{msg}</p>
  //             </div>
  //             <button
  //               onClick={() => setFlag(false)}
  //               className="w-full px-3 py-2 bg-[#FF7645] rounded-lg text-white hover:scale-110 transition-all duration-300 ease-out"
  //             >
  //               Close
  //             </button>
  //           </div>
  //         </div>
  //       </motion.div>
  //     );
  //   };

  return (
    <>
      {errorMsg && errorMsg.length > 0 && showModal && (
        <ModalShow msg={errorMsg} open={showModal} />
      )}

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
        className="absolute top-0 left-0 mt-4 ml-10 h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      /> */}
          {/* <Image
            src={"/vercel.svg"}
            alt="Gravity Logo"
            width={100}
            height={300}
            className="absolute top-0 left-0 mt-4 ml-10 h-10 w-auto"
          ></Image>{" "} */}
          <h2
            style={{
              marginTop: "2.8rem", // Default margin for desktop/laptop
            }}
            className=" text-center text-2xl sm:text-3xl font-bold leading-9 text-gray-900 font-inter tracking-wide"
          >
            Welcome to Grocery Signup{" "}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="user@gmail.com"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={firstname}
                  onChange={handleChange}
                  autoComplete="firstname"
                  placeholder="Firstname"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={lastname}
                  onChange={handleChange}
                  autoComplete="lastname"
                  placeholder="Lastname"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={user}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="username@62"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  value={password}
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="R7gP2sF9"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEye className="text-black" />
                  ) : (
                    <FaEyeSlash className="text-black" />
                  )}
                </button>
              </div>
              <div className="float-right mb-4 mt-1">
                {/* <label
                  htmlFor="password"
                  className=""
                >
                  Suggest Password
                </label> */}
                <button
                  type="button"
                  onClick={handleSuggestPassword}
                  className="block text-xs font-semibold leading-6   text-gray-900"
                >
                  Suggest Password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md text-white bg-[#FF7645] px-3 py-2 text-sm font-semibold leading-6 shadow-sm hover:text-[#FF7645] hover:bg-white hover:border-[#FF7645]  hover:border-2 hover:py-1.5 hover:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7645] focus-visible:ring-opacity-50"
              >
                Create a Account
              </button>
            </div>
          </form>

          <div className="my-6 text-center flex justify-center items-center">
            <h1 className=" text-sm text-center  text-gray-700">
              Already have an account? Click here to{" "}
              <button
                onClick={() => router.push("/")}
                style={{
                  border: "1px solid",
                }}
                className="text-red-800 font-semibold"
              >
                Login
              </button>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
