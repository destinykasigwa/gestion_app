import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Approvisionnement extends React.Component {
    constructor() {
        super();
        this.state = {
            isloading: true,
            loading: false,
            disabled: false,
            montant: "",
            caissierNumber: "",
            DateTransaction: "",
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montant: 0,
            devise: "",
            numCompte: "",
            commission: 0,
            intitule: "",
            vightMille: 0,
            dixMille: 0,
            cinqMille: 0,
            milleFranc: 0,
            cinqCentFr: 0,
            deuxCentFranc: 0,
            centFranc: 0,
            cinquanteFanc: 0,
            fetchCaissierInDb: "",
            fetchDaylyAproCDF: null,
            fetchDaylyAproUSD: null,
            getSoldeCaisseCDF: null,
            getSoldeCaisseUSD: null,
        };

        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCaissier = this.getCaissier.bind(this);
        this.saveOperation = this.saveOperation.bind(this);
        this.getDaylyAppro = this.getDaylyAppro.bind(this);
        this.removeItemCDF = this.removeItemCDF.bind(this);
        this.removeItemUSD = this.removeItemUSD.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            // document
            //     .getElementById("validerbtn")
            //     .setAttribute("disabled", "disabled");
            // document
            //     .getElementById("printbtn")
            // .setAttribute("disabled", "disabled");
        }, 1000);

        let current_datetime = new Date();
        let formatted_date =
            //year
            current_datetime.getFullYear() +
            "-" +
            //month
            (current_datetime.getMonth() + 1) +
            "-" +
            //day
            current_datetime.getDate();
        this.setState({ DateTransaction: formatted_date });
        this.getCaissier();
        this.getDaylyAppro();
    }
    //GET VALUES FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    //GET CAISSIER

    getCaissier = async () => {
        const dataCaissier = await axios.get("/appro/getcaissier");
        this.setState({ fetchCaissierInDb: dataCaissier.data.data });
        console.log(this.state.fetchCaissierInDb);
    };

    saveOperation = async (e) => {
        e.preventDefault();
        const saveData = await axios.post("/appro/savenewappro", this.state);
        if (saveData.data.success == 1) {
            Swal.fire({
                title: "Approvisionnement",
                text: saveData.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled, loading: false });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printBtn")
                .removeAttribute("disabled", "disabled");
        }
    };
    //GET ALL DAYLY APPRO
    getDaylyAppro = async () => {
        const dataAppro = await axios.get("/appro/journalier");
        this.setState({
            fetchDaylyAproCDF: dataAppro.data.data,
            fetchDaylyAproUSD: dataAppro.data.data2,
            getSoldeCaisseCDF: dataAppro.data.soldeCaisseCDF,
            getSoldeCaisseUSD: dataAppro.data.soldeCaisseUSD,
        });
        console.log(this.state);
    };

    //REMOVE A SPECIIQUE ITEM CDF

    removeItemCDF(id) {
        const question = confirm(
            "voulez vous vraiment supprimé l'élement sélectionné?"
        );
        if (question == true) {
            axios.delete("delete/appro/cdf/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Suppression",
                        text: response.data.msg,
                        icon: "info",
                        button: "OK!",
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Suppression",
                text: "Suppression annulée",
                icon: "info",
                button: "OK!",
            });
        }
    }

    removeItemUSD(id) {
        const question = confirm(
            "voulez vous vraiment supprimé l'élement sélectionné?"
        );
        if (question == true) {
            axios.delete("delete/appro/usd/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Suppression",
                        text: response.data.msg,
                        icon: "info",
                        button: "OK!",
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Suppression",
                text: "Suppression annulée",
                icon: "info",
                button: "OK!",
            });
        }
    }

    //to refresh
    actualiser() {
        location.reload();
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
        let labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "3px",
            fontSize: "11px",
        };
        let inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "15px",
        };
        // var inputColor2 = {
        //     height: "25px",
        //     border: "1px solid white",
        //     padding: "3px",
        //     width: "60px",
        // };
        let tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "center",
        };
        let compteur = 1;
        //PERMET DE FORMATER LES CHIFFRES
        // const numberFormat = (number = 0) => {
        //     let locales = [
        //         //undefined,  // Your own browser
        //         "en-US", // United States
        //         //'de-DE',    // Germany
        //         //'ru-RU',    // Russia
        //         //'hi-IN',    // India
        //     ];
        //     let opts = { minimumFractionDigits: 2 };
        //     let index = 3;
        //     let nombre = number.toLocaleString(locales[index], opts);
        //     if (nombre === isNaN) {
        //         nombre = 0.0;
        //     } else {
        //         return nombre;
        //     }
        // };
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
                                        <div
                                            className="col-md-3"
                                            style={{
                                                background: "#fff",
                                                padding: "10px",
                                            }}
                                        >
                                            <form>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Dévise
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <select
                                                                    name="devise"
                                                                    className="form-control"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .disabled
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                    style={
                                                                        inputColor
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
                                                                    <option value="USD">
                                                                        USD
                                                                    </option>
                                                                    <option value="CDF">
                                                                        CDF
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Caissier
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <select
                                                                    name="caissierNumber"
                                                                    className="form-control"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .disabled
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .caissierNumber
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Sélectionnez
                                                                    </option>
                                                                    {this.state
                                                                        .fetchCaissierInDb &&
                                                                        this.state.fetchCaissierInDb.map(
                                                                            (
                                                                                res,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        value={
                                                                                            res.NumCompte
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            res.NomCompte
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Montant
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    name="montant"
                                                                    className="form-control"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .disabled
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .montant
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {this.state
                                                                .hundred *
                                                                100 +
                                                                this.state
                                                                    .fitfty *
                                                                    50 +
                                                                this.state
                                                                    .twenty *
                                                                    20 +
                                                                this.state.ten *
                                                                    10 +
                                                                this.state
                                                                    .five *
                                                                    5 +
                                                                this.state
                                                                    .oneDollar *
                                                                    1 ===
                                                                parseInt(
                                                                    this.state
                                                                        .montant
                                                                ) ||
                                                            this.state
                                                                .vightMille *
                                                                20000 +
                                                                this.state
                                                                    .dixMille *
                                                                    10000 +
                                                                this.state
                                                                    .cinqMille *
                                                                    5000 +
                                                                this.state
                                                                    .milleFranc *
                                                                    1000 +
                                                                this.state
                                                                    .cinqCentFr *
                                                                    500 +
                                                                this.state
                                                                    .deuxCentFranc *
                                                                    200 +
                                                                this.state
                                                                    .centFranc *
                                                                    100 +
                                                                this.state
                                                                    .cinquanteFanc *
                                                                    50 ===
                                                                parseInt(
                                                                    this.state
                                                                        .montant
                                                                ) ? (
                                                                <button
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        width: "100%",
                                                                        height: "30px",
                                                                        fontSize:
                                                                            "12px",
                                                                        marginTop:
                                                                            "12px",
                                                                    }}
                                                                    className="btn btn-primary"
                                                                    id="validerbtn"
                                                                    onClick={
                                                                        this
                                                                            .saveOperation
                                                                    }
                                                                >
                                                                    <i
                                                                        className={`${
                                                                            this
                                                                                .state
                                                                                .loading
                                                                                ? "spinner-border spinner-border-sm"
                                                                                : "fas fa-check"
                                                                        }`}
                                                                    ></i>{" "}
                                                                    Valider {""}
                                                                    {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        width: "100%",
                                                                        height: "30px",
                                                                        fontSize:
                                                                            "12px",
                                                                        marginTop:
                                                                            "12px",
                                                                    }}
                                                                    className="btn btn-primary"
                                                                    disabled
                                                                >
                                                                    <i className="fas fa-check"></i>{" "}
                                                                    Valider {""}
                                                                    {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            <button
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    width: "100%",
                                                                    height: "30px",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                                className="btn btn-primary"
                                                                id="printBtn"
                                                            >
                                                                <i className="fas fa-print"></i>{" "}
                                                                Imprimer {""}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                            <p
                                                style={{
                                                    background: "#dcdcdc",
                                                    color: "#000",
                                                    padding: "10px",
                                                }}
                                            >
                                                Solde Caisse CDF :
                                                <span
                                                    style={{
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                        fontSize: "18",
                                                    }}
                                                >
                                                    {this.state
                                                        .getSoldeCaisseCDF &&
                                                        numberWithSpaces(
                                                            parseInt(
                                                                this.state
                                                                    .getSoldeCaisseCDF
                                                                    .soldeCaisseCDF
                                                            )
                                                        )}
                                                </span>
                                                <br />
                                                Solde Caisse USD :
                                                <span
                                                    style={{
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                        fontSize: "18",
                                                    }}
                                                >
                                                    {this.state
                                                        .getSoldeCaisseUSD &&
                                                        numberWithSpaces(
                                                            parseInt(
                                                                this.state
                                                                    .getSoldeCaisseUSD
                                                                    .soldeCaisseUSD
                                                            )
                                                        )}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-5">
                                            <div
                                                className="card-body"
                                                style={{ background: "#fff" }}
                                            >
                                                {this.state.devise === "USD" ? (
                                                    <form
                                                        method="POST"
                                                        style={{
                                                            height: "auto",
                                                        }}
                                                    >
                                                        <table className="tableDepotEspece">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-md-4">
                                                                        Coupures
                                                                    </th>
                                                                    <th className="col-md-4">
                                                                        Nbr
                                                                        Billets
                                                                    </th>
                                                                    <th className="col-md-2">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>100</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="hundred"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .hundred
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .hundred *
                                                                            100}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>50</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="fitfty"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .fitfty
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .fitfty *
                                                                            50}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>20</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="twenty"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .twenty
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .twenty *
                                                                            20}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>10</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="ten"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .ten
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .ten *
                                                                            10}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>5</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="five"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .five
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .five *
                                                                            5}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>1</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="oneDollar"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .oneDollar
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .oneDollar *
                                                                            1}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        padding:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                    <th>
                                                                        {" "}
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .hundred
                                                                        ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fitfty
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .twenty
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .ten
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .five
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .oneDollar
                                                                            )}{" "}
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            fontSize:
                                                                                "25px",
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .hundred *
                                                                            100 +
                                                                            this
                                                                                .state
                                                                                .fitfty *
                                                                                50 +
                                                                            this
                                                                                .state
                                                                                .twenty *
                                                                                20 +
                                                                            this
                                                                                .state
                                                                                .ten *
                                                                                10 +
                                                                            this
                                                                                .state
                                                                                .five *
                                                                                5 +
                                                                            this
                                                                                .state
                                                                                .oneDollar *
                                                                                1}{" "}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                ) : (
                                                    <form
                                                        method="POST"
                                                        style={{
                                                            height: "340px",
                                                        }}
                                                    >
                                                        <table className="tableDepotEspece">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-md-4">
                                                                        Coupures
                                                                    </th>
                                                                    <th className="col-md-4">
                                                                        Nbr
                                                                        Billets
                                                                    </th>
                                                                    <th className="col-md-2">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        20000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="vightMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .vightMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .vightMille *
                                                                            20000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        10000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="dixMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .dixMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .dixMille *
                                                                            10000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        5000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinqMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinqMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinqMille *
                                                                            5000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        1000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="milleFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .milleFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .milleFranc *
                                                                            1000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>500</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinqCentFr"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinqCentFr
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinqCentFr *
                                                                            500}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>200</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="deuxCentFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .deuxCentFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .deuxCentFranc *
                                                                            200}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>100</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="centFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .centFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .centFranc *
                                                                            100}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>50</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinquanteFanc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinquanteFanc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinquanteFanc *
                                                                            50}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        padding:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                    <th>
                                                                        {" "}
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .vightMille
                                                                        ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .dixMille
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinqMille
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .milleFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinqCentFr
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .deuxCentFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .centFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinquanteFanc
                                                                            )}{" "}
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            fontSize:
                                                                                "25px",
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .vightMille *
                                                                            20000 +
                                                                            this
                                                                                .state
                                                                                .dixMille *
                                                                                10000 +
                                                                            this
                                                                                .state
                                                                                .cinqMille *
                                                                                5000 +
                                                                            this
                                                                                .state
                                                                                .milleFranc *
                                                                                1000 +
                                                                            this
                                                                                .state
                                                                                .cinqCentFr *
                                                                                500 +
                                                                            this
                                                                                .state
                                                                                .deuxCentFranc *
                                                                                200 +
                                                                            this
                                                                                .state
                                                                                .centFranc *
                                                                                100 +
                                                                            this
                                                                                .state
                                                                                .cinquanteFanc *
                                                                                50}{" "}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="col-md-4 appro-table-div"
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                            }}
                                        >
                                            {this.state.devise == "USD" ? (
                                                <table
                                                    className="table table-dark"
                                                    style={tableBorder}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Réference
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Num caissier
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant USD
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Action
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchDaylyAproUSD &&
                                                            this.state.fetchDaylyAproUSD.map(
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
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    res.NumCompteCaissier
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    res.montant
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                <button
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => {
                                                                                        this.removeItemUSD(
                                                                                            res.id
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-trash"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <table
                                                    className="table table-dark"
                                                    style={tableBorder}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Réference
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Num caissier
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant CDF
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Action
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchDaylyAproCDF &&
                                                            this.state.fetchDaylyAproCDF.map(
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
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    res.NumCompteCaissier
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {
                                                                                    res.montant
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                <button
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => {
                                                                                        this.removeItemCDF(
                                                                                            res.id
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-trash"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-md-6">
                                            
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
