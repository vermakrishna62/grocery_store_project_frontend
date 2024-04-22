"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";

interface GData {
  gid: number;
  gname: string;
  gcategory: string;
  gprice: number;
}

const page = () => {
  const router = useRouter();
  const [gdata, setGdata] = useState<GData[]>([]);
  const [selectedData, setSelectedData] = useState<GData | null>(null); // State to store selected option's data
  const [quantity, setQuantity] = useState<number>(1); // State to store quantity

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

  return (
    <>
      <Header />
      <div className="bg-white my-5 mx-20">
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
                  min="1"
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
              <div className=" mt-10 mb-6 flex justify-center items-center">
                <button className="btn px-5 py-2 text-md bg-red-600 text-white">
                    Add to Cart
                </button>
              </div>
              )}
      </div>
    </>
  );
};

export default page;
