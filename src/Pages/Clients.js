import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import Popup from "../Components/Popup";
import ReadMoreRoundedIcon from "@mui/icons-material/ReadMoreRounded";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const initialClientState = {
  client: "",
  clientDetails: "",
  phone: "",
  country: "",
  street: "",
  city: "",
  postalCode: "",
  workerName: "",
};

// Shared form for adding and editing clients
const ClientForm = ({
  clientDetails,
  setClientDetails,
  onSubmit,
  setTrigger,
  isEditMode,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({ ...prev, [name]: value }));
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Popup trigger={true} setTrigger={setTrigger}>
      <div className="popupWrap" onClick={stopPropagation}>
        <div className="productsSummary">
          <h3 className="productSummaryLeft">
            {isEditMode ? "Edit client" : "Add new client"}
          </h3>
        </div>

        <div className="addNewOrderWrap">
          <div className="addNewOrderForm">
            <div className="orderDetails">
              <div className="input-group">
                <input
                  name="client"
                  type="text"
                  placeholder="Client name"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.client || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  name="phone"
                  type="text"
                  placeholder="Phone number"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.phone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  name="clientDetails"
                  type="text"
                  placeholder="Client details"
                  className="orderDetailsInput"
                  value={clientDetails.clientDetails || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  name="country"
                  type="text"
                  placeholder="Country"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.country || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  name="street"
                  type="text"
                  placeholder="Street, home/appartment number"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.street || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.city || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  name="postalCode"
                  type="text"
                  placeholder="Postal code"
                  className="orderDetailsInput orderDetailsInputHalf"
                  value={clientDetails.postalCode || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="submitWrap">
          <div className="submitNewOrder">
            <button className="submitNewOrderBtn" onClick={onSubmit}>
              <AddCircleOutlineRoundedIcon />
              <span className="addOrderText">{isEditMode ? "Update" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};


function Clients() {
  const ctx = useContext(AuthLoginInfo);
  const [clientsData, setClientsData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientDetails, setClientDetails] = useState({ ...initialClientState });
  const [newOrderSubmitted, setNewOrderSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/clients`,
        { withCredentials: true })
      .then((res) => {
        if (res?.data?.clients) {
          setClientsData(res.data.clients);
        }
      });
  }, [newOrderSubmitted]);

  const handleAddClient = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/newclient`,
        { clientDetails: { ...clientDetails, workerName: ctx.username } },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data === "success") {
          setClientDetails({ ...initialClientState });
          setButtonPopup(false);
          setNewOrderSubmitted((prev) => !prev);
        }
      });
  };

  const handleUpdateClient = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/updateclient`,
        { clientDetails },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data === "success") {
          setClientDetails({ ...initialClientState });
          setButtonPopup(false);
          setIsEditMode(false);
          setNewOrderSubmitted((prev) => !prev);
        }
      });
  };

  const openEditForm = (client) => {
    setClientDetails(client);
    setIsEditMode(true);
    setButtonPopup(true);
  };

  const openAddForm = () => {
    setClientDetails({ ...initialClientState, workerName: ctx.username });
    setIsEditMode(false);
    setButtonPopup(true);
  };

  const deleteClient = async (clientId) => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/deleteclient/${clientId}`
    );
    setClientsData((prev) => prev.filter((c) => c._id !== clientId));
  } catch (err) {
    console.error("Failed to delete client:", err);
  }
};

  return (
    <div className="bodyWrap">
      <div className="contentOrderWrap clientsTableWrap">
        <div className="leftSide">
          <h1>Clients</h1>
          <div className="orderNavWrap">
            <div className="addOrderWrap">
              <button className="addOrder" onClick={openAddForm}>
                <AddCircleOutlineRoundedIcon />
                <span className="addOrderText">Add</span>
              </button>
            </div>
          </div>

          <div className="orderWrap">
            <table>
              <thead>
                <tr>
                  <th>Client name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {clientsData.map((client, i) => (
                  <tr key={i}>
                    <td>{client.client}</td>
                    <td>{client.phone}</td>
                    <td>{client.city}</td>
                    <td className="maincolor" onClick={() => openEditForm(client)}>
                      <EditIcon />
                    </td>
                    <td className="maincolor"  onClick={() => deleteClient(client?._id)}
                      style={{ cursor: "pointer" }}>
                      <DeleteRoundedIcon /> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {buttonPopup && (
        <ClientForm
          clientDetails={clientDetails}
          setClientDetails={setClientDetails}
          setTrigger={setButtonPopup}
          isEditMode={isEditMode}
          onSubmit={isEditMode ? handleUpdateClient : handleAddClient}
        />
      )}
    </div>
  );
}

export default Clients;
