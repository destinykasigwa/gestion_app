"use strict";
import React, { Fragment } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./EnteteRapport";

export default class RemboursementAttendu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            fetchData: [],
            fetchSomme: [],
            dateToSearch1: "",
            dateToSearch2: "",
            defaultDate1: null,
            defaultDate2: null,
            IsSuccess: false,
        };
        this.getData = this.getData.bind(this);
        this.PrintBtn = this.PrintBtn.bind(this);
        this.getDefaultDate = this.getDefaultDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //GET DATA FROM INPUT
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    //to refresh
    actualiser() {
        location.reload();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        this.getDefaultDate();
    }

    getData = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const result = await axios.post(
            "rapport/data/remboursement-attendu",
            this.state
        );
        if (result.data.success == 1) {
            this.setState({
                fetchData: result.data.data,
                fetchSomme: result.data.dataSomme,
                IsSuccess: true,
            });

            this.setState({ loading: false });
        } else if (result.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: result.data.msg,
                icon: "error",
                button: "OK!",
            });
            console.log("non");
            this.setState({ loading: false, IsSuccess: false });
        }
    };

    //GET DEFAULT DATE

    getDefaultDate = async () => {
        const res = await axios.get(
            "rapport/data/remboursement-attendu/defaultdate"
        );
        this.setState({
            defaultDate1: res.data.defaultDate1,
            defaultDate2: res.data.defaultDate2,
        });
        if (!this.state.dateToSearch1 && !this.state.dateToSearch2) {
            this.setState({
                dateToSearch1: res.data.defaultDate1,
                dateToSearch2: res.data.defaultDate2,
            });
        }
        // console.log(this.state.userInfo + "rrrrr");
    };

    //PRINT RELEVE CDF FUNCTION
    PrintBtn(e) {
        e.preventDefault();
        const printableElements = document.getElementById("printme").innerHTML;
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
        let myspinner = {
            margin: "5px auto",
            width: "3rem",
            height: "3rem",
            marginTop: "180px",
            border: "0px",
            height: "200px",
        };
        var tableBorder = {
            border: "1px solid #000",
            fontSize: "14px",
            textAlign: "left",
        };
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
        var inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
        };
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "left",
        };
        let labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "1px",
            fontSize: "14px",
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
                                    className="row"
                                    style={{
                                        padding: "10px",
                                        border: "2px solid #fff",
                                    }}
                                >
                                    <div className="row">
                                        <div
                                            className="col-md-4"
                                            style={{
                                                boxShadow:
                                                    "inset 0 0 5px 5px #888",
                                                padding: "20px",
                                                margin: "4px",
                                            }}
                                        >
                                            <form
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                                // htmlFor="date-debut"
                                                            >
                                                                Date Début
                                                            </label>
                                                        </td>
                                                        <td style={tableBorder}>
                                                            <input
                                                                style={
                                                                    inputColor
                                                                }
                                                                type="date"
                                                                id="date-debut"
                                                                name="dateToSearch1"
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                value={
                                                                    this.state
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
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                                htmlFor="date-fin"
                                                            >
                                                                Date Fin
                                                            </label>
                                                        </td>
                                                        <td style={tableBorder}>
                                                            <input
                                                                style={
                                                                    inputColor
                                                                }
                                                                type="date"
                                                                name="dateToSearch2"
                                                                htmlFor="date-fin"
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                value={
                                                                    this.state
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

                                                    <tr>
                                                        <td></td>
                                                        <td
                                                            style={{
                                                                padding: "4px",
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
                                                                    <i className="fas fa-desktop"></i>{" "}
                                                                    Afficher{" "}
                                                                    {""}
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-primary">
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                    Chargement
                                                                    ...
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {this.state.IsSuccess == true && (
                                    <React.Fragment>
                                        <div
                                            className="card-body card-to-print"
                                            style={{
                                                background: "#dcdcdc",
                                            }}
                                            id="printme"
                                        >
                                            <div
                                                className="row"
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #dcdcdc",
                                                    background: "#fff",
                                                }}
                                            >
                                                <EnteteRapport />
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
                                                            textAlign: "center",
                                                            width: "400px",
                                                            margin: "0px auto",
                                                        }}
                                                    >
                                                        REMBOURSEMENTS ATTENDUS
                                                    </h4>{" "}
                                                </div>

                                                <div className="col-md-12">
                                                    {this.state.fetchData
                                                        .length != 0 && (
                                                        <table
                                                            className="table"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <thead
                                                                style={{
                                                                    background:
                                                                        "#444",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th>
                                                                        Date
                                                                        Tombée
                                                                        Echéance.
                                                                    </th>
                                                                    <th>
                                                                        Num
                                                                        compte
                                                                    </th>
                                                                    <th>
                                                                        Dévise
                                                                    </th>
                                                                    <th>
                                                                        Num
                                                                        Dossier
                                                                    </th>
                                                                    <th>
                                                                        Capital
                                                                        Echu
                                                                    </th>
                                                                    <th>
                                                                        Intéret
                                                                        Echu
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.fetchData.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    index
                                                                                }
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {dateParser(
                                                                                        res.DateTranch
                                                                                    )}
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.NumCompteEpargne
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.CodeMonnaie
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.NumDossier
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.CapAmmorti
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.Interet
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <th
                                                                        style={{
                                                                            border: "0px",
                                                                        }}
                                                                    ></th>
                                                                    <th
                                                                        style={{
                                                                            border: "0px",
                                                                        }}
                                                                    ></th>
                                                                    <th
                                                                        style={{
                                                                            border: "0px",
                                                                        }}
                                                                    ></th>
                                                                    <th></th>
                                                                    <th
                                                                        style={{
                                                                            background:
                                                                                "steelblue",
                                                                            fontSize:
                                                                                "20px",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .fetchSomme &&
                                                                            numberFormat(
                                                                                this
                                                                                    .state
                                                                                    .fetchSomme
                                                                                    .sommeCapApayer
                                                                            )}{" "}
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            background:
                                                                                "steelblue",
                                                                            fontSize:
                                                                                "20px",
                                                                            color: "#fff",
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .fetchSomme
                                                                            .length !=
                                                                            0 &&
                                                                            numberFormat(
                                                                                this
                                                                                    .state
                                                                                    .fetchSomme
                                                                                    .sommeInteretApayer
                                                                            )}{" "}
                                                                    </th>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mb-1">
                                            <div className="col-md-9"></div>
                                            <div className="col-md-3">
                                                <span
                                                    style={{
                                                        float: "right",
                                                    }}
                                                >
                                                    <button
                                                        onClick={this.PrintBtn}
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
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
