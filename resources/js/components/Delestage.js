import React from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default class Delestage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            isloading: true,
            loading: false,
            DateTransaction: "",
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montantCDF: 0,
            montantUSD: 0,
            montant: "",
            devise: "",
            numCompte: "",
            vightMille: 0,
            dixMille: 0,
            cinqMille: 0,
            milleFranc: 0,
            cinqCentFr: 0,
            deuxCentFranc: 0,
            centFranc: 0,
            cinquanteFanc: 0,
            fetchBilletageCDF: null,
            fetchBilletageUSD: null,
            fetchNouvelBilletageCDF: null,
            fetchNouvelBilletageUSD: null,
            fetchSommeCommCDF: null,
            fetchSommeCommUSD: null,
        };
        this.getAllBilletage = this.getAllBilletage.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.UpdateBilletageCDF = this.UpdateBilletageCDF.bind(this);
        this.UpdateBilletageUSD = this.UpdateBilletageUSD.bind(this);
        this.saveNewBilletageUSD = this.saveNewBilletageUSD.bind(this);
        this.saveNewBilletageCDF = this.saveNewBilletageCDF.bind(this);
        this.delestageUSD = this.delestageUSD.bind(this);
        this.delestageCDF = this.delestageCDF.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printbtn")
                .setAttribute("disabled", "disabled");
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
        this.getAllBilletage();
        this.getNewBilletage();
    }

    //GET VALUES FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    //GET SUM OF BILLETAGE IN DB

    getAllBilletage = async () => {
        const getBilletage = await axios.get("/billetage/sommebilletage");
        this.setState({
            fetchBilletageCDF: getBilletage.data.dataCDF[0],
            fetchBilletageUSD: getBilletage.data.dataUSD[0],
            fetchSommeCommCDF: getBilletage.data.sommeCommissionCDF,
            fetchSommeCommUSD: getBilletage.data.sommeCommissionUSD,
        });
        // this.settate({
        //     montantCDF: getBilletage.data.dataCDF[0].sommeMontantCDF,
        //     montantUSD: getBilletage.data.dataUSD[0].sommeMontantUSD,
        // });
    };

    getNewBilletage = async () => {
        const getNewB = await axios.get("/billetage/nouvel");
        this.setState({
            fetchNouvelBilletageCDF: getNewB.data.dataCDF,
            fetchNouvelBilletageUSD: getNewB.data.dataUSD,
        });
    };
    UpdateBilletageCDF = async (e) => {
        e.preventDefault();
        const updateCDF = await axios.post("/delestage/update/cdf", this.state);
        if (updateCDF.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: updateCDF.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printbtn")
                .setAttribute("disabled", "disabled");
        }
        e.preventDefault();
        alert("OK CDF");
    };

    UpdateBilletageUSD = async (e) => {
        e.preventDefault();
        const updateUSD = await axios.post("/delestage/update/usd", this.state);
        if (updateUSD.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: updateUSD.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printbtn")
                .setAttribute("disabled", "disabled");
        }
    };
    //PERMETDE FAIRE LE DELESTAGE AU CAS OU L'UTILISATEUR A FAIT L'ECHANGE DE MONAIE USD

    saveNewBilletageUSD = async (e) => {
        e.preventDefault();
        const delest = await axios.get("/delestage/echange/usd");
        if (delest.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: delest.data.msg,
                icon: "success",
                button: "OK!",
            });

            document
                .getElementById("delestage-btn-usd")
                .setAttribute("disabled", "disabled");
        }
    };

    saveNewBilletageCDF = async (e) => {
        e.preventDefault();
        const delest = await axios.get("/delestage/echange/cdf");
        if (delest.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: delest.data.msg,
                icon: "success",
                button: "OK!",
            });

            document
                .getElementById("delestage-btn-cdf")
                .setAttribute("disabled", "disabled");
        }
    };

    //PERMET DE FAIRE LE DELESTAGE SI L'UTILISATEUR N'A PAS MODIFIER DE BILLETAGE CDF
    delestageCDF = async (e) => {
        e.preventDefault();
        const delest = await axios.post("/delestage/delestage/cdf", this.state);
        if (delest.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: delest.data.msg,
                icon: "success",
                button: "OK!",
            });

            document
                .getElementById("delestage-cdf")
                .setAttribute("disabled", "disabled");
        }
    };

    //PERMET DE FAIRE LE DELESTAGE SI L'UTILISATEUR N'A PAS MODIFIER DE BILLETAGE USD
    delestageUSD = async (e) => {
        e.preventDefault();
        const delest = await axios.post("/delestage/delestage/usd", this.state);
        if (delest.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: delest.data.msg,
                icon: "success",
                button: "OK!",
            });

            document
                .getElementById("delestage-usd")
                .setAttribute("disabled", "disabled");
        }
    };

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
                                                                    <option value="CDF">
                                                                        CDF
                                                                    </option>
                                                                    <option value="USD">
                                                                        USD
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
                                                                Montant USD
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    name="montantUSD"
                                                                    className="form-control font-weight-bold"
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
                                                                            .fetchBilletageUSD &&
                                                                        this
                                                                            .state
                                                                            .fetchSommeCommUSD
                                                                            ? this
                                                                                  .state
                                                                                  .fetchBilletageUSD
                                                                                  .sommeMontantUSD -
                                                                              this
                                                                                  .state
                                                                                  .fetchSommeCommUSD
                                                                                  .sommeCommissionUSD
                                                                            : this
                                                                                  .state
                                                                                  .fetchBilletageUSD
                                                                            ? this
                                                                                  .state
                                                                                  .fetchBilletageUSD
                                                                                  .sommeMontantUSD
                                                                            : "0.00"
                                                                    }
                                                                />
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
                                                                Montant CDF
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    name="montantCDF"
                                                                    className="form-control font-weight-bold"
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
                                                                            .fetchBilletageCDF &&
                                                                        this
                                                                            .state
                                                                            .fetchSommeCommCDF
                                                                            ? this
                                                                                  .state
                                                                                  .fetchBilletageCDF
                                                                                  .sommeMontantCDF -
                                                                              this
                                                                                  .state
                                                                                  .fetchSommeCommCDF
                                                                                  .sommeCommissionCDF
                                                                            : this
                                                                                  .state
                                                                                  .fetchBilletageCDF
                                                                            ? this
                                                                                  .state
                                                                                  .fetchBilletageCDF
                                                                                  .sommeMontantCDF
                                                                            : "0.00"
                                                                    }
                                                                />
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
                                                                Commission USD
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    name="montantCDF"
                                                                    className="form-control font-weight-bold"
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
                                                                            .fetchSommeCommUSD
                                                                            ? this
                                                                                  .state
                                                                                  .fetchSommeCommUSD
                                                                                  .sommeCommissionUSD
                                                                            : "0.00"
                                                                    }
                                                                />
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
                                                                Commission CDF
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    name="montantCDF"
                                                                    className="form-control font-weight-bold"
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
                                                                            .fetchSommeCommCDF
                                                                            ? this
                                                                                  .state
                                                                                  .fetchSommeCommCDF
                                                                                  .sommeCommissionCDF
                                                                            : "0.00"
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
                                                                parseFloat(
                                                                    this.state
                                                                        .montantUSD
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
                                                                parseFloat(
                                                                    this.state
                                                                        .montantCDF
                                                                ) ? (
                                                                <button
                                                                    disabled
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
                                                                    Valider
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
                                                                    <i className="fas fa-check"></i>
                                                                    Valider
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
                                        </div>
                                        <div className="col-md-5">
                                            <div
                                                className="card-body"
                                                style={{ background: "#fff" }}
                                            >
                                                {/* DEBUT CHAMPS POUR SAISIR LE BILLETAGE EN CDF ET USD */}
                                                {this.state.devise === "USD" ? (
                                                    // BILLETAGE EN DOLLARS
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
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .hundred
                                                                        ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .fitfty
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .twenty
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .ten
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .five
                                                                            ) +
                                                                            parseFloat(
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
                                                        <tr>
                                                            <td></td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "2px",
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
                                                                    this.state
                                                                        .ten *
                                                                        10 +
                                                                    this.state
                                                                        .five *
                                                                        5 +
                                                                    this.state
                                                                        .oneDollar *
                                                                        1 ===
                                                                    parseFloat(
                                                                        this
                                                                            .state
                                                                            .montantUSD
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
                                                                    parseFloat(
                                                                        this
                                                                            .state
                                                                            .montantCDF
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
                                                                                .UpdateBilletageUSD
                                                                        }
                                                                    >
                                                                        {/* <i
                                                                            className={`${
                                                                                this
                                                                                    .state
                                                                                    .loading
                                                                                    ? "spinner-border spinner-border-sm"
                                                                                    : "fas fa-check"
                                                                            }`}
                                                                        ></i> */}
                                                                        Modifier
                                                                        {""}
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
                                                                        {/* <i className="fas fa-check"></i> */}
                                                                        Modifier
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </form>
                                                ) : (
                                                    //BILLETAFE CDF
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
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .vightMille
                                                                        ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .dixMille
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .cinqMille
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .milleFranc
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .cinqCentFr
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .deuxCentFranc
                                                                            ) +
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .centFranc
                                                                            ) +
                                                                            parseFloat(
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

                                                        <tr>
                                                            <td></td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "2px",
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
                                                                    this.state
                                                                        .ten *
                                                                        10 +
                                                                    this.state
                                                                        .five *
                                                                        5 +
                                                                    this.state
                                                                        .oneDollar *
                                                                        1 ===
                                                                    parseFloat(
                                                                        this
                                                                            .state
                                                                            .montantUSD
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
                                                                    parseFloat(
                                                                        this
                                                                            .state
                                                                            .montantCDF
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
                                                                                .UpdateBilletageCDF
                                                                        }
                                                                    >
                                                                        {/* <i
                                                                            className={`${
                                                                                this
                                                                                    .state
                                                                                    .loading
                                                                                    ? "spinner-border spinner-border-sm"
                                                                                    : "fas fa-check"
                                                                            }`}
                                                                        ></i> */}
                                                                        Modifier
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
                                                                        {/* <i className="fas fa-check"></i> */}
                                                                        Modifier
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </form>
                                                )}

                                                {/* FIN CHAMPS POUR SAISIR LE BILLETAGE EN CDF ET USD */}
                                            </div>
                                        </div>

                                        <div
                                            className="col-md-4 appro-table-div"
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                            }}
                                        >
                                            {/* DEBUT   ANCIENNE BILLETATE CDF ET USD */}

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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchBilletageUSD && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .centDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .centDollars
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .cinquanteDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .cinquanteDollars
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .vightDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .vightDollars
                                                                        ) * 20}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .dixDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .dixDollars
                                                                        ) * 10}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .cinqDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .cinqDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .unDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageUSD
                                                                                .unDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td>TOT</td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-success"
                                                                            id="delestage-usd"
                                                                            onClick={
                                                                                this
                                                                                    .delestageUSD
                                                                            }
                                                                        >
                                                                            Délester
                                                                            {/* <i className="fas fa-check"></i> */}
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .fetchBilletageUSD
                                                                                    .centDollars
                                                                            ) *
                                                                                100 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .cinquanteDollars
                                                                                ) *
                                                                                    50 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .vightDollars
                                                                                ) *
                                                                                    20 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .dixDollars
                                                                                ) *
                                                                                    10 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .cinqDollars
                                                                                ) *
                                                                                    5 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .unDollars
                                                                                ) *
                                                                                    1 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSommeCommUSD
                                                                                        ? this
                                                                                              .state
                                                                                              .fetchSommeCommUSD
                                                                                              .sommeCommissionUSD
                                                                                        : 0
                                                                                )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchBilletageCDF && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .vightMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .vightMilleFranc
                                                                        ) *
                                                                            20000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .dixMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .dixMilleFranc
                                                                        ) *
                                                                            10000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinqMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinqMilleFranc
                                                                        ) *
                                                                            5000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .milleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .milleFranc
                                                                        ) *
                                                                            1000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        500 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinqCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinqCentFranc
                                                                        ) * 500}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        200 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .deuxCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .deuxCentFranc
                                                                        ) * 200}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .centFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .centFranc
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinquanteFanc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchBilletageCDF
                                                                                .cinquanteFanc
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        TOT
                                                                    </td>

                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        <button
                                                                            id="delestage-cdf"
                                                                            className="btn btn-success"
                                                                            onClick={
                                                                                this
                                                                                    .delestageCDF
                                                                            }
                                                                        >
                                                                            Délester
                                                                            {/* <i className="fas fa-check"></i> */}
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .fetchBilletageCDF
                                                                                    .vightMilleFranc
                                                                            ) *
                                                                                20000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .dixMilleFranc
                                                                                ) *
                                                                                    10000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .cinqMilleFranc
                                                                                ) *
                                                                                    5000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .milleFranc
                                                                                ) *
                                                                                    1000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .cinqCentFranc
                                                                                ) *
                                                                                    500 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .deuxCentFranc
                                                                                ) *
                                                                                    200 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .centFranc
                                                                                ) *
                                                                                    100 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .cinquanteFanc
                                                                                ) *
                                                                                    50 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSommeCommCDF
                                                                                        ? this
                                                                                              .state
                                                                                              .fetchSommeCommCDF
                                                                                              .sommeCommissionCDF
                                                                                        : 0
                                                                                )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                            {/* FIN ANCIENNE BILLETAGE CDF ET USD */}
                                        </div>
                                    </div>
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
                                        <h3 className="text-muted">
                                            Nouvel billetage
                                        </h3>

                                        <div
                                            className="col-md-6"
                                            style={{
                                                background: "#fff",
                                                padding: "10px",
                                            }}
                                        >
                                            {/* DEBUT    NOUVEL BILLETAGE CDF ET USD */}

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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchNouvelBilletageUSD && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .centDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .centDollars
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .cinquanteDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .cinquanteDollars
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .vightDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .vightDollars
                                                                        ) * 20}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .dixDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .dixDollars
                                                                        ) * 10}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .cinqDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .cinqDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .unDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageUSD
                                                                                .unDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td>TOT</td>
                                                                    <td>
                                                                        <button
                                                                            id="delestage-btn-usd"
                                                                            className="btn btn-success"
                                                                            onClick={
                                                                                this
                                                                                    .saveNewBilletageUSD
                                                                            }
                                                                        >
                                                                            Délester
                                                                            {/* <i className="fas fa-check"></i> */}
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .fetchNouvelBilletageUSD
                                                                                    .centDollars
                                                                            ) *
                                                                                100 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageUSD
                                                                                        .cinquanteDollars
                                                                                ) *
                                                                                    50 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageUSD
                                                                                        .vightDollars
                                                                                ) *
                                                                                    20 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageUSD
                                                                                        .dixDollars
                                                                                ) *
                                                                                    10 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageUSD
                                                                                        .cinqDollars
                                                                                ) *
                                                                                    5 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageUSD
                                                                                        .unDollars
                                                                                ) *
                                                                                    1 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSommeCommUSD
                                                                                        ? this
                                                                                              .state
                                                                                              .fetchSommeCommUSD
                                                                                              .sommeCommissionUSD
                                                                                        : 0
                                                                                )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Montant
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchNouvelBilletageCDF && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .vightMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .vightMilleFranc
                                                                        ) *
                                                                            20000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .dixMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .dixMilleFranc
                                                                        ) *
                                                                            10000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinqMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinqMilleFranc
                                                                        ) *
                                                                            5000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .milleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .milleFranc
                                                                        ) *
                                                                            1000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        500 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinqCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinqCentFranc
                                                                        ) * 500}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        200 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .deuxCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .deuxCentFranc
                                                                        ) * 200}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .centFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .centFranc
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinquanteFanc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseFloat(
                                                                            this
                                                                                .state
                                                                                .fetchNouvelBilletageCDF
                                                                                .cinquanteFanc
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        TOT
                                                                    </td>

                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        <button
                                                                            id="delestage-btn-cdf"
                                                                            className="btn btn-success"
                                                                            onClick={
                                                                                this
                                                                                    .saveNewBilletageCDF
                                                                            }
                                                                        >
                                                                            Délester
                                                                            {/* <i className="fas fa-check"></i> */}
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseFloat(
                                                                                this
                                                                                    .state
                                                                                    .fetchNouvelBilletageCDF
                                                                                    .vightMilleFranc
                                                                            ) *
                                                                                20000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .dixMilleFranc
                                                                                ) *
                                                                                    10000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .cinqMilleFranc
                                                                                ) *
                                                                                    5000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .milleFranc
                                                                                ) *
                                                                                    1000 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .cinqCentFranc
                                                                                ) *
                                                                                    500 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .deuxCentFranc
                                                                                ) *
                                                                                    200 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .centFranc
                                                                                ) *
                                                                                    100 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchNouvelBilletageCDF
                                                                                        .cinquanteFanc
                                                                                ) *
                                                                                    50 +
                                                                                parseFloat(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSommeCommCDF
                                                                                        ? this
                                                                                              .state
                                                                                              .fetchSommeCommCDF
                                                                                              .sommeCommissionCDF
                                                                                        : 0
                                                                                )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* FIN NOUVEL BILLETAGE CDF ET USD */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
