/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

//  require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require("./components/Routers");

import ReactDOM from "react-dom";
import Adhesion from "./components/Adhesion";
import DepotEspece from "./components/DepotEspece";
import RetraitEspece from "./components/RetraitEspece";
import Positionnement from "./components/Positionnement";
import Approvisionnement from "./components/Approvisionnement";
import Delestage from "./components/Delestage";
import EntreeTresor from "./components/EntreeTresor";
import SoldePage from "./components/SoldePage";
import RepertoireCaisse from "./components/RepertoireCaisse";
import JournalCaisse from "./components/JournalCaisse";
import SuiviCredit from "./components/SuiviCredit";
import RapportCredit from "./components/RapportCredit";
import Postage from "./components/Postage";
import Tfr from "./components/Tfr";
import Crediteur from "./components/Crediteur";
import Debiteur from "./components/Debiteur";
import PayementAgent from "./components/PayementAgent";
import Comptabilite from "./components/Comptabilite";
import SommaireCompte from "./components/SommaireCompte";
import Users from "./components/Users";
import RemboursementAttendu from "./components/RemboursementAttendu";
// import Routers from "./components/Routers";
import SMSbanking from "./components/SMSbanking";
import PrintRecuRetrait from "./components/PrintRecuRetrait";
import PrintRecuDepot from "./components/PrintRecuDepot";
// import { Router } from "react-router-dom";
if (document.getElementById("adhesionContainer")) {
    ReactDOM.render(<Adhesion />, document.getElementById("adhesionContainer"));
} else if (document.getElementById("DepotEspeceContainer")) {
    ReactDOM.render(
        <DepotEspece />,
        document.getElementById("DepotEspeceContainer")
    );
} else if (document.getElementById("RetraitEspeceContainer")) {
    ReactDOM.render(
        <RetraitEspece />,
        document.getElementById("RetraitEspeceContainer")
    );
} else if (document.getElementById("positionnementContainer")) {
    ReactDOM.render(
        <Positionnement />,
        document.getElementById("positionnementContainer")
    );
} else if (document.getElementById("ApprovisionnementContainer")) {
    ReactDOM.render(
        <Approvisionnement />,
        document.getElementById("ApprovisionnementContainer")
    );
} else if (document.getElementById("DelestageContainer")) {
    ReactDOM.render(
        <Delestage />,
        document.getElementById("DelestageContainer")
    );
} else if (document.getElementById("EntreeTresorContainer")) {
    ReactDOM.render(
        <EntreeTresor />,
        document.getElementById("EntreeTresorContainer")
    );
} else if (document.getElementById("soldeContainer")) {
    ReactDOM.render(<SoldePage />, document.getElementById("soldeContainer"));
} else if (document.getElementById("repertoireContainer")) {
    ReactDOM.render(
        <RepertoireCaisse />,
        document.getElementById("repertoireContainer")
    );
} else if (document.getElementById("journalContainer")) {
    ReactDOM.render(
        <JournalCaisse />,
        document.getElementById("journalContainer")
    );
} else if (document.getElementById("suiviCreditContainer")) {
    const suiviCreditContainer = document.querySelector(
        "#suiviCreditContainer"
    );
    const user = suiviCreditContainer.dataset.user;
    console.log(user);
    ReactDOM.render(
        <SuiviCredit NomUtilisateur={user} />,
        document.getElementById("suiviCreditContainer")
    );
} else if (document.getElementById("rapportCreditContainer")) {
    ReactDOM.render(
        <RapportCredit />,
        document.getElementById("rapportCreditContainer")
    );
} else if (document.getElementById("postageContainer")) {
    ReactDOM.render(<Postage />, document.getElementById("postageContainer"));
} else if (document.getElementById("tfrContainer")) {
    ReactDOM.render(<Tfr />, document.getElementById("tfrContainer"));
} else if (document.getElementById("CrediteurContainer")) {
    ReactDOM.render(
        <Crediteur />,
        document.getElementById("CrediteurContainer")
    );
} else if (document.getElementById("DebiteurContainer")) {
    ReactDOM.render(<Debiteur />, document.getElementById("DebiteurContainer"));
} else if (document.getElementById("PayementAgentContainer")) {
    ReactDOM.render(
        <PayementAgent />,
        document.getElementById("PayementAgentContainer")
    );
} else if (document.getElementById("comptabiliteContainer")) {
    ReactDOM.render(
        <Comptabilite />,
        document.getElementById("comptabiliteContainer")
    );
} else if (document.getElementById("sommaireContainer")) {
    ReactDOM.render(
        <SommaireCompte />,
        document.getElementById("sommaireContainer")
    );
} else if (document.getElementById("usersContainer")) {
    ReactDOM.render(<Users />, document.getElementById("usersContainer"));
} else if (document.getElementById("remboursementAttenduContainer")) {
    ReactDOM.render(
        <RemboursementAttendu />,
        document.getElementById("remboursementAttenduContainer")
    );
} else if (document.getElementById("smsBankingContainer")) {
    ReactDOM.render(
        <SMSbanking />,
        document.getElementById("smsBankingContainer")
    );
} else if (document.getElementById("recuRetraitContainer")) {
    ReactDOM.render(
        <PrintRecuRetrait />,
        document.getElementById("recuRetraitContainer")
    );
} else if (document.getElementById("recuDepotContainer")) {
    ReactDOM.render(
        <PrintRecuDepot />,
        document.getElementById("recuDepotContainer")
    );
}
