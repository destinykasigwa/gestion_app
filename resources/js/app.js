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

import ReactDOM from "react-dom";
import Adhesion from "./components/Adhesion";
import DepotEspece from "./components/DepotEspece";
import RetraitEspece from "./components/RetraitEspece";
import Positionnement from "./components/Positionnement";
import Approvisionnement from "./components/Approvisionnement";
import Delestage from "./components/Delestage";
import EntreeTresor from "./components/EntreeTresor";
import SoldePage from "./components/SoldePage";

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
}
