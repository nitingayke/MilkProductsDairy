import { useState, useEffect, useContext, useCallback } from "react";
import {
  FaUser, FaPhone, FaVenusMars, FaMapMarkerAlt, FaEdit,
  FaRoad, FaCity, FaMapPin,
} from "react-icons/fa";
import { Close } from "@mui/icons-material";
import { UserAuthContext } from "../../context/AuthProvider";
import { getUserProfile, updateUserProfile } from "../../services/userProfileService";
import { useSnackbar } from "notistack";

export default function AccountInfo() {
  const { enqueueSnackbar } = useSnackbar();
  const { authUser } = useContext(UserAuthContext);

  const [edit, setEdit] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [editData, setEditData] = useState({
    _id: authUser?._id,
    firstName: "",
    lastName: "",
    address: {
      streetAddress: "",
      city: "",
      pincode: "",
    },
    gender: "",
    mobileNo: "",
    photo: "",
    username: "",
  });

  const [dbData, setDbData] = useState({});

  const handleUserProfileData = useCallback(async () => {
    try {
      setDataLoading(true);
      const data = await getUserProfile(authUser?._id);
      if (data?.success) {
        setDbData(data?.userData);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Error fetching user data", { variant: "error" });
    } finally {
      setDataLoading(false);
    }
  }, [authUser?._id, enqueueSnackbar]);

  useEffect(() => {
    if (authUser?._id) {
      handleUserProfileData();
    }
  }, [authUser?._id, handleUserProfileData]);

  useEffect(() => {
    if (dbData) {
      setEditData({
        firstName: dbData?.firstName,
        lastName: dbData?.lastName,
        address: dbData?.address,
        gender: dbData?.gender,
        mobileNo: dbData?.mobileNo,
        photo: dbData?.photo,
        username: dbData?.username,
      });
    }
  }, [dbData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(editData.mobileNo)) {
        enqueueSnackbar("Enter a valid 10-digit phone number", {variant: "error"});
        return;
      }

      setIsLoading(true);
      const res = await updateUserProfile(editData, authUser?._id);
      if (res?.success) {
        await handleUserProfileData();
        setEdit(false);
        enqueueSnackbar("Profile edited successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Update failed", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Something went wrong.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  let content;

  if (dataLoading) {
    content = (
      <div className="flex items-center justify-center py-20 text-gray-500 min-w-xl space-x-2">
        <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
        <p className="text-sm">Loading...</p>
      </div>
    );
  } else {
    content = (
      <>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "firstName", value: editData?.firstName, display: dbData?.firstName },
              { label: "Last Name", name: "lastName", value: editData?.lastName, display: dbData?.lastName },
              { label: "Username", name: "username", value: editData?.username, display: dbData?.username, icon: <FaUser /> },
              {
                label: "Phone Number",
                name: "mobileNo",
                value: editData?.mobileNo,
                display: dbData?.mobileNo,
                icon: <FaPhone />,
                inputProps: {
                  type: "tel",
                  onChange: (e) => {
                    const val = e.target.value;
                    if (/^\d{0,10}$/.test(val)) handleInputChange(e);
                  },
                },
              },
            ].map((field, index) => (
              <div key={index * 0.5}>
                <label className="mb-1 font-medium flex items-center gap-1">
                  {field?.icon} {field?.label}
                </label>
                {edit ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded transition focus:ring-2 focus:ring-blue-300 dark:bg-gray-500/50 dark:border-gray-600"
                    name={field?.name}
                    value={field?.value}
                    {...(field?.inputProps || { onChange: handleInputChange })}
                  />
                ) : (
                  <p className="p-2 border border-gray-400 rounded bg-gray-100 dark:bg-gray-500/50 hover:cursor-not-allowed">{field.display}</p>
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="mb-1 font-medium flex items-center gap-1">
                <FaVenusMars /> Gender
              </label>
              {edit ? (
                <select
                  className="w-full p-2 border rounded transition dark:bg-gray-500/50 dark:border-gray-600"
                  name="gender"
                  value={editData?.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="p-2 border border-gray-400 rounded bg-gray-100 dark:bg-gray-500/50 hover:cursor-not-allowed">{dbData?.gender}</p>
              )}
            </div>

            <div>
              <label className="mb-1 font-medium flex items-center gap-1">
                <FaMapMarkerAlt /> Address
              </label>
              {edit ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="px-3 py-2 bg-[#414141] text-white rounded hover:bg-[#41414150] transition"
                  >
                    Edit Address
                  </button>
                  <p className="text-sm mt-2 text-gray-500/50 dark:text-gray-300">
                    {editData?.address?.streetAddress}, <br />
                    {editData?.address?.city}, {editData?.address?.pincode}
                  </p>
                </>
              ) : (
                <p className="p-2 border border-gray-400 rounded bg-gray-100 dark:bg-gray-500/50 text-sm leading-6 hover:cursor-not-allowed">
                  {dbData?.address?.streetAddress || ""},<br />
                  {dbData?.address?.city || ""}, {dbData?.address?.state || ""} - {dbData?.address?.pincode || ""}
                </p>
              )}
            </div>
          </div>

          {edit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className={`mt - 4 px-6 py-2 text-white rounded transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#843E71] hover:bg-[#b3549a]"}`}
            >
              {isLoading ? "Saving..." : "Save Account Info"}
            </button>
          )}
        </form >

        {showAddressModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-white dark:bg-gray-500/50 p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in">
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold transition"
              >
                <Close />
              </button>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="!text-[#813E71]" /> Edit Address
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["streetAddress", "city", "pincode"].map((field, i) => (
                  <div key={i * 0.9} className={`${["streetAddress"].includes(field) ? "md:col-span-2" : ""}`}>
                    {(() => {
                      let icon;
                      if (field === "streetAddress") icon = <FaRoad />;
                      else if (field === "city") icon = <FaCity />;
                      else icon = <FaMapPin />;
                      return (
                        <label className="text-sm font-medium capitalize flex items-center gap-2">
                          {icon} {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                      );
                    })()}
                    <input
                      type="text"
                      className="w-full p-2 border rounded transition focus:ring-2 focus:ring-indigo-300  dark:bg-gray-500/20 dark:border-gray-600"
                      value={editData?.address[field] || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          address: { ...prev.address, [field]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-500/50 dark:text-white rounded hover:bg-gray-500/60 transition"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#843E71] text-white rounded hover:bg-[#843E71] transition"
                    onClick={() => {
                      const { streetAddress, city, pincode } = editData.address;
                      if (!streetAddress || !city || !pincode) {
                        enqueueSnackbar("Please fill out all address fields", { variant: "error" });
                        return;
                      }
                      setShowAddressModal(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div >
          </div >
        )
        }
      </>
    )
  }

  if (!dbData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">Unable to fetch user data, please try again.</div>
    )
  }

  return (
    <>
      <div className="w-full !h-fit md:max-w-2xl lg:w-3xl md:h-full mx-auto flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 line-clamp-1">
          <FaUser className="text-blue-600 dark:text-blue-400" /> Account Information
        </h3>
        <button
          type="button"
          onClick={() => setEdit(!edit)}
          className="px-4 py-2 text-sm bg-[#414141] text-white rounded transition duration-300 flex items-center gap-2"
        >
          <FaEdit />
          {edit ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {content}
    </>
  );

}