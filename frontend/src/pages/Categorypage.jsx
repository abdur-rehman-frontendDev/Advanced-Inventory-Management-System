import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import FormattedTime from "../lib/FormattedTime ";

import TopNavbar from "../Components/TopNavbar";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  gettingallCategory,
  CreateCategory,
  RemoveCategory,
  SearchCategory,
} from "../features/categorySlice";
import toast from "react-hot-toast";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";

function Categorypage() {
  const { getallCategory, iscreatedCategory, searchdata } = useSelector(
    (state) => state.category,
  );
  const dispatch = useDispatch();
  const [query, setquery] = useState("");

  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(gettingallCategory());
  }, [dispatch]);

  useEffect(() => {
    if (query.trim() !== "") {
      const repeatTimeout = setTimeout(() => {
        dispatch(SearchCategory(query));
      }, 500);
      return () => clearTimeout(repeatTimeout);
    } else {
      dispatch(gettingallCategory());
    }
  }, [query, dispatch]);

  const handleremove = async (categoryId) => {
    dispatch(RemoveCategory(categoryId))
      .unwrap()
      .then(() => {
        toast.success("category removed successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to categoryproduct");
      });
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    const CategoryData = { name, description };

    dispatch(CreateCategory(CategoryData))
      .unwrap()
      .then(() => {
        toast.success(" CategoryData added successfully");
        resetForm();
      })
      .catch(() => {
        toast.error(" CategoryData add unsuccessful");
      });
  };

  const resetForm = () => {
    setname("");
    setdescription("");
  };

  const displayCategory = query.trim() !== "" ? searchdata : getallCategory;

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNavbar />
      <h1
        className="mt-6 mb-6 ml-10 mr-10 text-3xl font-bold"
        style={{ fontSize: "2rem" }}
      >
        Category List
      </h1>

      {/* <div className="mt-10 flex ">
        <div className="bg-blue-950 w-56 rounded-xl  ml-10 block h-24">
          <h1 className="text-white ml-12 block pt-5 font-bold">
            Total Category
          </h1>
          <p className="text-white font-bold  pt-2  ml-24">
            {getallCategory?.length || "0"}
          </p>
        </div>
      </div> */}

      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setquery(e.target.value)}
          placeholder="Search the category"
          className="w-full ml-10 mt-4 md:w-96 h-12 pl-4 pr-12 border-2 border-gray-300 rounded-lg"
        />
        <div className="flex mt-4">
          <button
            onClick={() => {
              setIsFormVisible(true);
              setSelectedProduct(null);
            }}
            className="bg-blue-800 ml-10 text-white w-40 h-12 rounded-lg flex items-center justify-center"
          >
            <IoMdAdd className="text-xl mr-3" />
            Add Category
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="absolute top-0 overflow-x-auto bg-base-100 bg-gray-100 right-0 h-svh p-6 border-2 border-gray-300 rounded-lg shadow-md transition-transform transform">
          <div className="text-right flex justify-between items-center mb-4">
            <MdKeyboardDoubleArrowLeft
              onClick={() => {
                setIsFormVisible(false);
                resetForm();
              }}
              className="cursor-pointer text-2xl"
            />
            <h1 className="text-xl font-semibold">
              {selectedProduct ? "Edit Category" : "Add Category"}
            </h1>
          </div>

          <form onSubmit={submitCategory}>
            <div className="mb-4">
              <label>Name</label>
              <input
                value={name}
                placeholder="Enter product name"
                onChange={(e) => setname(e.target.value)}
                type="text"
                className="w-full h-10 px-2 border-2 rounded-lg mt-2"
              />
            </div>

            <div className="mb-4">
              <label>Description</label>
              <input
                value={description}
                placeholder="Enter product description"
                onChange={(e) => setdescription(e.target.value)}
                type="text"
                className="w-full h-10 px-2 border-2 rounded-lg mt-2"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white w-full h-12 rounded-lg hover:bg-blue-700 mt-4"
            >
              {selectedProduct ? "Update Category " : "Add Category "}
            </button>
          </form>
        </div>
      )}

      <div className=" mt-10 mb-10 ml-10 mr-10">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-base-100 bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 bg-base-100 border w-5">Sr.</th>
                <th className="px-3 py-2 bg-base-100 border">Name</th>
                <th className="px-3 py-2 bg-base-100 border">Quantity</th>
                <th className="px-3 py-2 bg-base-100 border">Description</th>
                <th className="px-3 py-2 bg-base-100 border">Created At</th>
                <th className="px-3 py-2 bg-base-100 w-72 border">Action</th>
              </tr>
            </thead>
            <tbody className="bg-base-100 text-center">
              {Array.isArray(displayCategory) && displayCategory.length > 0 ? (
                displayCategory.map((Category, index) => (
                  <tr key={Category._id} className="">
                    <td className="px-3 py-2 border">{index + 1}</td>
                    <td className="px-3 py-2 border">{Category.name}</td>
                    <td className="px-3 py-2 border">
                      {Category.productCount}
                    </td>
                    <td className="px-3 py-2 border">{Category.description}</td>
                    <td className="px-3 py-2 border">
                      <FormattedTime timestamp={Category.createdAt} />
                    </td>

                    <td className="px-4 py-2 border flex justify-center items-center space-x-5">
                      <FaRegTrashAlt
                        onClick={() => handleremove(Category._id)}
                        className="h-6 w-6  text-red-500 hover:text-red-700 rounded-md cursor-pointer"
                      />
                      <FaPencilAlt className="h-6 w-6  text-green-500 hover:text-green-700 rounded-md cursor-pointer" />
                      {/* <button
                        onClick={() => handleremove(Category._id)}
                        className="h-10 w-24 bg-red-500 hover:bg-red-700 rounded-md text-white"
                      >
                        Remove
                      </button> 
                      <button className="h-10 w-24 bg-green-500 ml-10 hover:bg-green-700 rounded-md text-white">
                        Edit
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center bg-base-100 py-4">
                    No Category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categorypage;
