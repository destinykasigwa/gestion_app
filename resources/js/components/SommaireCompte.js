import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/app.css";
import { EnteteRapport } from "./EnteteRapport";

export default class SommaireCompte extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            DateDebut: "",
            DateFin: "",
            Devise: "",
            SGCompte: "",
            Critere: "",
            // Critere1: "",
            // Critere2: "",
            // Critere3: "",
            // Critere4: "",
            // Critere5: "",
            // Critere6: "",
            valeur: 0,
            fetchData: null,
            fetchDataEncours: null,
            fetchDataSomme: null,
        };
        this.actualiser = this.actualiser.bind(this);
        this.showReport = this.showReport.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
    //to refresh
    actualiser() {
        location.reload();
    }

    showReport = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("/sommaire/compte/data", this.state);

        if (res.data.success == 1) {
            this.setState({
                fetchData: res.data.data,
                fetchDataEncours: res.data.dataencours,
                fetchDataSomme: res.data.soldesearched,
            });
            this.setState({ loading: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading: false });
        }
    };

    render() {
        let myspinner = {
            margin: "5px auto",
            width: "3rem",
            height: "3rem",
            marginTop: "180px",
            border: "0px",
            height: "200px",
        };
        let inputColor = {
            height: "28px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            width: "300px",
        };

        let borderTable = {
            border: "0px",
            padding: "2px",
        };

        let tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "center",
        };
        let labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "3px",
            fontSize: "14px",
        };
        //PERMET DE FORMATER LES DATES
        const dateParser = (num) => {
            const options = {
                // weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            };

            let timestamp = Date.parse(num);

            let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

            return date.toString();
        };
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
        let compteur = 1;
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
                                        <div className="col-md-3">
                                            <div className="card-header">
                                                Période
                                            </div>
                                            <form>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Date Début{" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    marginLeft:
                                                                        "2px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                name="DateDebut"
                                                                className="mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .DateDebut
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
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
                                                            >
                                                                Date Fin{" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    marginLeft:
                                                                        "2px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                name="DateFin"
                                                                className="mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .DateFin
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card-header">
                                                Type compte
                                            </div>

                                            <form>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Dévise{" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <select
                                                                type="date"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    marginLeft:
                                                                        "2px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                name="Devise"
                                                                className="mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Devise
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
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
                                                            >
                                                                S. Grpe compte{" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    marginLeft:
                                                                        "2px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                placeholder="Exemple 33"
                                                                name="SGCompte"
                                                                className="mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .SGCompte
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card-header">
                                                Critère
                                            </div>
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
                                                                Solde{" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                name="Critere"
                                                                value={
                                                                    this.state
                                                                        .Critere
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="=">
                                                                    {"="}
                                                                </option>
                                                                <option value=">">
                                                                    {">"}
                                                                </option>
                                                                <option value="<">
                                                                    {"<"}
                                                                </option>

                                                                <option value="<=">
                                                                    {"<="}
                                                                </option>
                                                                <option value=">=">
                                                                    {">="}
                                                                </option>
                                                                <option value="<>">
                                                                    {"<>"}
                                                                </option>
                                                            </select>
                                                        </td>{" "}
                                                        <td>
                                                            {" "}
                                                            à
                                                            <input
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    border: "1px solid steelblue",
                                                                    marginLeft:
                                                                        "2px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                name="valeur"
                                                                value={
                                                                    this.state
                                                                        .valeur
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr>

                                                    {/* <tr>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Solde ={" "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere1"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere1
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Solde {" > "}
                                                            </label>
                                                        </td>

                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere2"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere2
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
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
                                                            >
                                                                Solde {" = "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere3"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere3
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Solde {" = "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere4"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere4
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
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
                                                            >
                                                                Solde {" < = "}
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere5"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere5
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Solde {" >= "}
                                                            </label>
                                                        </td>

                                                        <td>
                                                            {" "}
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    height: "30px",
                                                                    width: "80px",
                                                                }}
                                                                name="Critere6"
                                                                className="form-control mt-1 font-weight-bold"
                                                                value={
                                                                    this.state
                                                                        .Critere6
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr> */}
                                                </table>
                                            </form>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="card-header">
                                                Action
                                            </div>

                                            <form>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <button
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    width: "100%",
                                                                    height: "30px",
                                                                    fontSize:
                                                                        "10px",
                                                                    marginTop:
                                                                        "12px",
                                                                }}
                                                                className="btn btn-primary"
                                                                id="validerbtn"
                                                                onClick={
                                                                    this
                                                                        .showReport
                                                                }
                                                            >
                                                                <i
                                                                    className={`${
                                                                        this
                                                                            .state
                                                                            .loading
                                                                            ? "spinner-border spinner-border-sm"
                                                                            : "fas fa-desktop"
                                                                    }`}
                                                                ></i>
                                                                Afficher
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    width: "100%",
                                                                    height: "30px",
                                                                    fontSize:
                                                                        "10px",
                                                                    marginTop:
                                                                        "12px",
                                                                    marginLeft:
                                                                        "3px",
                                                                }}
                                                                className="btn btn-success"
                                                                id="validerbtn"
                                                                onClick={
                                                                    this
                                                                        .PrintFunction
                                                                }
                                                            >
                                                                <i className="fas fa-print"></i>
                                                                Imprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                    {/* CDF */}

                                    {this.state.Devise == "CDF" &&
                                        this.state.fetchData && (
                                            <div
                                                className="row"
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                                id="printme"
                                            >
                                                <div
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "80%",
                                                        background: "#fff",
                                                        padding: "10px",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    <EnteteRapport />
                                                    <div
                                                        style={{
                                                            textAlign:
                                                                "center ",
                                                        }}
                                                    >
                                                        <h4
                                                            className="font-weight-bold"
                                                            style={{
                                                                borderBottom:
                                                                    "4px solid green",
                                                            }}
                                                        >
                                                            <b>
                                                                SOMMAIRE DE
                                                                COMPTE DE{" "}
                                                                {dateParser(
                                                                    this.state
                                                                        .DateDebut
                                                                )}{" "}
                                                                AU{" "}
                                                                {dateParser(
                                                                    this.state
                                                                        .DateFin
                                                                )}
                                                            </b>
                                                        </h4>
                                                    </div>
                                                    <h3 className="text-left font-weight-bold">
                                                        Devise: CDF
                                                    </h3>
                                                    <h5 className="text-left font-weight-bold ">
                                                        Encours:{" "}
                                                        {this.state
                                                            .fetchDataSomme
                                                            .length != 0 &&
                                                            numberWithSpaces(
                                                                parseInt(
                                                                    this.state
                                                                        .fetchDataSomme
                                                                        .Solde
                                                                )
                                                            )}
                                                    </h5>
                                                    <table
                                                        className="tableStyle"
                                                        style={{
                                                            background: "#444",
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
                                                                    #
                                                                </td>
                                                                <td scope="col">
                                                                    NumCompte
                                                                </td>
                                                                <td scope="col">
                                                                    Intitulé
                                                                </td>
                                                                <td scope="col">
                                                                    Solde
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
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {
                                                                                    res.NumCompte
                                                                                }{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {
                                                                                    res.NomCompte
                                                                                }{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberWithSpaces(
                                                                                    parseInt(
                                                                                        res.Solde
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                        {/* <tfoot>
                                                            <tr>
                                                                <td>Total</td>
                                                                <td></td>
                                                                <td></td>
                                                                <td>
                                                                    {this.state
                                                                        .fetchDataSomme
                                                                        .length !=
                                                                        0 &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchDataSomme
                                                                                    .Solde
                                                                            )
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        </tfoot> */}
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                    {this.state.Devise == "USD" &&
                                        this.state.fetchData && (
                                            <div
                                                className="row"
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                                id="printme2"
                                            >
                                                <div
                                                    style={{
                                                        margin: "0 auto",
                                                        width: "80%",
                                                        background: "#fff",
                                                        padding: "10px",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    <EnteteRapport />
                                                    <div
                                                        style={{
                                                            textAlign:
                                                                "center ",
                                                        }}
                                                    >
                                                        <h4
                                                            className="font-weight-bold"
                                                            style={{
                                                                borderBottom:
                                                                    "4px solid green",
                                                            }}
                                                        >
                                                            <b>
                                                                SOMMAIRE DE
                                                                COMPTE DE{" "}
                                                                {dateParser(
                                                                    this.state
                                                                        .DateDebut
                                                                )}{" "}
                                                                AU{" "}
                                                                {dateParser(
                                                                    this.state
                                                                        .DateFin
                                                                )}
                                                            </b>
                                                        </h4>
                                                    </div>
                                                    <h3 className="text-left font-weight-bold">
                                                        Devise: USD
                                                    </h3>
                                                    <h5 className="text-left font-weight-bold ">
                                                        Encours:{" "}
                                                        {this.state
                                                            .fetchDataSomme
                                                            .length != 0 &&
                                                            numberWithSpaces(
                                                                parseInt(
                                                                    this.state
                                                                        .fetchDataSomme
                                                                        .Solde
                                                                )
                                                            )}
                                                    </h5>
                                                    <table
                                                        className="tableStyle"
                                                        style={{
                                                            background: "#444",
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
                                                                    #
                                                                </td>
                                                                <td scope="col">
                                                                    NumCompte
                                                                </td>
                                                                <td scope="col">
                                                                    Intitulé
                                                                </td>
                                                                <td scope="col">
                                                                    Solde
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
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {
                                                                                    res.NumCompte
                                                                                }{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {
                                                                                    res.NomCompte
                                                                                }{" "}
                                                                            </td>
                                                                            <td>
                                                                                {" "}
                                                                                {numberWithSpaces(
                                                                                    parseInt(
                                                                                        res.Solde
                                                                                    )
                                                                                )}{" "}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                        {/* <tfoot>
                                                            <tr>
                                                                <td>Total</td>
                                                                <td></td>
                                                                <td></td>
                                                                <td>
                                                                    {this.state
                                                                        .fetchDataSomme
                                                                        .length !=
                                                                        0 &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchDataSomme
                                                                                    .Solde
                                                                            )
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        </tfoot> */}
                                                    </table>
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
