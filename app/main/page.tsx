"use client";

// pdf export code

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";
import Cookies from "cookie_js";

interface GData {
  gid: number;
  gname: string;
  gcategory: string;
  gprice: number;
}

interface GroceryData {
  guser: string;
  gname: string;
  gcategory: string;
  gqty: number;
  gpriceperqty: number;
  gprice: number;
}

const page = () => {
  const router = useRouter();
  const [gdata, setGdata] = useState<GData[]>([]);
  const [selectedData, setSelectedData] = useState<GData | null>(null); // State to store selected option's data
  const [quantity, setQuantity] = useState<number>(1); // State to store quantity

  const [apidata, setApidata] = useState<GroceryData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = apidata.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(apidata.length / rowsPerPage);

  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  const [userData, setUserData] = useState({});

  const handlePrintData = () => {
    // Select the table element
    const table = document.querySelector("table");

    // Use html2canvas to capture the table content as an image
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Set PDF size (unit in mm)
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate aspect ratio for PDF to fit the content properly
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add multiple pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save("grocery_data.pdf");
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userCookie = Cookies.get(["user", "email", "pass", "fn", "ln"]);
      setUserData(userCookie);

      try {
        const { data } = await axiosInstance.get("/GroceryData/getGroceryData");
        setApidata(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData); // Access userData state to see the retrieved values

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGid = parseInt(event.target.value, 10); // Parse the selected option's value to integer
    const selectedOption = gdata.find((item) => item.gid === selectedGid); // Find the selected option in gdata
    if (selectedOption) {
      setSelectedData(selectedOption); // Set the selected data object in state
    } else {
      setSelectedData(null); // Reset selected data if the selected option is not found
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // Validate if newValue is a valid decimal number
    if (/^\d*\.?\d*$/.test(newValue)) {
      setQuantity(parseFloat(newValue)); // Parse the string value to a float
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/GroceryData");
      setGdata(data); // Set fetched data into state
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/GroceryData", {
        guser: (userData as any).user,
        gname: selectedData?.gname,
        gcategory: selectedData?.gcategory,
        gqty: quantity,
        gpriceperqty: selectedData?.gprice,
        gprice: quantity * (selectedData?.gprice ?? 0),
      });

      // If POST request is successful, fetch updated data and update the state
      if (data === "Grocery Saved Successfully") {
        const updatedDataResponse = await axiosInstance.get(
          "/GroceryData/getGroceryData"
        );
        setApidata(updatedDataResponse.data);
      }

      // console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-white my-5 mx-20">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-evenly">
            {gdata && gdata.length > 0 && (
              <>
                <select
                  onChange={handleChange}
                  className="max-h-20 overflow-y-auto"
                >
                  <option value={""} selected disabled>
                    Select Grocery
                  </option>
                  {gdata.map((data) => (
                    <option key={data.gid} value={data.gid}>
                      {data.gname}
                    </option>
                  ))}
                </select>

                {/* Display selected data properties */}
                <div className="flex gap-4 items-center">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    pattern="[0-9]*\.?[0-9]*"
                    className="w-14"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label htmlFor="price">Price / Qty:</label>
                  {selectedData ? (
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={selectedData.gprice}
                      readOnly
                      className="w-14"
                    />
                  ) : (
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={0}
                      readOnly
                      className="w-14"
                    />
                  )}
                </div>
                <div className="flex gap-4 items-center">
                  <label htmlFor="price">Price (in Rs.):</label>
                  {selectedData ? (
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={selectedData.gprice * quantity}
                      readOnly
                    />
                  ) : (
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={0}
                      readOnly
                    />
                  )}
                </div>
              </>
            )}
          </div>
          {selectedData && (
            <div className=" mt-10 flex justify-center items-center">
              <button
                type="submit"
                className="btn px-5 py-2 text-md bg-red-600 text-white"
              >
                Add to Cart
              </button>
            </div>
          )}
        </form>

        {apidata && apidata.length > 0 && (
          <div className="mt-10 mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-normal font-serif mb-2">
                Grocery Data
              </h2>
              <button
                onClick={handlePrintData}
                className=" btn px-3 py-1 text-sm my-2 mx-10 bg-green-400 rounded-lg text-white"
              >
                Print Data
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price Per Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRows.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.guser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.gname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.gcategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.gqty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.gpriceperqty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.gprice}
                    </td>
                  </tr>
                ))}
                <tr className="py-3 bg-red-200 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap">Total Amount</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Calculate total amount */}
                    Rs.{" "}
                    {apidata
                      .reduce((acc, cur) => acc + cur.gprice, 0)
                      .toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">CGST/SGST</td>
                  <td className="px-6 py-4 whitespace-nowrap">10%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Total Amount (incl. taxes)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Calculate total amount including taxes */}
                    Rs.{" "}
                    {(
                      apidata.reduce((acc, cur) => acc + cur.gprice, 0) * 1.1
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {/* Pagination buttons */}
              <nav
                className="relative z-0 inline-flex shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {/* Previous button */}
                <button
                  onClick={() => handleClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.707 3.293a1 1 0 0 1 1.414 1.414L6.414 10l3.707 3.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Page buttons */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleClick(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 ${
                      currentPage === i + 1 ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {/* Next button */}
                <button
                  onClick={() => handleClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.293 16.707a1 1 0 0 1-1.414-1.414L13.586 10 9.293 5.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
