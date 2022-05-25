import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class SoldePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
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
        };
        this.actualiser = this.actualiser.bind(this);
        this.getData = this.getData.bind(this);
        this.AfficherReleve = this.AfficherReleve.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.PrintBtnCDF = this.PrintBtnCDF.bind(this);
        this.PrintBtnUSD = this.PrintBtnUSD.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
    }

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
            });
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
        };
        // var inputColor2 = {
        //     height: "25px",
        //     border: "1px solid white",
        //     padding: "3px",
        //     width: "60px",
        // };
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "left",
        };

        let compteur = 1;
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
                                                                    }}
                                                                >
                                                                    {this.state
                                                                        .devise ==
                                                                        "CDF" && (
                                                                        <label>
                                                                            CDF
                                                                            :{" "}
                                                                            <span
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                    color: "#fff",
                                                                                    padding:
                                                                                        "5px",
                                                                                }}
                                                                            >
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreCDF
                                                                                    )
                                                                                )}
                                                                            </span>{" "}
                                                                        </label>
                                                                    )}
                                                                    <br />
                                                                    {this.state
                                                                        .devise ==
                                                                        "USD" && (
                                                                        <label>
                                                                            USD
                                                                            :{" "}
                                                                            <span
                                                                                style={{
                                                                                    background:
                                                                                        "green",
                                                                                    color: "#fff",
                                                                                    padding:
                                                                                        "5px",
                                                                                }}
                                                                            >
                                                                                {numberFormat(
                                                                                    parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getSolde
                                                                                            .soldeMembreUSD
                                                                                    )
                                                                                )}
                                                                            </span>{" "}
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
                                                                        Trouver{" "}
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
                                                                        Afficher{" "}
                                                                        {""}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </table>
                                                </form>
                                            </div>
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
                                                    className="card"
                                                    style={{
                                                        margin: "5px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            margin: "0 auto",
                                                            width: "77%",
                                                        }}
                                                    >
                                                        {" "}
                                                        <br />
                                                        <br />
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <h4>
                                                                <b>
                                                                    ACTION POUR
                                                                    LA PAIX
                                                                    L'EDUCATION
                                                                    ET LE
                                                                    DEFENSE DES
                                                                    DROITS
                                                                    HUMAINS
                                                                </b>
                                                            </h4>
                                                        </div>
                                                        <table
                                                            id="table"
                                                            class="table"
                                                            align="center"
                                                        >
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <img
                                                                        style={{
                                                                            width: "30%",
                                                                            height: "90px",
                                                                        }}
                                                                        src="uploads/membres/default.jpg"
                                                                    />
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        border: "0px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <h3>
                                                                            «A.P.E.D.H»
                                                                        </h3>
                                                                        <p>
                                                                            Goma
                                                                            RDC{" "}
                                                                            <br />
                                                                            Téléphone:
                                                                            +243971926713{" "}
                                                                            <br />
                                                                            Courriel:
                                                                            info@apedh-assoc.org{" "}
                                                                            <br />
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td align="right">
                                                                    <div
                                                                        style={{
                                                                            marginLeft:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        <h4>
                                                                            <b>
                                                                                <img
                                                                                    style={{
                                                                                        width: "30%",
                                                                                        height: " 90px",
                                                                                    }}
                                                                                    src="uploads/membres/default.jpg"
                                                                                />
                                                                            </b>
                                                                        </h4>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
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
                                                                background:
                                                                    "#444",
                                                                padding: "5px",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            RELEVE DE COMPTE
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
                                                            className="row m-0"
                                                            style={{
                                                                width: "100%",
                                                                margin: "0px auto",
                                                                background:
                                                                    "rgb(20,40,100)",
                                                                padding: "5px",
                                                                color: "#fff",
                                                                border: "3px solid #444",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <div className="col-md-6">
                                                                <table
                                                                    className="myhead-table"
                                                                    style={{
                                                                        color: "fff",
                                                                    }}
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
                                                                                    .infoMembre
                                                                                    .NomCompte
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            Compte
                                                                            :
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .infoMembre
                                                                                    .NumCompte
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            Solde
                                                                            :
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getSolde
                                                                                        .soldeMembreCDF
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td>
                                                                            Date
                                                                            Fin:{" "}
                                                                        </td>
                                                                        <td>
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
                                                            className="tableStyle"
                                                            style={{
                                                                background:
                                                                    "#444",
                                                                padding: "5px",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <thead
                                                                style={{
                                                                    background:
                                                                        "rgb(20,40,100)",
                                                                    fontWeight:
                                                                        "bold",
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
                                                                                    {
                                                                                        data.DateTransaction
                                                                                    }
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
                                                                                    {numberFormat(
                                                                                        parseInt(
                                                                                            data.Debitfc
                                                                                        )
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {numberFormat(
                                                                                        parseInt(
                                                                                            data.Creditfc
                                                                                        )
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {numberFormat(
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
                                                            <tfoot>
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
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getTotCDF
                                                                                .totDebit
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
                                                                                .getTotCDF
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
                                                                                .soldeMembreCDF
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-1">
                                                <div className="col-md-6"></div>
                                                <div className="col-md-6">
                                                    <span>
                                                        {/* <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-excel"></i> Exporter
                                            </button> {""}
                                            <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-word"></i> Export
                                            </button> */}{" "}
                                                        <button
                                                            onClick={
                                                                this.PrintBtnCDF
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
                                                    className="card"
                                                    style={{
                                                        margin: "5px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            margin: "0 auto",
                                                            width: "77%",
                                                        }}
                                                    >
                                                        {" "}
                                                        <br />
                                                        <br />
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <h4>
                                                                <b>
                                                                    ACTION POUR
                                                                    LA PAIX
                                                                    L'EDUCATION
                                                                    ET LE
                                                                    DEFENSE DES
                                                                    DROITS
                                                                    HUMAINS
                                                                </b>
                                                            </h4>
                                                        </div>
                                                        <table
                                                            id="table"
                                                            class="table"
                                                            align="center"
                                                        >
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <img
                                                                        style={{
                                                                            width: "30%",
                                                                            height: "90px",
                                                                        }}
                                                                        src="uploads/membres/default.jpg"
                                                                    />
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        border: "0px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <h3>
                                                                            «A.P.E.D.H»
                                                                        </h3>
                                                                        <p>
                                                                            Goma
                                                                            RDC{" "}
                                                                            <br />
                                                                            Téléphone:
                                                                            +243971926713{" "}
                                                                            <br />
                                                                            Courriel:
                                                                            info@apedh-assoc.org{" "}
                                                                            <br />
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td align="right">
                                                                    <div
                                                                        style={{
                                                                            marginLeft:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        <h4>
                                                                            <b>
                                                                                <img
                                                                                    style={{
                                                                                        width: "30%",
                                                                                        height: " 90px",
                                                                                    }}
                                                                                    src="uploads/membres/default.jpg"
                                                                                />
                                                                            </b>
                                                                        </h4>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
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
                                                                background:
                                                                    "#444",
                                                                padding: "5px",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            RELEVE DE COMPTE
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
                                                            className="row m-0"
                                                            style={{
                                                                width: "100%",
                                                                margin: "0px auto",
                                                                background:
                                                                    "rgb(20,40,100)",
                                                                padding: "5px",
                                                                color: "#fff",
                                                                border: "3px solid #444",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <div className="col-md-6">
                                                                <table
                                                                    className="myhead-table"
                                                                    style={{
                                                                        color: "fff",
                                                                    }}
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
                                                                                    .infoMembre
                                                                                    .NomCompte
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            Compte
                                                                            :
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .infoMembre
                                                                                    .NumCompte
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            Solde
                                                                            :
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getSolde
                                                                                        .soldeMembreUSD
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td>
                                                                            Date
                                                                            Début
                                                                            :
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .dateToSearch1
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            Date
                                                                            Fin:{" "}
                                                                        </td>
                                                                        <td>
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
                                                            className="tableStyle"
                                                            style={{
                                                                background:
                                                                    "#444",
                                                                padding: "5px",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <thead
                                                                style={{
                                                                    background:
                                                                        "rgb(20,40,100)",
                                                                    fontWeight:
                                                                        "bold",
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
                                                                                    {
                                                                                        data.DateTransaction
                                                                                    }
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
                                                                                    {numberFormat(
                                                                                        parseInt(
                                                                                            data.Debit$
                                                                                        )
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {numberFormat(
                                                                                        parseInt(
                                                                                            data.Credit$
                                                                                        )
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {numberFormat(
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
                                                            <tfoot>
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
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getTotUSD
                                                                                .totDebit
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
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-1">
                                                <div className="col-md-6"></div>
                                                <div className="col-md-6">
                                                    <span>
                                                        {/* <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-excel"></i> Exporter
                                            </button> {""}
                                            <button type="submit" className="btn btn-success">
                                                <i className="fas fa-file-word"></i> Export
                                            </button> */}{" "}
                                                        <button
                                                            onClick={
                                                                this.PrintBtnUSD
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
                    </div>
                )}
            </React.Fragment>
        );
    }
}
