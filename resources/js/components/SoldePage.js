import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/app.css";
import { EnteteRapport } from "./EnteteRapport";

export default class SoldePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: false,
            getSolde: null,
            getReleve: "",
            afficherReleve: false,
            refCompte: "",
            dateToSearch1: "",
            dateToSearch2: "",
            devise: "",
            infoMembre: null,
            getTotUSD: null,
            getTotCDF: null,
            getSearchedItems: null,
            NumAdherant: null,
            defaultDate1: null,
            defaultDate2: null,
            fetchSoldeOuvertureCDF: null,
            fetchSoldeClotureCDF: null,
            fetchSoldeOuvertureUSD: null,
            fetchSoldeClotureUSD: null,
            fetchSoldeFistDayOfYearCDF: null,
            fetchSoldeFistDayOfYearUSD: null,
            getFistDayOfYear: null,
            getMontantGarantie: null,
        };
        this.actualiser = this.actualiser.bind(this);
        this.getData = this.getData.bind(this);
        this.AfficherReleve = this.AfficherReleve.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.PrintBtnCDF = this.PrintBtnCDF.bind(this);
        this.PrintBtnUSD = this.PrintBtnUSD.bind(this);
        this.handleSeach = this.handleSeach.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);

        this.getUserInfo();
    }

    //CHECK IF ITS A ALLOWED USER OR NOT
    getUserInfo = async () => {
        const UserInfo = await axios.get("users/getUserInfo");
        this.setState({
            userInfo: UserInfo.data.Role,
            NumAdherant: UserInfo.data.NumAdherant,
            defaultDate1: UserInfo.data.defaultDate1,
            defaultDate2: UserInfo.data.defaultDate2,
        });
        if (this.state.NumAdherant) {
            this.setState({ refCompte: this.state.NumAdherant });
        }
        if (!this.state.dateToSearch1 && !this.state.dateToSearch2) {
            this.setState({
                dateToSearch1: UserInfo.data.defaultDate1,
                dateToSearch2: UserInfo.data.defaultDate2,
            });
        }
        // console.log(this.state.userInfo + "rrrrr");
    };

    //GET DATA FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }
    getData = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const result = await axios.post("/membre/releve/data", this.state);
        if (result.data.success == 1) {
            this.setState({
                getReleve: result.data.dataReleve,
                getSolde: result.data.dataSolde[0],
                infoMembre: result.data.infoMembre,
                getTotCDF: this.state.devise == "CDF" && result.data.totCDF[0],
                getTotUSD: this.state.devise == "USD" && result.data.totUSD[0],
                getMontantGarantie: result.data.montantGarantie,
                fetchSoldeOuvertureCDF:
                    this.state.devise == "CDF" &&
                    result.data.SoldeOuvertureCDF[0],
                fetchSoldeClotureCDF:
                    this.state.devise == "CDF" &&
                    result.data.SoldeClotureCDF[0],
                fetchSoldeOuvertureUSD:
                    this.state.devise == "USD" &&
                    result.data.SoldeOuvertureUSD[0],
                fetchSoldeClotureUSD:
                    this.state.devise == "USD" &&
                    result.data.SoldeClotureUSD[0],
                fetchSoldeFistDayOfYearCDF:
                    this.state.devise == "CDF" &&
                    result.data.getSoldeOfFistDayOfYearCDF[0],
                fetchSoldeFistDayOfYearUSD:
                    this.state.devise == "USD" &&
                    result.data.getSoldeOfFistDayOfYearUSD[0],
                getFistDayOfYear: result.data.dateFistDay,
            });
            // console.log(
            //     this.state.fetchSoldeOuvertureCDF !== undefined
            //         ? this.state.fetchSoldeOuvertureCDF.soldeOuvertureCDF
            //         : 0
            // );
            this.setState({ loading: false });
        } else if (result.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: result.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading: false });
        }
        // console.log(this.state);
    };

    AfficherReleve(e) {
        e.preventDefault();
        this.setState({ afficherReleve: true });
    }

    //AFFICHER LES LES COMPTE RECHERCHER PAR NOM

    handleSeach = async (item) => {
        this.setState({ loading2: true });
        const res = await axios.get("/membre/releve/data/search/" + item);
        if (res.data.success == 1) {
            this.setState({
                getSearchedItems: res.data.data,
            });
            this.setState({ loading2: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading2: false });
        }
    };

    //to refresh
    actualiser() {
        location.reload();
    }
    //PRINT RELEVE USD FUNCTION
    PrintBtnUSD(e) {
        e.preventDefault();
        const printableElements =
            document.getElementById("printmeUSD").innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
    }

    //PRINT RELEVE CDF FUNCTION
    PrintBtnCDF(e) {
        e.preventDefault();
        const printableElements =
            document.getElementById("printmeCDF").innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
    }
    render() {
        var myspinner = {
            margin: "5px auto",
            width: "3rem",
            height: "3rem",
            marginTop: "180px",
            border: "0px",
            height: "200px",
        };
        var labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "3px",
            fontSize: "14px",
        };
        var inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "15px",
        };

        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "left",
        };

        let compteur = 1;
        let compteur2 = 1;
        //PERMET DE FORMATER LES CHIFFRES
        const numberFormat = (number = 0) => {
            var locales = [
                //undefined,  // Your own browser
                "en-US", // United States
                //'de-DE',    // Germany
                //'ru-RU',    // Russia
                //'hi-IN',    // India
            ];
            var opts = { minimumFractionDigits: 2 };
            var index = 3;
            var nombre = number.toLocaleString(locales[index], opts);
            if (nombre === isNaN) {
                nombre = 0.0;
            } else {
                return nombre;
            }
        };

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
        function numberWithSpaces(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
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
                        {this.state.userInfo == 0 && !this.state.NumAdherant ? (
                            <div style={{ width: "80%", margin: "0px auto" }}>
                                <p style={{ color: "red", fontSize: "20px" }}>
                                    une erreur est servenue: veuillez Créer un
                                    compte ou contacter le service client pour
                                    visualiser votre relevé
                                </p>
                            </div>
                        ) : (
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
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="card-header">
                                                        Relevé
                                                    </div>
                                                    <form
                                                        style={{
                                                            padding: "10px",
                                                            border: "2px solid #fff",
                                                        }}
                                                    >
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    <select
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="devise"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .devise
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="CDF">
                                                                            CDF
                                                                        </option>
                                                                        <option value="USD">
                                                                            USD
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    {this.state
                                                                        .NumAdherant ? (
                                                                        <input
                                                                            style={
                                                                                inputColor
                                                                            }
                                                                            type="text"
                                                                            placeholder="Compte"
                                                                            readOnly
                                                                            name="refCompte"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .refCompte
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            style={
                                                                                inputColor
                                                                            }
                                                                            type="text"
                                                                            placeholder="Compte"
                                                                            name="refCompte"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .refCompte
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        type="date"
                                                                        name="dateToSearch1"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .dateToSearch1
                                                                                ? this
                                                                                      .state
                                                                                      .dateToSearch1
                                                                                : this
                                                                                      .state
                                                                                      .defaultDate1
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        type="date"
                                                                        name="dateToSearch2"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .dateToSearch2
                                                                                ? this
                                                                                      .state
                                                                                      .dateToSearch2
                                                                                : this
                                                                                      .state
                                                                                      .defaultDate2
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            {this.state
                                                                .getSolde && (
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "3px",
                                                                            width: "auto",
                                                                            height: "85px",
                                                                            background:
                                                                                "#fff",
                                                                            padding:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        {this
                                                                            .state
                                                                            .devise ==
                                                                            "CDF" && (
                                                                            <label>
                                                                                CDF
                                                                                :{" "}
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getSolde
                                                                                        .soldeMembreCDF
                                                                                ) <
                                                                                0 ? (
                                                                                    <span
                                                                                        style={{
                                                                                            background:
                                                                                                "red",
                                                                                            color: "#fff",
                                                                                            padding:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreCDF !==
                                                                                            undefined &&
                                                                                            numberWithSpaces(
                                                                                                parseInt(
                                                                                                    this
                                                                                                        .state
                                                                                                        .getSolde
                                                                                                        .soldeMembreCDF
                                                                                                )
                                                                                            )}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span
                                                                                        style={{
                                                                                            background:
                                                                                                "green",
                                                                                            color: "#fff",
                                                                                            padding:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreCDF !==
                                                                                            undefined &&
                                                                                            numberWithSpaces(
                                                                                                parseInt(
                                                                                                    this
                                                                                                        .state
                                                                                                        .getSolde
                                                                                                        .soldeMembreCDF
                                                                                                )
                                                                                            )}
                                                                                    </span>
                                                                                )}
                                                                            </label>
                                                                        )}
                                                                        <br />
                                                                        {this
                                                                            .state
                                                                            .devise ==
                                                                            "USD" && (
                                                                            <label>
                                                                                USD
                                                                                :{" "}
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getSolde
                                                                                        .soldeMembreUSD
                                                                                ) <
                                                                                0 ? (
                                                                                    <span
                                                                                        style={{
                                                                                            background:
                                                                                                "red",
                                                                                            color: "#fff",
                                                                                            padding:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreUSD !==
                                                                                            undefined &&
                                                                                            numberWithSpaces(
                                                                                                parseInt(
                                                                                                    this
                                                                                                        .state
                                                                                                        .getSolde
                                                                                                        .soldeMembreUSD
                                                                                                )
                                                                                            )}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span
                                                                                        style={{
                                                                                            background:
                                                                                                "green",
                                                                                            color: "#fff",
                                                                                            padding:
                                                                                                "5px",
                                                                                        }}
                                                                                    >
                                                                                        {this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreUSD !==
                                                                                            undefined &&
                                                                                            numberWithSpaces(
                                                                                                parseInt(
                                                                                                    this
                                                                                                        .state
                                                                                                        .getSolde
                                                                                                        .soldeMembreUSD
                                                                                                )
                                                                                            )}
                                                                                    </span>
                                                                                )}{" "}
                                                                            </label>
                                                                        )}
                                                                        {this
                                                                            .state
                                                                            .getMontantGarantie && (
                                                                            <label>
                                                                                EPARGNE
                                                                                GARANTIE{" "}
                                                                                <br />
                                                                                <span
                                                                                    style={{
                                                                                        background:
                                                                                            "red",
                                                                                        color: "#fff",
                                                                                        padding:
                                                                                            "5px",
                                                                                    }}
                                                                                >
                                                                                    {this
                                                                                        .state
                                                                                        .getMontantGarantie !==
                                                                                        undefined &&
                                                                                        numberWithSpaces(
                                                                                            parseInt(
                                                                                                this
                                                                                                    .state
                                                                                                    .getMontantGarantie
                                                                                            )
                                                                                        )}
                                                                                </span>
                                                                            </label>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )}

                                                            <tr>
                                                                <td
                                                                    style={{
                                                                        padding:
                                                                            "4px",
                                                                    }}
                                                                >
                                                                    {!this.state
                                                                        .loading ? (
                                                                        <button
                                                                            style={{
                                                                                height: "33px",
                                                                                border: "1px solid steelblue",
                                                                            }}
                                                                            type="text"
                                                                            className="btn"
                                                                            id="btnsaveUser"
                                                                            onClick={
                                                                                this
                                                                                    .getData
                                                                            }
                                                                        >
                                                                            <i className="fas fa-check"></i>{" "}
                                                                            Afficher
                                                                            le
                                                                            solde{" "}
                                                                            {""}
                                                                        </button>
                                                                    ) : (
                                                                        <button class="btn btn-primary">
                                                                            <span class="spinner-border spinner-border-sm"></span>
                                                                            Chargement
                                                                            ...
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {this.state
                                                                .getSolde && (
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "3px",
                                                                            width: "auto",
                                                                            height: "auto",
                                                                        }}
                                                                    >
                                                                        <button
                                                                            style={{
                                                                                height: "33px",
                                                                                border: "1px solid steelblue",
                                                                            }}
                                                                            type="text"
                                                                            className="btn"
                                                                            id="btnsaveUser"
                                                                            onClick={
                                                                                this
                                                                                    .AfficherReleve
                                                                            }
                                                                        >
                                                                            <i className="fas fa-desktop"></i>{" "}
                                                                            Afficher
                                                                            le
                                                                            relevé{" "}
                                                                            {""}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </table>
                                                    </form>
                                                </div>
                                                {this.state.userInfo == 1 && (
                                                    <div className="col-md-4 table-search-by-name">
                                                        <div className="card-header">
                                                            Recherche par
                                                            intitulé.
                                                        </div>

                                                        <table className="mt-2">
                                                            <tr>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "15px",
                                                                        }}
                                                                        ref={
                                                                            this
                                                                                .textInput
                                                                        }
                                                                        className="form-control font-weight-bold"
                                                                        placeholder="Rechercher..."
                                                                        name="searchedItem"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .searchedItem
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => {
                                                                            this.handleSeach(
                                                                                this
                                                                                    .state
                                                                                    .searchedItem
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className={`${
                                                                                this
                                                                                    .state
                                                                                    .loading2
                                                                                    ? "spinner-border spinner-border-sm"
                                                                                    : "fas fa-search"
                                                                            }`}
                                                                        ></i>
                                                                        Rechercher
                                                                    </button>
                                                                </td>{" "}
                                                            </tr>
                                                        </table>

                                                        {this.state
                                                            .getSearchedItems && (
                                                            <table
                                                                className="tableStyle"
                                                                style={{
                                                                    background:
                                                                        "#444",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                <thead>
                                                                    <th
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        #
                                                                    </th>
                                                                    <th
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        Compte
                                                                        Abregé
                                                                    </th>
                                                                    <th
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        Num
                                                                        compte
                                                                    </th>
                                                                    <th
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        Intitulé
                                                                    </th>
                                                                </thead>
                                                                {this.state.getSearchedItems.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    {
                                                                                        compteur2++
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.NumAdherant
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {" "}
                                                                                    {
                                                                                        res.NumCompte
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {" "}
                                                                                    {
                                                                                        res.NomCompte
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </table>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.getReleve &&
                                        this.state.afficherReleve &&
                                        (this.state.devise == "CDF" ? (
                                            <React.Fragment>
                                                <hr class="solid" />
                                                <div
                                                    className="row"
                                                    id="printmeCDF"
                                                >
                                                    <div
                                                        className="card card-to-print"
                                                        style={{
                                                            margin: "0 auto",
                                                            width: "77%",
                                                        }}
                                                    >
                                                        {/* <EnteteRapport /> */}
                                                        <div
                                                            className="row title-echeancier"
                                                            style={{
                                                                margin: "0px auto",
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h4
                                                                style={{
                                                                    background:
                                                                        "#444",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                RELEVE DE COMPTE
                                                            </h4>{" "}
                                                        </div>

                                                        <div
                                                            class="card-body"
                                                            style={{
                                                                marginLeft:
                                                                    "50px",
                                                                marginRight:
                                                                    "50px",
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            <div
                                                                className="row m-0 entente-container"
                                                                style={{
                                                                    width: "100%",
                                                                    margin: "0px auto",
                                                                    background:
                                                                        "#fff",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    border: "2px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <div className="col-md-10">
                                                                    <table
                                                                        // className="myhead-table"
                                                                        // style={{
                                                                        //     color: "#000",
                                                                        // }}
                                                                        // style={{
                                                                        //     fontSize:
                                                                        //         "20px",
                                                                        // }}
                                                                        className="table table-striped entete-tables"
                                                                    >
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Intitilé
                                                                                de
                                                                                compte
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .infoMembre
                                                                                        .NomCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Compte
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .infoMembre
                                                                                        .NumCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Dévise
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                CDF
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                d'ouverture
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeOuvertureCDF !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeOuvertureCDF
                                                                                            .soldeOuvertureCDF
                                                                                    )}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                de
                                                                                clotûre
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeClotureCDF !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeClotureCDF
                                                                                            .soldeClotureCDF
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                disponible
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeClotureCDF !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeClotureCDF
                                                                                            .soldeClotureCDF
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                au{" "}
                                                                                {dateParser(
                                                                                    this
                                                                                        .state
                                                                                        .getFistDayOfYear
                                                                                )}{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeFistDayOfYearCDF !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeFistDayOfYearCDF
                                                                                            .soldeOfFirstYear
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Total
                                                                                débit
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .getTotCDF
                                                                                    .totDebit >
                                                                                0
                                                                                    ? numberWithSpaces(
                                                                                          this
                                                                                              .state
                                                                                              .getTotCDF
                                                                                              .totDebit
                                                                                      )
                                                                                    : null}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Total
                                                                                crédit
                                                                            </td>
                                                                            {/* <td>
                                                                                {numberWithSpaces(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreCDF
                                                                                    )
                                                                                )}
                                                                            </td> */}
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .getTotCDF
                                                                                    .totCredit >
                                                                                    0 &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .getTotCDF
                                                                                            .totCredit
                                                                                    )}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Date
                                                                                Débit{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {dateParser(
                                                                                    this
                                                                                        .state
                                                                                        .dateToSearch1
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Date
                                                                                Fin{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {dateParser(
                                                                                    this
                                                                                        .state
                                                                                        .dateToSearch2
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <table
                                                                className="table table-striped table-contents"
                                                                style={{
                                                                    padding:
                                                                        "5px",
                                                                    width: "100%",
                                                                    // color: "#fff",
                                                                }}
                                                            >
                                                                <thead
                                                                    style={{
                                                                        background:
                                                                            "#444",
                                                                        fontWeight:
                                                                            "bold",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        <td scope="col">
                                                                            N°
                                                                        </td>
                                                                        <td scope="col">
                                                                            Date
                                                                        </td>
                                                                        <td scope="col">
                                                                            Libellé
                                                                        </td>
                                                                        <td scope="col">
                                                                            Débit
                                                                            CDF
                                                                        </td>
                                                                        <td scope="col">
                                                                            Crédit
                                                                            CDF
                                                                        </td>

                                                                        <td scope="col">
                                                                            Solde
                                                                        </td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.getReleve.map(
                                                                        (
                                                                            data,
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
                                                                                        {dateParser(
                                                                                            data.DateTransaction
                                                                                        )}
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            textAlign:
                                                                                                "left",
                                                                                        }}
                                                                                    >
                                                                                        {" "}
                                                                                        {"REF: " +
                                                                                            data.NumTransaction}{" "}
                                                                                        {
                                                                                            data.Libelle
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.Debitfc
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.Creditfc
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.solde
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tbody>
                                                                {/* <tfoot>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "25px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            Total
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                        ></td>
                                                                        <td
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                        ></td>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {this
                                                                                .state
                                                                                .getTotCDF
                                                                                .totDebit >
                                                                            0
                                                                                ? this
                                                                                      .state
                                                                                      .getTotCDF
                                                                                      .totDebit
                                                                                : null}
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {this
                                                                                .state
                                                                                .getTotCDF
                                                                                .totCredit >
                                                                                0 &&
                                                                                this
                                                                                    .state
                                                                                    .getTotCDF
                                                                                    .totCredit}
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getSolde
                                                                                    .soldeMembreCDF
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                </tfoot> */}
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col-md-6"></div>
                                                    <div className="col-md-6">
                                                        <span
                                                            style={{
                                                                float: "right",
                                                                margin: "5px",
                                                                padding: "2px",
                                                                marginRight:
                                                                    "150px",
                                                            }}
                                                        >
                                                            {/* <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-excel"></i> Exporter
                                            </button> {""}
                                            <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-word"></i> Export
                                            </button> */}{" "}
                                                            <button
                                                                onClick={
                                                                    this
                                                                        .PrintBtnCDF
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
                                        ) : (
                                            <React.Fragment>
                                                <hr class="solid" />
                                                <div
                                                    className="row"
                                                    id="printmeUSD"
                                                >
                                                    <div
                                                        className="card card-to-print"
                                                        style={{
                                                            margin: "0px auto",
                                                            width: "100%",
                                                            width: "77%",
                                                        }}
                                                    >
                                                        {/* <EnteteRapport /> */}
                                                        <div
                                                            className="row title-echeancier"
                                                            style={{
                                                                margin: "0px auto",
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h4
                                                                style={{
                                                                    background:
                                                                        "#444",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                RELEVE DE COMPTE
                                                            </h4>{" "}
                                                        </div>

                                                        <div
                                                            class="card-body"
                                                            style={{
                                                                marginLeft:
                                                                    "50px",
                                                                marginRight:
                                                                    "50px",
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            <div
                                                                className="row m-0 entente-container"
                                                                style={{
                                                                    width: "100%",
                                                                    margin: "0px auto",
                                                                    background:
                                                                        "#fff",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    border: "2px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <div className="col-md-10">
                                                                    <table
                                                                        // className="myhead-table"
                                                                        // style={{
                                                                        //     color: "#000",
                                                                        // }}
                                                                        // style={{
                                                                        //     fontSize:
                                                                        //         "20px",
                                                                        // }}
                                                                        className="table table-striped entete-tables"
                                                                    >
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Intitilé
                                                                                de
                                                                                compte
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .infoMembre
                                                                                        .NomCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Compte
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .infoMembre
                                                                                        .NumCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Dévise
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                USD
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                d'ouverture
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeOuvertureUSD !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeOuvertureUSD
                                                                                            .soldeOuvertureUSD
                                                                                    )}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                de
                                                                                clotûre
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeClotureUSD !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeClotureUSD
                                                                                            .soldeClotureUSD
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                disponible
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeClotureUSD !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeClotureUSD
                                                                                            .soldeClotureUSD
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Solde
                                                                                au{" "}
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .getFistDayOfYear
                                                                                }{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this
                                                                                    .state
                                                                                    .fetchSoldeFistDayOfYearUSD !==
                                                                                    undefined &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSoldeFistDayOfYearUSD
                                                                                            .soldeOfFirstYear
                                                                                    )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Total
                                                                                débit
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .getTotUSD
                                                                                    .totDebit >
                                                                                0
                                                                                    ? numberWithSpaces(
                                                                                          this
                                                                                              .state
                                                                                              .getTotUSD
                                                                                              .totDebit
                                                                                      )
                                                                                    : null}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Total
                                                                                crédit
                                                                            </td>
                                                                            {/* <td>
                                                                                {numberWithSpaces(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreCDF
                                                                                    )
                                                                                )}
                                                                            </td> */}
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {this
                                                                                    .state
                                                                                    .getTotUSD
                                                                                    .totCredit >
                                                                                    0 &&
                                                                                    numberWithSpaces(
                                                                                        this
                                                                                            .state
                                                                                            .getTotUSD
                                                                                            .totCredit
                                                                                    )}
                                                                            </td>
                                                                        </tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Date
                                                                                Débit{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .dateToSearch1
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    background:
                                                                                        "#444",
                                                                                    color: "#fff",
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Date
                                                                                Fin:{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #dcdcdc",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .dateToSearch2
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <table
                                                                className="table table-striped table-contents"
                                                                style={{
                                                                    padding:
                                                                        "5px",
                                                                    width: "100%",
                                                                    // color: "#fff",
                                                                }}
                                                            >
                                                                <thead
                                                                    style={{
                                                                        background:
                                                                            "#444",
                                                                        fontWeight:
                                                                            "bold",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        <td scope="col">
                                                                            N°
                                                                        </td>
                                                                        <td scope="col">
                                                                            Date
                                                                        </td>
                                                                        <td scope="col">
                                                                            Libellé
                                                                        </td>
                                                                        <td scope="col">
                                                                            Débit
                                                                        </td>
                                                                        <td scope="col">
                                                                            Crédit
                                                                        </td>

                                                                        <td scope="col">
                                                                            Solde
                                                                        </td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.getReleve.map(
                                                                        (
                                                                            data,
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
                                                                                        {dateParser(
                                                                                            data.DateTransaction
                                                                                        )}
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            textAlign:
                                                                                                "left",
                                                                                        }}
                                                                                    >
                                                                                        {" "}
                                                                                        {"REF: " +
                                                                                            data.NumTransaction}{" "}
                                                                                        {
                                                                                            data.Libelle
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.Debit$
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.Credit$
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                    <td>
                                                                                        {numberWithSpaces(
                                                                                            parseInt(
                                                                                                data.solde
                                                                                            )
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tbody>
                                                                {/* <tfoot>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "25px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            Total
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                        ></td>
                                                                        <td
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                        ></td>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {typeof (
                                                                                this
                                                                                    .state
                                                                                    .getTotUSD !==
                                                                                undefined
                                                                            )
                                                                                ? this
                                                                                      .state
                                                                                      .getTotUSD
                                                                                      .totDebit
                                                                                : null}
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getTotUSD
                                                                                    .totCredit
                                                                            }
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                fontSize:
                                                                                    "23px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getSolde
                                                                                    .soldeMembreUSD
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                </tfoot> */}
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col-md-6"></div>
                                                    <div className="col-md-6">
                                                        <span
                                                            style={{
                                                                float: "right",
                                                                margin: "5px",
                                                                padding: "2px",
                                                                marginRight:
                                                                    "150px",
                                                            }}
                                                        >
                                                            <button
                                                                onClick={
                                                                    this
                                                                        .PrintBtnUSD
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
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </React.Fragment>
        );
    }
}
