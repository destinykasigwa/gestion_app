import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class EntreeTresor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            isloading: true,
            loading: false,
            devise: "",
            fetchBilletageCDF: false,
            fetchBilletageUSD: false,
            fetchDelesatgeCDF: null,
            fetchDelesatgeUSD: null,
        };

        this.actualiser = this.actualiser.bind(this);
        this.getBilletage = this.getBilletage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeItemCDF = this.removeItemCDF.bind(this);
        this.acceptRequestCDF = this.acceptRequestCDF.bind(this);
        this.acceptRequestUSD = this.acceptRequestUSD.bind(this);
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
        this.getBilletage();
    }

    //GET VALUES FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    getBilletage = async () => {
        const result = await axios.get("/delestage/billetage/all");
        this.setState({
            fetchBilletageCDF: result.data.dataCDF,
            fetchBilletageUSD: result.data.dataUSD,
            fetchDelesatgeCDF: result.data.getAllCDF,
            fetchDelesatgeUSD: result.data.getAllUSD,
        });
    };

    removeItemCDF(id) {
        const question = confirm(
            "voulez-vous vraiment supprimé l'élement sélectionné?"
        );
        if (question == true) {
            axios.delete("delete/delestage/cdf/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Suppression",
                        text: response.data.msg,
                        icon: "info",
                        button: "OK!",
                    });
                } else if (response.data.success == 0) {
                    Swal.fire({
                        title: "Erreur",
                        text: response.data.msg,
                        icon: "error",
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
            "vous le vous vraiment supprimé l'élement sélectionné?"
        );
        if (question == true) {
            axios.delete("/delete/delestage/usd/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Suppression",
                        text: response.data.msg,
                        icon: "info",
                        button: "OK!",
                    });
                } else if (response.data.success == 0) {
                    Swal.fire({
                        title: "Erreur",
                        text: response.data.msg,
                        icon: "error",
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

    acceptRequestUSD = async (id) => {
        const question = confirm("voulez vous valider cette opération ?");
        if (question == true) {
            axios.get("/delestage/accept/usd/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Validation",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                    document
                        .getElementById("acceptbtnusd")
                        .setAttribute("disabled", "disabled");
                }
            });
        } else {
            Swal.fire({
                title: "Validation",
                text: "Validation annulée",
                icon: "info",
                button: "OK!",
            });
        }
    };

    acceptRequestCDF = async (id) => {
        const question = confirm("voulez vous valider cette opération ?");
        if (question == true) {
            axios.get("delestage/accept/cdf/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Validation",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                }
                document
                    .getElementById("acceptbtncdf")
                    .setAttribute("disabled", "disabled");
            });
        } else {
            Swal.fire({
                title: "Validation",
                text: "Validation annulée",
                icon: "info",
                button: "OK!",
            });
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
            height: "30px",
            border: "1px solid steelblue",
            borderRadius: "0px",
            fontWeight: "bold",
        };

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
                                    <div style={{ padding: "10px" }}>
                                        <table>
                                            <tr>
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
                                                                this.state
                                                                    .disabled
                                                                    ? "disabled"
                                                                    : ""
                                                            }
                                                            style={inputColor}
                                                            value={
                                                                this.state
                                                                    .devise
                                                            }
                                                        >
                                                            <option value="">
                                                                Sélectionnez la
                                                                divise
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
                                        </table>
                                    </div>
                                    {this.state.devise && (
                                        <div
                                            className="row"
                                            style={{
                                                padding: "10px",
                                                border: "2px solid #fff",
                                            }}
                                        >
                                            <div className="col-md-6">
                                                <div
                                                    className="card-body"
                                                    style={{
                                                        background: "#fff",
                                                    }}
                                                >
                                                    {/* TABEAU DE BILLETAGE */}
                                                    {/* DEBUT   ANCIENNE BILLETATE CDF ET USD */}

                                                    {this.state.devise ==
                                                    "USD" ? (
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
                                                                                100
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .centDollars
                                                                                ) *
                                                                                    100}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                50
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .cinquanteDollars
                                                                                ) *
                                                                                    50}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                20
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .vightDollars
                                                                                ) *
                                                                                    20}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                10
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .dixDollars
                                                                                ) *
                                                                                    10}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                5
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .cinqDollars
                                                                                ) *
                                                                                    5}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                1
                                                                                X
                                                                            </td>

                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                {parseInt(
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageUSD
                                                                                        .unDollars
                                                                                ) *
                                                                                    5}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                tableBorder,
                                                                            }}
                                                                        >
                                                                            <td>
                                                                                TOT
                                                                            </td>
                                                                            <td>
                                                                                {/* <button
                                                                           className="btn btn-success"
                                                                           id="delestage-usd"
                                                                           onClick={
                                                                               this
                                                                                   .delestageUSD
                                                                           }
                                                                       >
                                                                           Délester
                                                                         
                                                                       </button> */}
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
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .fetchBilletageUSD
                                                                                            .centDollars
                                                                                    ) *
                                                                                        100 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageUSD
                                                                                                .cinquanteDollars
                                                                                        ) *
                                                                                            50 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageUSD
                                                                                                .vightDollars
                                                                                        ) *
                                                                                            20 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageUSD
                                                                                                .dixDollars
                                                                                        ) *
                                                                                            10 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageUSD
                                                                                                .cinqDollars
                                                                                        ) *
                                                                                            5 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageUSD
                                                                                                .unDollars
                                                                                        ) *
                                                                                            1
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
                                                                                20
                                                                                000
                                                                                X
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
                                                                                {parseInt(
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
                                                                                10
                                                                                000
                                                                                X
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
                                                                                {parseInt(
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
                                                                                5000
                                                                                X
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
                                                                                {parseInt(
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
                                                                                1000
                                                                                X
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
                                                                                {parseInt(
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
                                                                                500
                                                                                X
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .cinqCentFranc
                                                                                ) *
                                                                                    500}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                200
                                                                                X
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .deuxCentFranc
                                                                                ) *
                                                                                    200}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                100
                                                                                X
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .centFranc
                                                                                ) *
                                                                                    100}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                50
                                                                                X
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
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchBilletageCDF
                                                                                        .cinquanteFanc
                                                                                ) *
                                                                                    50}
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
                                                                                {/* <button
                                                                           id="delestage-cdf"
                                                                           className="btn btn-success"
                                                                           onClick={
                                                                               this
                                                                                   .delestageCDF
                                                                           }
                                                                       >
                                                                           Délester
                                                                          
                                                                       </button> */}
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
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .fetchBilletageCDF
                                                                                            .vightMilleFranc
                                                                                    ) *
                                                                                        20000 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .dixMilleFranc
                                                                                        ) *
                                                                                            10000 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .cinqMilleFranc
                                                                                        ) *
                                                                                            5000 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .milleFranc
                                                                                        ) *
                                                                                            1000 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .cinqCentFranc
                                                                                        ) *
                                                                                            500 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .deuxCentFranc
                                                                                        ) *
                                                                                            200 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .centFranc
                                                                                        ) *
                                                                                            100 +
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .fetchBilletageCDF
                                                                                                .cinquanteFanc
                                                                                        ) *
                                                                                            50
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
                                            {/* AFFICHE LES DELESTAGE EN ATTENTE DE VALIDATION */}
                                            <div
                                                className="col-md-6"
                                                style={{
                                                    background: "#fff",
                                                    padding: "10px",
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
                                                                    Nom
                                                                    caissier(ère)
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    Montant USD
                                                                    + Commission
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
                                                                .fetchDelesatgeUSD &&
                                                                this.state.fetchDelesatgeUSD.map(
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
                                                                                        res.NomUtilisateur
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.montantUSD
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        class="btn-group"
                                                                                        role="group"
                                                                                        aria-label="Basic example"
                                                                                    >
                                                                                        <button
                                                                                            id="acceptbtnusd"
                                                                                            type="button"
                                                                                            className="btn btn-primary"
                                                                                            onClick={() => {
                                                                                                this.acceptRequestUSD(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            <i className="fas fa-check"></i>
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-danger"
                                                                                            onClick={() => {
                                                                                                this.removeItemUSD(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            <i className="fas fa-trash"></i>
                                                                                        </button>
                                                                                    </div>
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
                                                                    Nom
                                                                    caissier(ère)
                                                                </td>

                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    Montant CDF
                                                                    + Commission
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
                                                                .fetchDelesatgeCDF &&
                                                                this.state.fetchDelesatgeCDF.map(
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
                                                                                        res.NomUtilisateur
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.montantCDF
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        class="btn-group"
                                                                                        role="group"
                                                                                        aria-label="Basic example"
                                                                                    >
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-primary"
                                                                                            onClick={() => {
                                                                                                this.acceptRequestCDF(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            <i className="fas fa-check"></i>
                                                                                        </button>
                                                                                        <button
                                                                                            id="acceptbtncdf"
                                                                                            type="button"
                                                                                            className="btn btn-danger"
                                                                                            onClick={() => {
                                                                                                this.removeItemCDF(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            <i className="fas fa-trash"></i>
                                                                                        </button>
                                                                                    </div>
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
