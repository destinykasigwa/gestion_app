import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./EnteteRapport";
import "../../css/app.css";

export default class RapportCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            getData: null,
            fetchEcheancier: [],
            fetchTableauAmortiss: [],
            fetchBalanceAgee: [],
            fetchSommeInteret: null,
            Echeancier: "",
            Monnaie: "",
            dateToSearch: "",
            // dataToSearch1: "",
            // dataToSearch2: "",
            NumCompteEpargne: "",
            NumCompteCredit: "",
            NumDossier: "",
            fetchSoldeEncourCDF: null,
            fetchSoldeEncourUSD: null,
            fetchTotCapRetardCDF: null,
            fetchTotCapRetardUSD: null,
            userInfo: null,
        };
        this.actualiser = this.actualiser.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getEcheancier = this.getEcheancier.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getBalanceAge = this.getBalanceAge.bind(this);
        this.PrintEcheancier = this.PrintEcheancier.bind(this);
        this.getTableauAmmort = this.getTableauAmmort.bind(this);
        this.PrintTableauAmmo = this.PrintTableauAmmo.bind(this);
        this.reportCredit = this.reportCredit.bind(this);

        // this.PrintTableauBalanceAgee=this.PrintTableauBalanceAgee.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        this.fetchData();
        this.getUserInfo();
    }

    //get data in input
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    getUserInfo = async () => {
        const UserInfo = await axios.get("users/getUserInfo");
        this.setState({
            userInfo: UserInfo.data.Role,
        });
    };

    fetchData = async () => {
        const res = await axios.get("/rapport/data");
        if (res.data.success == 1) {
            this.setState({ getData: res.data.data });
        }
        console.log(this.state.getData);
    };

    getEcheancier = async (e) => {
        if (e.target.checked) {
            this.setState({ isloading: true });
            const res = await axios.post("/rapport/echeancier", this.state);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Affichange echeancier !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });

                this.setState({
                    isloading: false,
                    fetchEcheancier: res.data.data,
                    fetchSommeInteret: res.data.sommeInteret,
                });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Affichange echeancier !",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
        }
        console.log(this.state.fetchEcheancier);
    };

    getTableauAmmort = async (e) => {
        if (e.target.checked) {
            this.setState({ isloading: true });
            const res = await axios.post(
                "/rapport/tableau-ammortisement",
                this.state
            );
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Affichange tableau Ammortissement  !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });

                this.setState({
                    isloading: false,
                    fetchTableauAmortiss: res.data.data,
                    fetchSommeInteret: res.data.sommeInteret,
                });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Affichange Tableau d'Ammortissement !",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
            console.log(this.state.fetchTableauAmortiss);
        }
    };

    getBalanceAge = async (e) => {
        if (e.target.checked) {
            this.setState({ isloading: true });
            const res = await axios.post("/rapport/balance-agee", this.state);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Affichange Balance Agée !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });

                this.setState({
                    isloading: false,
                    fetchBalanceAgee: res.data.data,
                    fetchSoldeEncourCDF: res.data.soldeEncourCDF,
                    fetchSoldeEncourUSD: res.data.soldeEncourUSD,
                    fetchTotCapRetardCDF: res.data.totRetardCDF,
                    fetchTotCapRetardUSD: res.data.totRetardUSD,
                });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Affichange echeancier !",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
        }
    };

    PrintEcheancier(e) {
        e.preventDefault();
        const printableElements =
            document.getElementById("printmeEcheancier").innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
    }

    PrintTableauAmmo(e) {
        e.preventDefault();
        const printableElements = document.getElementById(
            "print-tableau-ammortis"
        ).innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
    }

    //to refresh
    actualiser() {
        location.reload();
    }

    reportCredit(e) {
        e.preventDefault();
        window.location = "/suivicredit";
    }
    render() {
        let myspinner = {
            margin: "5px auto",
            width: "3rem",
            height: "3rem",
            marginTop: "180px",
            border: "0px",
            height: "200px",
        };
        let compteur = 0;

        const dateParser = (num) => {
            const options = {
                // weekday: "long",
                year: "numeric",
                month: "numeric",
                day: "numeric",
            };

            let timestamp = Date.parse(num);

            let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

            return date.toString();
        };
        //PERMET DE FORMATER LES CHIFFRES
        const numberFormat = (number = 0) => {
            let locales = [
                //undefined,  // Your own browser
                "en-US", // United States
                //'de-DE',    // Germany
                //'ru-RU',    // Russia
                //'hi-IN',    // India
            ];
            let opts = { minimumFractionDigits: 2 };
            let index = 3;
            let nombre = number.toLocaleString(locales[index], opts);
            if (nombre === isNaN) {
                nombre = 0.0;
            } else {
                return nombre;
            }
        };
        return (
            <React.Fragment>
                {this.state.isloading ? (
                    <div className="row" id="rowspinner">
                        <div className="myspinner" style={myspinner}>
                            <span
                                className="spinner-border"
                                role="status"
                            ></span>
                            <span style={{ marginLeft: "-20px" }}>
                                Chargement...
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-12 card">
                            <div className="card card-default">
                                <div
                                    className="card-header"
                                    style={{
                                        background: "#DCDCDC",
                                        textAlign: "center",
                                        color: "#fff",
                                        marginTop: "5px",
                                    }}
                                >
                                    <button
                                        style={{
                                            height: "30px",
                                            float: "right",
                                            background: "green",
                                            border: "0px",
                                            padding: "3px",
                                            marginLeft: "5px",
                                        }}
                                        onClick={this.actualiser}
                                    >
                                        <i className="fas fa-sync"></i>{" "}
                                        Actualiser{" "}
                                    </button>
                                    <button
                                        style={{
                                            height: "30px",
                                            float: "right",
                                            border: "0px",
                                            padding: "3px",
                                            marginLeft: "5px",
                                        }}
                                        className="btn btn-primary"
                                        onClick={this.reportCredit}
                                    >
                                        <i className="fas fa-eye"></i> Suivi
                                        crédit{" "}
                                    </button>
                                </div>

                                <div
                                    className="card-body"
                                    style={{ background: "#dcdcdc" }}
                                >
                                    <div
                                        className="row"
                                        style={{
                                            padding: "10px",
                                            border: "2px solid #fff",
                                        }}
                                    >
                                        <div
                                            className="card-body"
                                            style={{ background: "#dcdcdc" }}
                                        >
                                            <form method="POST">
                                                <div className="row">
                                                    <div
                                                        className="col-md-3"
                                                        style={{
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            padding: "20px",
                                                            margin: "4px",
                                                        }}
                                                    >
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    {this.state
                                                                        .userInfo ==
                                                                        1 && (
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                style={{
                                                                                    border: "0px",
                                                                                }}
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="N° Dossier"
                                                                                name="NumDossier"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .NumDossier
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleChange
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    {this.state
                                                                        .userInfo ==
                                                                        1 && (
                                                                        <div className="input-group input-group-sm mt-1">
                                                                            <input
                                                                                style={{
                                                                                    border: "0px",
                                                                                    height: "30px",
                                                                                }}
                                                                                type="date"
                                                                                name="dateToSearch"
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    this.setState(
                                                                                        {
                                                                                            dateToSearch:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className="input-group input-group-sm mt-1">
                                                                        <select
                                                                            style={{
                                                                                border: "0px",
                                                                                height: "30px",
                                                                            }}
                                                                            name="Monnaie"
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                this.setState(
                                                                                    {
                                                                                        Monnaie:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="CDF">
                                                                                CDF{" "}
                                                                            </option>
                                                                            <option value="USD">
                                                                                USD{" "}
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="flexRadioDefault"
                                                                            id="flexRadioDefault1"
                                                                            onChange={
                                                                                this
                                                                                    .getEcheancier
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Echeancier
                                                                            }
                                                                        />
                                                                        <label
                                                                            class="form-check-label"
                                                                            for="flexRadioDefault1"
                                                                        >
                                                                            {" "}
                                                                            Echéancier
                                                                            simple{" "}
                                                                        </label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input
                                                                            class="form-check-input"
                                                                            type="radio"
                                                                            name="flexRadioDefault"
                                                                            id="flexRadioDefault2"
                                                                            onChange={
                                                                                this
                                                                                    .getTableauAmmort
                                                                            }
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            for="flexRadioDefault2"
                                                                        >
                                                                            {" "}
                                                                            Tableau
                                                                            d'amortissement
                                                                        </label>
                                                                    </div>
                                                                    {this.state
                                                                        .userInfo ==
                                                                        1 && (
                                                                        <>
                                                                            <div class="form-check">
                                                                                <input
                                                                                    class="form-check-input"
                                                                                    type="radio"
                                                                                    name="flexRadioDefault"
                                                                                    id="flexRadioDefault3"
                                                                                    onChange={
                                                                                        this
                                                                                            .getBalanceAge
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    className="form-check-label"
                                                                                    for="flexRadioDefault3"
                                                                                >
                                                                                    {" "}
                                                                                    Balance
                                                                                    Agée
                                                                                </label>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td>
                                                                    <button
                                                                        type="submit"
                                                                        name="submitLiberation"
                                                                        style={{
                                                                            padding:
                                                                                "6px",
                                                                            color: "#fff",
                                                                            fontWeight:
                                                                                "bold",
                                                                            background:
                                                                                " rgb(20,40,100)",
                                                                            border: "0px",
                                                                        }}
                                                                        className="btn "
                                                                        onClick={
                                                                            this
                                                                                .despalyEcheancier
                                                                        }
                                                                    >
                                                                        <i className="fas fa-desktop"></i>{" "}
                                                                        Afficher
                                                                    </button>
                                                                </td>
                                                            </tr> */}
                                                        </table>
                                                    </div>

                                                    <div className="col-md-9">
                                                        <ul
                                                            className="nav nav-tabs"
                                                            id="myTab"
                                                            role="tablist"
                                                        >
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link active"
                                                                    id="home-tab"
                                                                    data-toggle="tab"
                                                                    href="#home"
                                                                    role="tab"
                                                                    aria-controls="home"
                                                                    aria-selected="true"
                                                                >
                                                                    Recherche
                                                                    par num
                                                                    Dossier
                                                                </a>
                                                            </li>
                                                            {this.state
                                                                .userInfo ==
                                                                1 && (
                                                                <>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            className="nav-link"
                                                                            id="profile-tab"
                                                                            data-toggle="tab"
                                                                            href="#profile"
                                                                            role="tab"
                                                                            aria-controls="profile"
                                                                            aria-selected="false"
                                                                        >
                                                                            Recherche
                                                                            par
                                                                            num
                                                                            compte
                                                                            Crédit
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            className="nav-link"
                                                                            id="contact-tab"
                                                                            data-toggle="tab"
                                                                            href="#contact"
                                                                            role="tab"
                                                                            aria-controls="contact"
                                                                            aria-selected="false"
                                                                        >
                                                                            Recherche
                                                                            par
                                                                            num
                                                                            compte
                                                                            Epargne
                                                                        </a>
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                        {this.state.getData && (
                                                            <div
                                                                className="tab-content"
                                                                id="myTabContent"
                                                            >
                                                                <div
                                                                    className="tab-pane fade show active mt-2"
                                                                    id="home"
                                                                    role="tabpanel"
                                                                    aria-labelledby="home-tab"
                                                                >
                                                                    <table>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    list="NumDossier"
                                                                                    name="NumDossier"
                                                                                    style={{
                                                                                        height: "37px",
                                                                                        borderRadius:
                                                                                            " 0px",
                                                                                        border: "0px",
                                                                                        border: "2px solid green",
                                                                                    }}
                                                                                    required="required"
                                                                                    autofocus="autofocus"
                                                                                    placeholder="Saisir num de doss..."
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .NumDossier
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                                <datalist id="NumDossier">
                                                                                    {this.state.getData.map(
                                                                                        (
                                                                                            data
                                                                                        ) => {
                                                                                            return (
                                                                                                <option
                                                                                                    value={
                                                                                                        data.NumDossier
                                                                                                    }
                                                                                                />
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </datalist>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                                <div
                                                                    className="tab-pane fade mt-2"
                                                                    id="profile"
                                                                    role="tabpanel"
                                                                    aria-labelledby="profile-tab"
                                                                >
                                                                    <table>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    list="NumCompteCredit"
                                                                                    name="NumCompteCredit"
                                                                                    style={{
                                                                                        height: "37px",
                                                                                        borderRadius:
                                                                                            " 0px",
                                                                                        border: "3px",
                                                                                        border: "2px solid #000",
                                                                                    }}
                                                                                    required="required"
                                                                                    autofocus="autofocus"
                                                                                    placeholder="Saisir compte..."
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .NumCompteCredit
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                                <datalist id="NumCompteCredit">
                                                                                    {this.state.getData.map(
                                                                                        (
                                                                                            data
                                                                                        ) => {
                                                                                            return (
                                                                                                <option
                                                                                                    value={
                                                                                                        data.NumCompteCredit
                                                                                                    }
                                                                                                />
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </datalist>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                                <div
                                                                    className="tab-pane fade mt-2"
                                                                    id="contact"
                                                                    role="tabpanel"
                                                                    aria-labelledby="contact-tab"
                                                                >
                                                                    <table>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    list="NumCompteEpargne"
                                                                                    name="NumCompteEpargne"
                                                                                    style={{
                                                                                        height: "37px",
                                                                                        borderRadius:
                                                                                            " 0px",
                                                                                        border: "0px",
                                                                                        border: "2px solid orange",
                                                                                    }}
                                                                                    required="required"
                                                                                    autofocus="autofocus"
                                                                                    placeholder="Saisir un compte..."
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .NumCompteEpargne
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                                <datalist id="NumCompteEpargne">
                                                                                    {this.state.getData.map(
                                                                                        (
                                                                                            data
                                                                                        ) => {
                                                                                            return (
                                                                                                <option
                                                                                                    value={
                                                                                                        data.NumCompteEpargne
                                                                                                    }
                                                                                                />
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </datalist>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {this.state.fetchEcheancier.length != 0 && (
                                    <React.Fragment>
                                        <hr class="solid" />
                                        <div
                                            className="row"
                                            id="printmeEcheancier"
                                        >
                                            <div
                                                className="card"
                                                style={{
                                                    margin: "0 auto",
                                                    width: "90%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "90%",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    <EnteteRapport />
                                                </div>

                                                <div
                                                    className="row title-echeancier"
                                                    style={{
                                                        margin: "0px auto",
                                                        marginTop: "50px",
                                                    }}
                                                >
                                                    {" "}
                                                    <h4
                                                        style={{
                                                            background: "#444",
                                                            padding: "5px",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        ECHEANCIER DE
                                                        REMBOURSEMENT
                                                    </h4>{" "}
                                                </div>

                                                <div
                                                    class="card-body"
                                                    style={{
                                                        marginLeft: "50px",
                                                        marginRight: "50px",
                                                        marginTop: "50px",
                                                    }}
                                                >
                                                    <div
                                                        className="row entente-container"
                                                        style={{
                                                            width: "100%",
                                                            margin: "0px auto",
                                                            background: "#fff",
                                                            padding: "5px",
                                                            color: "#000",
                                                            border: "3px solid #444",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    >
                                                        <div className="col-md-4">
                                                            <table
                                                            // className="myhead-table"
                                                            >
                                                                <tr>
                                                                    <td>
                                                                        Intitilé
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .NomCompte
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        C.
                                                                        epargne
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .NumCompteEpargne
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Type
                                                                        crédit :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .RefTypeCredit
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Durée :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .Duree
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Montant
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .MontantAccorde
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        N°
                                                                        Dossier
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .NumDossier
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <table
                                                            // className="myhead-table"
                                                            >
                                                                <tr>
                                                                    <td>
                                                                        N°
                                                                        Crédit :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .NumDemande
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Date
                                                                        octroi :
                                                                    </td>
                                                                    <td>
                                                                        {dateParser(
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .DateOctroi
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        C.
                                                                        crédit :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .NumCompteCredit
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Total
                                                                        intérêt
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchSommeInteret
                                                                                    .sommeInteret
                                                                            )
                                                                            // +
                                                                            //     parseInt(
                                                                            //         this
                                                                            //             .state
                                                                            //             .fetchEcheancier[0]
                                                                            //             .InteretPrecompte
                                                                            //     )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Total
                                                                        Capital
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchEcheancier[0]
                                                                                    .MontantAccorde
                                                                            )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Total à
                                                                        payer :
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            fontSize:
                                                                                "20px",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            // parseInt(
                                                                            //     this
                                                                            //         .state
                                                                            //         .fetchEcheancier[0]
                                                                            //         .InteretPrecompte
                                                                            // ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchEcheancier[0]
                                                                                    .MontantAccorde
                                                                            ) +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSommeInteret
                                                                                        .sommeInteret
                                                                                )
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* <tr>
                                                                    <td>
                                                                        Intérêt
                                                                        prec.
                                                                    </td>
                                                                    <td>
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchEcheancier[0]
                                                                                .InteretPrecompte
                                                                        )}
                                                                    </td>
                                                                </tr> */}
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <table
                                                        className="table tableStyle"
                                                        style={{
                                                            padding: "5px",
                                                            width: "100%",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">
                                                                    N°
                                                                </th>
                                                                <th scope="col">
                                                                    Date
                                                                    D'échéance
                                                                </th>
                                                                <th scope="col">
                                                                    Capital
                                                                </th>
                                                                <th scope="col">
                                                                    Intêret
                                                                </th>
                                                                <th scope="col">
                                                                    C. Ammorti
                                                                </th>
                                                                <th scope="col">
                                                                    Tot à payer
                                                                </th>
                                                                <th scope="col">
                                                                    C. restant
                                                                    dû
                                                                </th>
                                                                <th scope="col">
                                                                    Epargne
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.fetchEcheancier.map(
                                                                (
                                                                    res,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {/* <th scope="row">1</th> */}
                                                                            <td>
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {dateParser(
                                                                                    res.DateTranch
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.Capital
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.Interet
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.CapAmmorti
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.TotalAp
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.Cumul
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        res.Epargne
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div
                                                    className="row signature-container"
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "90%",
                                                        marginTop: "100px",
                                                    }}
                                                >
                                                    <div className="col-md-8">
                                                        <h4>
                                                            Signature client
                                                        </h4>
                                                    </div>
                                                    <div className="col-md-4 signature-container">
                                                        <h4
                                                            style={{
                                                                float: "right",
                                                            }}
                                                        >
                                                            Signature agent de
                                                            crédit
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                            <div className="col-md-6"></div>
                                            <div className="col-md-6">
                                                <span>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-file-excel"></i>{" "}
                                                        Exporter
                                                    </button>{" "}
                                                    {""}
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-file-word"></i>{" "}
                                                        Export
                                                    </button>{" "}
                                                    <button
                                                        onClick={
                                                            this.PrintEcheancier
                                                        }
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-print"></i>{" "}
                                                        Imprimer
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                                {/* TABLEAU D'AMMORTISSEMENT */}
                                {this.state.fetchTableauAmortiss.length !=
                                    0 && (
                                    <React.Fragment>
                                        <hr class="solid" />
                                        <div
                                            className="row"
                                            id="print-tableau-ammortis"
                                        >
                                            <div
                                                className="card"
                                                style={{
                                                    margin: "5px",
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "90%",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    <EnteteRapport />
                                                </div>
                                                <div
                                                    className="row title-echeancier"
                                                    style={{
                                                        margin: "0px auto",
                                                        marginTop: "50px",
                                                    }}
                                                >
                                                    {" "}
                                                    <h4
                                                        style={{
                                                            background: "#444",
                                                            padding: "5px",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        TABLEAU D'AMMORTISSEMENT
                                                        DE CREDIT AU{" "}
                                                        {dateParser(new Date())}
                                                    </h4>{" "}
                                                </div>

                                                <div
                                                    class="card-body"
                                                    style={{
                                                        marginLeft: "1px",
                                                        marginRight: "5px",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    <div
                                                        className="row m-0 entente-container"
                                                        style={{
                                                            width: "100%",
                                                            margin: "0px auto",
                                                            background: "#fff",
                                                            padding: "5px",
                                                            color: "#000",
                                                            border: "3px solid #444",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    >
                                                        <div className="col-md-3">
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        Type
                                                                        crédit :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .RefTypeCredit
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        N°
                                                                        COMPTE :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .NumCompteEpargne
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Intutilé
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .NomCompte
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Mode
                                                                        remb. :{" "}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .ModeRemboursement
                                                                        }
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>
                                                                        Mode
                                                                        remb. :{" "}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .ModeRemboursement
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Gestionnaire
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .Gestionnaire
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        Durée en
                                                                        jour :{" "}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .Duree
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Nbre
                                                                        tranche
                                                                        :{" "}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .NbrTranche
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Date
                                                                        Octroi :
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {dateParser(
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .DateOctroi
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Date
                                                                        Echéance
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {dateParser(
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .DateTombeEcheance
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        NumDossier
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .NumDossier
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        Type
                                                                        Mensualité
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        <td>
                                                                            {" "}
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .fetchTableauAmortiss[0]
                                                                                    .ModeRemboursement
                                                                            }
                                                                        </td>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Taux
                                                                        d'intérêt
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        <td>
                                                                            {" "}
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .fetchTableauAmortiss[0]
                                                                                    .TauxInteret
                                                                            }
                                                                        </td>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Intérêt
                                                                        remboursé
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        <td>
                                                                            {" "}
                                                                            {isNaN(
                                                                                numberFormat(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSommeInteret
                                                                                            .sommeInteret
                                                                                    )
                                                                                )
                                                                            )
                                                                                ? "0.00"
                                                                                : numberFormat(
                                                                                      parseInt(
                                                                                          this
                                                                                              .state
                                                                                              .fetchSommeInteret
                                                                                              .sommeInteret
                                                                                      )
                                                                                  )}
                                                                        </td>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Intérêt
                                                                        en
                                                                        Retard :
                                                                    </td>
                                                                    {
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchTableauAmortiss[0]
                                                                                        .InteretRetardEchu
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        Montant
                                                                        Accordé
                                                                        :
                                                                    </td>

                                                                    <td>
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchTableauAmortiss[0]
                                                                                    .MontantAccorde
                                                                            )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Capital
                                                                        Remboursé
                                                                        :
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {isNaN(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchTableauAmortiss[0]
                                                                                    .RemboursCapital
                                                                            )
                                                                        )
                                                                            ? "0.00"
                                                                            : numberFormat(
                                                                                  parseInt(
                                                                                      this
                                                                                          .state
                                                                                          .fetchTableauAmortiss[0]
                                                                                          .RemboursCapital
                                                                                  )
                                                                              )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Capital
                                                                        Restant
                                                                        dû :
                                                                    </td>
                                                                    <td>
                                                                        {isNaN(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchTableauAmortiss[0]
                                                                                    .MontantAccorde
                                                                            ) -
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchTableauAmortiss[0]
                                                                                        .RemboursCapital
                                                                                )
                                                                        )
                                                                            ? "0.00"
                                                                            : numberFormat(
                                                                                  parseInt(
                                                                                      this
                                                                                          .state
                                                                                          .fetchTableauAmortiss[0]
                                                                                          .MontantAccorde
                                                                                  ) -
                                                                                      parseInt(
                                                                                          this
                                                                                              .state
                                                                                              .fetchTableauAmortiss[0]
                                                                                              .RemboursCapital
                                                                                      )
                                                                              )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Capital
                                                                        en
                                                                        Retard :
                                                                    </td>
                                                                    {numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchTableauAmortiss[0]
                                                                                .CapitalRetard
                                                                        )
                                                                    )}
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <table
                                                        className="table tableStyle"
                                                        style={{
                                                            padding: "5px",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        <tr>
                                                            <td rowspan="2">
                                                                N°
                                                            </td>
                                                            <td rowspan="2">
                                                                Date Tranche
                                                            </td>
                                                            <td colspan="4">
                                                                ECHEANCIER
                                                                PREVISIONNEL
                                                            </td>
                                                            <td colspan="3">
                                                                REMBOURS.
                                                                EFFECTIFS
                                                            </td>
                                                            <td colspan="3">
                                                                REMBOURS. EN
                                                                RETARD
                                                            </td>
                                                            <td rowspan="2">
                                                                TOT. EN RETARD
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Capital</td>
                                                            <td>Intérêt</td>
                                                            <td>Epargne</td>
                                                            <td>Pénalités</td>
                                                            <td>Capital</td>
                                                            <td>Intérêt</td>
                                                            <td>Epargne</td>
                                                            <td>Capital</td>
                                                            <td>Intérêt</td>
                                                            <td>Epargne</td>
                                                        </tr>
                                                        {this.state.fetchTableauAmortiss.map(
                                                            (res, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            {
                                                                                compteur++
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {" "}
                                                                            {dateParser(
                                                                                res.DateTranch
                                                                            )}{" "}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.CapAmmorti
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.Interet
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.Epargne
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.Penalite
                                                                                )
                                                                            )}
                                                                        </td>

                                                                        {parseInt(
                                                                            res.CapitalPaye
                                                                        ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.CapitalPaye
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.CapitalPaye
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {isNaN(
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            res.CapitalPaye
                                                                                        )
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.CapitalPaye
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                        )}
                                                                        {parseInt(
                                                                            res.InteretPaye
                                                                        ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.InteretPaye
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.InteretPaye
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.InteretPaye
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : parseInt(
                                                                                          res.InteretPaye
                                                                                      )}
                                                                            </td>
                                                                        )}
                                                                        {parseInt(
                                                                            res.EpargnePaye
                                                                        ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.EpargnePaye
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.EpargnePaye
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.EpargnePaye
                                                                                    )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.EpargnePaye
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                        )}
                                                                        {parseInt(
                                                                            res.CapAmmorti
                                                                        ) -
                                                                            parseInt(
                                                                                res.CapitalPaye
                                                                            ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "red",
                                                                                    color: "#fff",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.CapAmmorti
                                                                                    ) -
                                                                                        parseInt(
                                                                                            res.CapitalPaye
                                                                                        )
                                                                                )
                                                                                    ? " 0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.CapAmmorti
                                                                                          ) -
                                                                                              parseInt(
                                                                                                  res.CapitalPaye
                                                                                              )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {
                                                                                    "0.00"
                                                                                }
                                                                            </td>
                                                                        )}
                                                                        {parseInt(
                                                                            res.Interet
                                                                        ) -
                                                                            parseInt(
                                                                                res.InteretPaye
                                                                            ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "red",
                                                                                    color: "#fff",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.Interet
                                                                                    ) -
                                                                                        parseInt(
                                                                                            res.InteretPaye
                                                                                        )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.Interet
                                                                                          ) -
                                                                                              parseInt(
                                                                                                  res.InteretPaye
                                                                                              )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {
                                                                                    "0.00"
                                                                                }
                                                                            </td>
                                                                        )}

                                                                        {parseInt(
                                                                            res.Epargne
                                                                        ) -
                                                                            parseInt(
                                                                                res.EpargnePaye
                                                                            ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "red",
                                                                                    color: "#fff",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.Epargne
                                                                                    ) -
                                                                                        parseInt(
                                                                                            res.EpargnePaye
                                                                                        )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.Epargne
                                                                                          ) -
                                                                                              parseInt(
                                                                                                  res.EpargnePaye
                                                                                              )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {
                                                                                    "0.00"
                                                                                }
                                                                            </td>
                                                                        )}

                                                                        {parseInt(
                                                                            res.CapAmmorti
                                                                        ) -
                                                                            parseInt(
                                                                                res.CapitalPaye
                                                                            ) +
                                                                            parseInt(
                                                                                res.Interet
                                                                            ) -
                                                                            parseInt(
                                                                                res.InteretPaye
                                                                            ) +
                                                                            parseInt(
                                                                                res.Epargne
                                                                            ) -
                                                                            parseInt(
                                                                                res.EpargnePaye
                                                                            ) >
                                                                        0 ? (
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "red",
                                                                                    color: "#fff",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        res.CapAmmorti
                                                                                    ) -
                                                                                        parseInt(
                                                                                            res.CapitalPaye
                                                                                        ) +
                                                                                        parseInt(
                                                                                            res.Interet
                                                                                        ) -
                                                                                        parseInt(
                                                                                            res.InteretPaye
                                                                                        ) +
                                                                                        parseInt(
                                                                                            res.Epargne
                                                                                        ) -
                                                                                        parseInt(
                                                                                            res.EpargnePaye
                                                                                        )
                                                                                )
                                                                                    ? "0.00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              res.CapAmmorti
                                                                                          ) -
                                                                                              parseInt(
                                                                                                  res.CapitalPaye
                                                                                              ) +
                                                                                              parseInt(
                                                                                                  res.Interet
                                                                                              ) -
                                                                                              parseInt(
                                                                                                  res.InteretPaye
                                                                                              ) +
                                                                                              parseInt(
                                                                                                  res.Epargne
                                                                                              ) -
                                                                                              parseInt(
                                                                                                  res.EpargnePaye
                                                                                              )
                                                                                      )}
                                                                            </td>
                                                                        ) : (
                                                                            <td>
                                                                                {
                                                                                    "0.00"
                                                                                }
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                            <div className="col-md-6"></div>
                                            <div className="col-md-6">
                                                <span>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-file-excel"></i>{" "}
                                                        Exporter
                                                    </button>{" "}
                                                    {""}
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-file-word"></i>{" "}
                                                        Export
                                                    </button>{" "}
                                                    <button
                                                        onClick={
                                                            this
                                                                .PrintTableauAmmo
                                                        }
                                                        type="submit"
                                                        className="btn btn-success"
                                                    >
                                                        <i className="fas fa-print"></i>{" "}
                                                        Imprimer
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                                {/* BALANCE AGEE */}
                                {this.state.fetchBalanceAgee.length != 0 && (
                                    <React.Fragment>
                                        <hr class="solid" />
                                        <div
                                            className="row"
                                            id="print-tableau-ammortis"
                                        >
                                            <div
                                                className="card"
                                                style={{
                                                    margin: "5px",
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "90%",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    <EnteteRapport />
                                                </div>
                                                <div
                                                    className="row title-echeancier"
                                                    style={{
                                                        margin: "0px auto",
                                                        marginTop: "50px",
                                                    }}
                                                >
                                                    {" "}
                                                    <h4
                                                        style={{
                                                            background: "#444",
                                                            padding: "5px",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        BALANCE AGEE EN{" "}
                                                        {this.state.Monnaie}{" "}
                                                        AFFICHEE EN DATE DU{" "}
                                                        {dateParser(new Date())}
                                                    </h4>{" "}
                                                </div>
                                            </div>

                                            <div
                                                class="card-body"
                                                style={{
                                                    marginLeft: "1px",
                                                    marginRight: "5px",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                <table
                                                    className="tableStyle"
                                                    style={{
                                                        background: "#444",
                                                        padding: "5px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <td rowspan="2">
                                                                N°
                                                            </td>
                                                            <td rowspan="2">
                                                                Num Dmnde
                                                            </td>
                                                            <td rowspan="2">
                                                                Num
                                                            </td>
                                                            <td rowspan="2">
                                                                NomCompte
                                                            </td>
                                                            <td rowspan="2">
                                                                Durée
                                                            </td>
                                                            <td rowspan="2">
                                                                Date Octroi
                                                            </td>
                                                            <td rowspan="2">
                                                                Accordé
                                                            </td>
                                                            <td colspan="2">
                                                                Remboursé
                                                            </td>
                                                            <td colspan="2">
                                                                Restant dû
                                                            </td>
                                                            <td colspan="5">
                                                                En retard En
                                                                Jours
                                                            </td>
                                                            {/* <td rowspan="2">
                                                            Epargne
                                                        </td>
                                                        <td rowspan="2">
                                                            Date Retard
                                                        </td> */}
                                                            <td rowspan="2">
                                                                Jour de Retard
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Capital</td>
                                                            {/* <td>Intérêt</td> */}
                                                            <td>Intérêt</td>
                                                            <td>Capital</td>
                                                            <td>Intérêt</td>
                                                            {/* <td>Intéret</td> */}
                                                            <td>1 à 30</td>
                                                            <td>31 à 60</td>
                                                            <td>61 à 90</td>
                                                            <td>91 à 180</td>
                                                            <td>Plus de 180</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchBalanceAgee
                                                            .length != 0 &&
                                                            this.state.fetchBalanceAgee.map(
                                                                (
                                                                    res,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NumDemande
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NumCompteCredit
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NomCompte
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Duree
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {dateParser(
                                                                                    res.DateOctroi
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.MontantAccorde
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.RemboursCapital
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.RemboursInteretIn
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.CapitalRestant
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.InteretRestant
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Retard1
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Retard2
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Retard3
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Retard4
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Retard5
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.JourRetard
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <br />
                                            <br />

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>
                                                        {this.state.Monnaie ==
                                                            "CDF" && (
                                                            <h4>
                                                                Encours global
                                                                de crédit CDF{" "}
                                                                <strong
                                                                    style={{
                                                                        background:
                                                                            "green",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    {numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchSoldeEncourCDF &&
                                                                                this
                                                                                    .state
                                                                                    .fetchSoldeEncourCDF
                                                                                    .SoldeEncoursCDF
                                                                        )
                                                                    )}{" "}
                                                                </strong>
                                                            </h4>
                                                        )}

                                                        {this.state.Monnaie ==
                                                            "USD" && (
                                                            <h4>
                                                                Encours global
                                                                de crédit USD{" "}
                                                                <strong
                                                                    style={{
                                                                        background:
                                                                            "green",
                                                                        color: "#fff",
                                                                        padding:
                                                                            "5px",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    {numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchSoldeEncourUSD &&
                                                                                this
                                                                                    .state
                                                                                    .fetchSoldeEncourUSD
                                                                                    .SoldeEncoursUSD
                                                                        )
                                                                    )}{" "}
                                                                </strong>
                                                            </h4>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {this.state.Monnaie === "CDF" && (
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <p
                                                            style={{
                                                                marginLeft:
                                                                    "20px",
                                                            }}
                                                        >
                                                            <h4>
                                                                {" "}
                                                                Taux déliquence
                                                                (PAR) ={" "}
                                                            </h4>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p>
                                                            <h4>
                                                                <span>
                                                                    Restant dû
                                                                    de crédit
                                                                    avec aumoins
                                                                    un
                                                                    remboursement
                                                                    en retard
                                                                    (39)
                                                                    <br />{" "}
                                                                    <hr
                                                                        style={{
                                                                            border: "1px solid #000",
                                                                        }}
                                                                    />
                                                                    <span>
                                                                        Crédit
                                                                        sain(30,31,32)
                                                                        +
                                                                        Restant
                                                                        dû de
                                                                        crédit
                                                                        avec
                                                                        aumoins
                                                                        un
                                                                        remboursement
                                                                        en
                                                                        retard
                                                                        (39)
                                                                    </span>
                                                                </span>
                                                            </h4>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p>
                                                            <h4>
                                                                x 100 ( {"<=5%"}
                                                                ) =
                                                                <span
                                                                    style={{
                                                                        background:
                                                                            "black",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {this.state.fetchTotCapRetardCDF.toFixed(
                                                                        2
                                                                    )}
                                                                    {" 100 "}
                                                                    {" %"}
                                                                </span>
                                                            </h4>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {this.state.Monnaie == "USD" && (
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <p
                                                            style={{
                                                                marginLeft:
                                                                    "20px",
                                                            }}
                                                        >
                                                            <h4>
                                                                {" "}
                                                                Taux déliquence
                                                                (PAR) ={" "}
                                                            </h4>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p>
                                                            <h4>
                                                                <span>
                                                                    Restant dû
                                                                    de crédit
                                                                    avec aumoins
                                                                    un
                                                                    remboursement
                                                                    en retard
                                                                    (39)
                                                                    <br />{" "}
                                                                    <hr
                                                                        style={{
                                                                            border: "1px solid #000",
                                                                        }}
                                                                    />
                                                                    <span>
                                                                        Crédit
                                                                        sain(30,31,32)
                                                                        +
                                                                        Restant
                                                                        dû de
                                                                        crédit
                                                                        avec
                                                                        aumoins
                                                                        un
                                                                        remboursement
                                                                        en
                                                                        retard
                                                                        (39)
                                                                    </span>
                                                                </span>
                                                            </h4>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p>
                                                            <h4>
                                                                x 100 ( {"<=5%"}
                                                                ) =
                                                                <span
                                                                    style={{
                                                                        background:
                                                                            "black",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {this.state.fetchTotCapRetardUSD.toFixed(
                                                                        2
                                                                    )}
                                                                    {" 100 "}
                                                                    {" %"}
                                                                </span>
                                                            </h4>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

// <div className="row">
// <div className="col-md-6">
//     <p>
//         {
//             <h4>
//                 Encours
//                 global de
//                 crédit CDF{" "}
//                 <strong
//                     style={{
//                         background:
//                             "green",
//                         color: "#fff",
//                     }}
//                 >
//                     {" "}
//                     {numberFormat(
//                         parseInt(
//                             this
//                                 .state
//                                 .fetchSoldeEncourCDF &&
//                                 this
//                                     .state
//                                     .fetchSoldeEncourCDF
//                                     .SoldeEncoursCDF
//                         )
//                     )}{" "}
//                 </strong>
//             </h4>
//         }

//         {
//             <h4>
//                 Encours
//                 global de
//                 crédit USD{" "}
//                 <strong
//                     style={{
//                         background:
//                             "green",
//                         color: "#fff",
//                         padding:
//                             "5px",
//                     }}
//                 >
//                     {" "}
//                     {isNaN(
//                         parseInt(
//                             this
//                                 .state
//                                 .fetchSoldeEncourUSD
//                         )
//                     )
//                         ? "0,00"
//                         : numberFormat(
//                               parseInt(
//                                   this
//                                       .state
//                                       .fetchSoldeEncourUSD &&
//                                       this
//                                           .state
//                                           .fetchSoldeEncourUSD
//                                           .SoldeEncoursUSD
//                               )
//                           )}{" "}
//                 </strong>
//             </h4>
//         }

//     </p>
// </div>
// </div>
// <div className="row">
// <div className="col-md-3">
//     <p
//         style={{
//             marginLeft:
//                 "15px",
//         }}
//     >
//         <h4>
//             {" "}
//             Taux déliquence
//             (PAR) ={" "}
//         </h4>
//     </p>
// </div>
// <div className="col-md-6">
//     <p>
//         <h4>
//             <span>
//                 Restant dû
//                 de crédit
//                 avec aumoins
//                 un
//                 remboursement
//                 en retard
//                 (39)
//                 <br />{" "}
//                 <hr
//                     style={{
//                         border: "1px solid #000",
//                     }}
//                 />
//                 <span>
//                     Crédit
//                     sain(30,31,32)
//                     +
//                     Restant
//                     dû de
//                     crédit
//                     avec
//                     aumoins
//                     un
//                     remboursement
//                     en
//                     retard
//                     (39)
//                 </span>
//             </span>
//         </h4>
//     </p>
// </div>
// <div className="col-md-3">
//     <p>
//         <h4>
//             x 100 ( {"<=5%"}
//             ) =
//             <strong
//                 style={{
//                     background:
//                         "green",
//                     color: "#fff",
//                 }}
//             >
//                 {this.state
//                     .fetchTotCapRetardUSD &&
//                     parseInt(
//                         this
//                             .state
//                             .fetchTotCapRetardUSD
//                             .TotRetard
//                     ) /
//                         parseInt(
//                             this
//                                 .state
//                                 .fetchSoldeEncourUSD
//                                 .SoldeEncoursUSD +
//                                 this
//                                     .state
//                                     .fetchTotCapRetardUSD
//                                     .TotRetard
//                         ) /
//                         100}{" "}
//                 {"%"}
//             </strong>
//         </h4>
//     </p>
// </div>
// </div>
