import React, { useState, useEffect, useContext, useCallback } from "react";
import { HiPlus } from "react-icons/hi";
import {
  MapPin, Plus, Trash2, Edit2
} from "lucide-react";

import { UserAuthContext } from "../../context/AuthProvider";
import { getSavedAddresses, addNewAddress, deleteAddress, updateAddress } from "../../services/userProfileService";
import RemoveAddressModel from "./Models/RemoveAddressModel.";
import EditAddressModel from "./Models/EditAddressModel";
import NewAddressModel from "./Models/NewAddressModel";
import { useSnackbar } from "notistack";

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyAddresses() {

  const { enqueueSnackbar } = useSnackbar();
  const { authUser, authUserLoading, deliveryAddress, setDeliveryAddress } = useContext(UserAuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({})
  const [newAddressModel, setNewAddressModel] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressType: "Home",
    name: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const getAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSavedAddresses(authUser?._id);
      if (data?.success) {
        setAddresses(data.userAddresses);
      } else {
        enqueueSnackbar("Failed to fetch addresses", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Error fetching addresses", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [authUser, enqueueSnackbar]);

  useEffect(() => {
    if (authUser) getAddresses();
  }, [authUser, getAddresses]);

  const addAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await addNewAddress(authUser?._id, newAddress);
      if (data?.success) {
        getAddresses();
        setNewAddress({
          addressType: "Home",
          name: "",
          phone: "",
          streetAddress: "",
          city: "",
          state: "",
          pincode: "",
        });
        enqueueSnackbar("New address added successfully", { variant: "success" });
      }
    } catch {
      enqueueSnackbar("Failed to add address", { variant: "error" });
    } finally {
      setNewAddressModel(false);
      setLoading(false);
    }
  };

  const removeAddress = async (address) => {
    setLoading(true);
    try {
      const data = await deleteAddress(address._id, address.owner);
      if (data?.success) {
        getAddresses();
        enqueueSnackbar("Address removed successfully", { variant: "success" });

        if(address?._id === deliveryAddress?._id) {
          setDeliveryAddress(null);
        }
      }
    } catch {
      enqueueSnackbar("Failed to remove address", { variant: "error" });
    } finally {
      setRemoveModal(false);
      setLoading(false);
    }
  };

  const editAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateAddress(selectedAddress._id, selectedAddress);
      if (data?.success) {
        enqueueSnackbar("Address updated successfully", { variant: "success" });
        getAddresses();
      } else {
        enqueueSnackbar("Failed to update address", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Error updating address", { variant: "error" });
    } finally {
      setEditModal(false);
      setLoading(false);
    }
  };

  let content;
  if (authUserLoading || loading) {
    content = (
      <div className="flex items-center justify-center py-20 text-gray-500 space-x-2">
        <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
        <p className="text-sm">Loading...</p>
      </div>
    );
  } else if (addresses?.length === 0) {
    content = (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-gray-400 dark:text-gray-300 h-12 w-12" />
        </div>
        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
          No addresses saved yet
        </h4>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Add your first address to get started
        </p>
        <button
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium border border-blue-600 dark:border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setNewAddressModel(true)}
        >
          <Plus size={16} /> Add Address
        </button>
      </div>

    )
  } else {
    content = (
      <div className="space-y-4">
        {addresses.map((item) => (
          <div
            key={item._id}
            className="rounded-lg bg-gray-500/10 dark:bg-gray-500/20 p-4 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 dark:hover:bg-gray-500/30"
          >
            <div className="w-full">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold tracking-wide bg-gray-800 text-white dark:text-white`}>
                {item.addressType}
              </span>
              <p className="font-semibold text-lg mt-3 text-gray-800 dark:text-gray-100">
                {item.name} <span className="font-normal text-gray-600 dark:text-gray-300 ml-3">{item.phone}</span>
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.streetAddress}, {item.city}, {item.state} - {item.pincode}
              </p>
            </div>

            <hr className="border-dashed border-gray-300 dark:border-gray-500 w-full my-3" />

            <div className="flex w-full space-x-4">
              <button
                className="flex items-center gap-2 py-2 px-3 text-sm bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-300 rounded font-medium hover:bg-blue-200 dark:hover:bg-blue-600/40 transition-colors duration-200"
                onClick={() => {
                  setEditModal(true);
                  setSelectedAddress(item);
                }}
                aria-label={`Edit address for ${item.name}`}
              >
                <Edit2 size={14} /> Edit
              </button>

              <button
                className="flex items-center gap-2 py-2 px-3 text-sm bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-300 rounded font-medium hover:bg-red-200 dark:hover:bg-red-600/40 transition-colors duration-200"
                onClick={() => {
                  setRemoveModal(true);
                  setSelectedAddress(item);
                }}
                aria-label={`Remove address for ${item.name}`}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="w-full !h-fit md:h-full mx-auto flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Manage Addresses</h3>

        <button
          className="flex items-center text-sm gap-2 border dark:border-[#843E71] dark:hover:bg-[#843E71] text-blue-800 dark:text-white font-medium py-2 px-1 sm:px-2 rounded"
          onClick={() => setNewAddressModel(true)}
        >
          <HiPlus className="text-lg w-6 h-4" />
          <span className="hidden sm:flex">ADD NEW ADDRESS</span>
        </button>
      </div>

      {content}

      <Dialog
        open={removeModal && !!selectedAddress}
        fullWidth
        maxWidth="md"
        slotProps={{
          ...{
            paper: {
              className: "!relative !bg-white dark:!bg-gray-500/20 !rounded-xl !shadow-xl !w-full !max-w-xl !scrollbar-hide"
            },
            backdrop: {
              className: "!bg-black/40 !backdrop-blur-sm"
            }
          }
        }}
        keepMounted
        onClose={() => setRemoveModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <RemoveAddressModel
          selectedAddress={selectedAddress}
          setRemoveModal={setRemoveModal}
          removeAddress={removeAddress}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={editModal && !!selectedAddress}
        fullWidth
        maxWidth="md"
        slotProps={{
          ...{
            paper: {
              className: "!relative !bg-white dark:!bg-gray-500/20 !rounded-xl !shadow-xl !w-full !max-w-xl !scrollbar-hide"
            },
            backdrop: {
              className: "!bg-black/40 !backdrop-blur-sm"
            }
          }
        }}
        keepMounted
        onClose={() => setEditModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <EditAddressModel
          selectedAddress={selectedAddress}
          setEditModal={setEditModal}
          editAddress={editAddress}
          setSelectedAddress={setSelectedAddress}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={newAddressModel}
        fullWidth
        maxWidth="md"
        slotProps={{
          ...{
            paper: {
              className: "!relative !bg-white dark:!bg-gray-500/20 !rounded-xl !shadow-xl !w-full !max-w-xl !scrollbar-hide"
            },
            backdrop: {
              className: "!bg-black/40 !backdrop-blur-sm"
            }
          }
        }}
        keepMounted
        onClose={() => setNewAddressModel(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <NewAddressModel
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          setNewAddressModel={setNewAddressModel}
          addAddress={addAddress}
          loading={loading}
        />
      </Dialog>
    </>
  );
}