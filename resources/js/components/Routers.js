import React from "react";
// import { Link, NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UpdateSMSBankingUser from "./Modals/UpdateSMSBankingUser";
import SMSbanking from "./SMSbanking";

export default function Routers() {
    return (
        <Router>
            <Route
                path="/sms-banking/edit-user/:id"
                element={UpdateSMSBankingUser}
            />
        </Router>
    );
}
