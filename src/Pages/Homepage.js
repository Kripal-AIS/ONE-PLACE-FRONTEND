import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Styles/homepage.css";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";

function Homepage() {
  const ctx = useContext(AuthLoginInfo);
  const isAuthenticated = !Array.isArray(ctx);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dashboard`,
         { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setDashboardData(res.data);
        }
      });
  }, []);

  const TopPanel = () => {
    const upcomingEventDateText = (date) => {
      let todaysDate = new Date().toISOString().split("T")[0];
      let tommorowDate = new Date();
      tommorowDate.setDate(tommorowDate.getDate() + 1);
      let tommorowDateToCompare = tommorowDate.toISOString().split("T")[0];
      let eventDate = date.split("T")[0];
      if (eventDate === todaysDate) {
        return "Today";
      } else if (eventDate === tommorowDateToCompare) {
        return "Tommorow";
      } else {
        return eventDate;
      }
    };

    const UpcomingEvents = () => {
      let upcomingEventsExist = false;
      if (dashboardData[2] === undefined || dashboardData[2].length === 0) {
        upcomingEventsExist = false;
      } else {
        upcomingEventsExist = true;
      }
      return upcomingEventsExist ? (
        dashboardData[2]?.map((event) => {
          let dateText = upcomingEventDateText(event.deadlineDate);
          return (
            <div className="upcomingEventWrap" key={event.id}>
              <div className="upcomingEventDate">
                <span>{dateText} </span>
                <span>{event.hours}</span>
              </div>
              <div className="upcomingEventTitle">
                <span>{event.title}</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="upcomingEventWrap">
          <span>There are no upcoming events</span>
        </div>
      );
    };

    return (
      <div className="topPanelWrap">
        <div className="topPanelDataRangeBox">
          <h3>Welcome To ONE-PLACE</h3>
        </div>

        <div className="topPanelData">

          <div className="topPanelDataBox">
            <div className="topPanelDataIcon">
              <SupervisorAccountRoundedIcon />
            </div>

            <div className="topPanelDataSummary">
              <p>New clients</p>
              <h3 className="maincolor topPanelDataText">

              </h3>
            </div>

            <div className="topPanelSeperator"></div>
            <div>
              <span className="topPanelBottomText">
                <Link to="/clients" className="maincolor">
                  + Add new client
                </Link>
              </span>
            </div>
          </div>

          <div className="topPanelDataBox">
            <div className="topPanelDataIcon topPanelHeaderInline">
              <ContentPasteRoundedIcon />
              <span>Upcoming events</span>
            </div>

            <UpcomingEvents />

            <div className="topPanelSeperator"></div>
            <div>
              <span className="topPanelBottomText">
                <Link to="/calendar" className="maincolor">
                  See more events
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bodyWrap dashboardPage">
      <TopPanel />
    </div>
  );
}

export default Homepage;
