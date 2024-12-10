import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./EnteteRapport";
export default class Tfr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            dateToSearch1: "",
            dateToSearch2: "",
            devise: "",
            fetchData: [],
            getSoldeProduit: null,
            getSoldeCharge: null,
            IsSuccess: false,
            getResultatNetExercice: null,
            getResultatNetExercice_: null,
            getDate: "",
            defaultDate1: null,
            defaultDate2: null,
        };
        this.getData = this.getData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.PrintBtnCDF = this.PrintBtnCDF.bind(this);
        this.PrintBtnUSD = this.PrintBtnUSD.bind(this);
        // this.PrintBtnUSDAndCDF = this.PrintBtnUSDAndCDF.bind(this);
        this.PrintBtnUSD = this.PrintBtnUSD.bind(this);
        this.PrintBtnCDF = this.PrintBtnCDF.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            // document.getElementById("date-debut").value =
            //     moment().format("YYYY-MM-DD");
        }, 1000);

        // let current_datetime = new Date();
        // let formatted_date =
        //     //year
        //     current_datetime.getFullYear() +
        //     "/" +
        //     //month
        //     (current_datetime.getMonth() + 1) +
        //     "/" +
        //     //day
        //     current_datetime.getDate();
        // this.setState({ dateToSearch2: formatted_date });
        this.getUserInfo();
    }

    getUserInfo = async () => {
        const UserInfo = await axios.get("users/getUserInfo");
        this.setState({
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
        const result = await axios.post("/etat-financier/tfr/data", this.state);
        if (result.data.success == 1) {
            this.setState({
                fetchData: result.data.data,
                getSoldeProduit: result.data.soldeProduit,
                getSoldeCharge: result.data.soldeCharge,
                // getResultatNetExercice: result.data.soldeCompte,
                // getResultatNetExercice_: result.data.soldeCompte_,
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
            this.setState({ loading: false });
        }
    };
    //to refresh
    actualiser() {
        location.reload();
    }

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

    // PrintBtnUSDAndCDF(e) {
    //     e.preventDefault();
    //     const printableElements =
    //         document.getElementById("printmeCDFAndUSD").innerHTML;
    //     const orderHtml =
    //         "<html ><head><title></title>  </head><body>" +
    //         printableElements +
    //         "</body></html>";
    //     const oldPage = document.body.innerHTML;
    //     document.body.innerHTML = orderHtml;
    //     window.print();
    //     document.body.innerHTML = oldPage;
    // }

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
        // const numberFormat = (number = 0) => {
        //     var locales = [
        //         //undefined,  // Your own browser
        //         "en-US", // United States
        //         //'de-DE',    // Germany
        //         //'ru-RU',    // Russia
        //         //'hi-IN',    // India
        //     ];
        //     var opts = { minimumFractionDigits: 2 };
        //     var index = 3;
        //     var nombre = number.toLocaleString(locales[index], opts);
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
                                            className="row"
                                            style={{
                                                padding: "10px",
                                                border: "2px solid #fff",
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-md-4">
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
                                                                        htmlFor="devise"
                                                                    >
                                                                        Dévise
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <select
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        id="devise"
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
                                                                <td>
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                        // htmlFor="date-debut"
                                                                    >
                                                                        Date
                                                                        Début
                                                                    </label>
                                                                </td>
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
                                                                        id="date-debut"
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
                                                                        htmlFor="date-fin"
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

                                                            <tr>
                                                                <td></td>
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
                                        {this.state.fetchData.length != 0 &&
                                            this.state.devise == "CDF" && (
                                                <React.Fragment>
                                                    <hr className="solid" />
                                                    <div
                                                        className="row "
                                                        id="printmeCDF"
                                                    >
                                                        <div
                                                            className="card card-to-print "
                                                            style={{
                                                                margin: "0 auto",
                                                                width: "70%",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    margin: "0 auto",
                                                                    width: "70%",
                                                                }}
                                                            >
                                                                {" "}
                                                                <br />
                                                                <br />
                                                                <EnteteRapport />
                                                            </div>
                                                            <div
                                                                className="row title-report"
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
                                                                    TFR CONVERTI
                                                                    EN CDF
                                                                    AFFICHE EN
                                                                    DATE DU{" "}
                                                                    {dateParser(
                                                                        new Date()
                                                                    )}
                                                                </h4>{" "}
                                                            </div>

                                                            <div
                                                                className="card-body"
                                                                style={{
                                                                    marginLeft:
                                                                        "1px",
                                                                    marginRight:
                                                                        "5px",
                                                                    marginTop:
                                                                        "5px",
                                                                }}
                                                            >
                                                                <table
                                                                    className="table tableStyle"
                                                                    style={{
                                                                        padding:
                                                                            "5px",
                                                                        width: "100%",
                                                                        margin: "0 auto",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <td>
                                                                                Code
                                                                            </td>
                                                                            <td>
                                                                                Désignation
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                Montant
                                                                                CDF
                                                                            </td>
                                                                            {/* <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                Montant
                                                                                USD
                                                                            </td> */}
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
                                                                                    >
                                                                                        <td>
                                                                                            {res.RefTypeCompte ==
                                                                                            7
                                                                                                ? "+" +
                                                                                                  res.RefTypeCompte
                                                                                                : "-" +
                                                                                                  res.RefTypeCompte}
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                res.NomCompte
                                                                                            }
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                textAlign:
                                                                                                    "center",
                                                                                            }}
                                                                                        >
                                                                                            {isNaN(
                                                                                                parseInt(
                                                                                                    res.soldeCDF
                                                                                                )
                                                                                            )
                                                                                                ? "0,00"
                                                                                                : numberWithSpaces(
                                                                                                      parseInt(
                                                                                                          res.soldeCDF
                                                                                                      )
                                                                                                  )}
                                                                                        </td>
                                                                                        {/* <td
                                                                                            style={{
                                                                                                textAlign:
                                                                                                    "center",
                                                                                            }}
                                                                                        >
                                                                                            {numberFormat(
                                                                                                parseInt(
                                                                                                    res.soldeUSD
                                                                                                )
                                                                                            )}
                                                                                        </td> */}
                                                                                    </tr>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr
                                                                            style={{
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                                fontSize:
                                                                                    "25px",
                                                                                padding:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            <td>
                                                                                TOT
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "0px",
                                                                                }}
                                                                            ></td>
                                                                            <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSoldeProduit[0]
                                                                                            .soldeProduitCDF -
                                                                                            this
                                                                                                .state
                                                                                                .getSoldeCharge[0]
                                                                                                .soldeChargeCDF
                                                                                    )
                                                                                )
                                                                                    ? "0,00"
                                                                                    : numberWithSpaces(
                                                                                          parseInt(
                                                                                              this
                                                                                                  .state
                                                                                                  .getSoldeProduit[0]
                                                                                                  .soldeProduitCDF -
                                                                                                  this
                                                                                                      .state
                                                                                                      .getSoldeCharge[0]
                                                                                                      .soldeChargeCDF
                                                                                          )
                                                                                      )}
                                                                            </td>
                                                                            {/* <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSoldeProduit[0]
                                                                                            .soldeProduitUSD -
                                                                                            this
                                                                                                .state
                                                                                                .getSoldeCharge[0]
                                                                                                .soldeChargeUSD
                                                                                    )
                                                                                )}
                                                                            </td> */}
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-4"></div>
                                                        <div className="col-md-4"></div>

                                                        <div className="col-md-4 float-end mt-1">
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
                                                            <br />
                                                            <br />
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        {/* USD UNIQUEMENT */}

                                        <React.Fragment>
                                            {this.state.fetchData.length != 0 &&
                                                this.state.devise == "USD" && (
                                                    <React.Fragment>
                                                        <hr className="solid" />
                                                        <div
                                                            className="row "
                                                            id="printmeUSD"
                                                        >
                                                            <div
                                                                className="card card-to-print "
                                                                style={{
                                                                    margin: "0 auto",
                                                                    width: "70%",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        margin: "0 auto",
                                                                        width: "70%",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    <br />
                                                                    <br />
                                                                    <EnteteRapport />
                                                                </div>
                                                                <div
                                                                    className="row title-report"
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
                                                                        TFR
                                                                        CONVERTI
                                                                        EN USD
                                                                        AFFICHE
                                                                        EN DATE
                                                                        DU{" "}
                                                                        {dateParser(
                                                                            new Date()
                                                                        )}
                                                                    </h4>{" "}
                                                                </div>

                                                                <div
                                                                    className="card-body"
                                                                    style={{
                                                                        marginLeft:
                                                                            "1px",
                                                                        marginRight:
                                                                            "5px",
                                                                        marginTop:
                                                                            "5px",
                                                                    }}
                                                                >
                                                                    <table
                                                                        className="table tableStyle"
                                                                        style={{
                                                                            padding:
                                                                                "5px",
                                                                            width: "100%",
                                                                            margin: "0 auto",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        <thead>
                                                                            <tr>
                                                                                <td>
                                                                                    Code
                                                                                </td>
                                                                                <td>
                                                                                    Désignation
                                                                                </td>
                                                                                {/* <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                Montant
                                                                                CDF
                                                                            </td> */}
                                                                                <td
                                                                                    style={{
                                                                                        textAlign:
                                                                                            "center",
                                                                                    }}
                                                                                >
                                                                                    Montant
                                                                                    USD
                                                                                </td>
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
                                                                                        >
                                                                                            <td>
                                                                                                {res.RefTypeCompte ==
                                                                                                7
                                                                                                    ? "+" +
                                                                                                      res.RefTypeCompte
                                                                                                    : "-" +
                                                                                                      res.RefTypeCompte}
                                                                                            </td>
                                                                                            <td>
                                                                                                {
                                                                                                    res.NomCompte
                                                                                                }
                                                                                            </td>
                                                                                            {/* <td
                                                                                            style={{
                                                                                                textAlign:
                                                                                                    "center",
                                                                                            }}
                                                                                        >
                                                                                            {isNaN(
                                                                                                parseInt(
                                                                                                    res.soldeCDF
                                                                                                )
                                                                                            )
                                                                                                ? "0,00"
                                                                                                : numberFormat(
                                                                                                      parseInt(
                                                                                                          res.soldeCDF
                                                                                                      )
                                                                                                  )}
                                                                                        </td> */}

                                                                                            <td
                                                                                                style={{
                                                                                                    textAlign:
                                                                                                        "center",
                                                                                                }}
                                                                                            >
                                                                                                {numberWithSpaces(
                                                                                                    parseInt(
                                                                                                        res.soldeUSD
                                                                                                    )
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                    color: "#fff",
                                                                                    fontSize:
                                                                                        "25px",
                                                                                    padding:
                                                                                        "5px",
                                                                                }}
                                                                            >
                                                                                <td>
                                                                                    TOT
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "0px",
                                                                                    }}
                                                                                ></td>
                                                                                {/* <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                {isNaN(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSoldeProduit[0]
                                                                                            .soldeProduitCDF -
                                                                                            this
                                                                                                .state
                                                                                                .getSoldeCharge[0]
                                                                                                .soldeChargeCDF
                                                                                    )
                                                                                )
                                                                                    ? "0,00"
                                                                                    : numberFormat(
                                                                                          parseInt(
                                                                                              this
                                                                                                  .state
                                                                                                  .getSoldeProduit[0]
                                                                                                  .soldeProduitCDF -
                                                                                                  this
                                                                                                      .state
                                                                                                      .getSoldeCharge[0]
                                                                                                      .soldeChargeCDF
                                                                                          )
                                                                                      )}
                                                                            </td> */}
                                                                                <td
                                                                                    style={{
                                                                                        textAlign:
                                                                                            "center",
                                                                                    }}
                                                                                >
                                                                                    {numberWithSpaces(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .getSoldeProduit[0]
                                                                                                .soldeProduitUSD -
                                                                                                this
                                                                                                    .state
                                                                                                    .getSoldeCharge[0]
                                                                                                    .soldeChargeUSD
                                                                                        )
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-4"></div>
                                                            <div className="col-md-4"></div>

                                                            <div className="col-md-4 float-end mt-1">
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
                                                                <br />
                                                                <br />
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                        </React.Fragment>
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
