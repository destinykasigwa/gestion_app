import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/app.css";
import MendataireTable from "./MendataireTable";

export default class Positionnement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            DateTransaction: "",
            operant: "",
            beneficiaire: "",
            codeAgence: "20",
            libelle: "",
            adresse: "",
            typepiece: "",
            numpiece: "",
            lieuNaiss: "",
            sexe: "",
            phone1: "",
            devise: "",
            profession: "",
            CommuneActuelle: "",
            QuartierActuelle: "",
            telBeneficiaire: "",
            otherMention: "",
            montant: "",
            Reference: "",
            error_list: [],
            fetchData: null,
            compteToSearch: "",
            refCompte: "",
            typeDocument: "",
            numDocument: "",
            getSommeCDF: null,
            getSommeUSD: null,
            getMembreSolde: null,
            soldeCDF: "",
            soldeUSD: "",
            getAllOperat: null,
            getCompteurDocument: null,
            soldeCDF: "",
            soldeUSD: "",
            checkSign: false,
        };
        this.handleAccount = this.handleAccount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.getAllOperation = this.getAllOperation.bind(this);
        this.checkSignature = this.checkSignature.bind(this);
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
        this.getAllOperation();
    }
    //GET DATA FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }
    //GET A SEACHED NUMBER
    handleAccount = async (e) => {
        e.preventDefault();
        const getData = await axios.get(
            "compte/search/" + this.state.compteToSearch
        );
        if (getData.data.success == 1) {
            this.setState({
                fetchData: getData.data.data[0],
                // getMembreSolde: getData.data.soldeMembre,
                getCompteurDocument: getData.data.numdoc,
            });
            this.setState({
                disabled: !this.state.disabled,
                refCompte: this.state.compteToSearch,
                // refCompte: this.state.fetchData.refCompte,
                numCompte: this.state.fetchData.numCompte,
                operant: this.state.fetchData.intituleCompte,
                soldeCDF: getData.data.soldeMembreCDF[0].soldeMembreCDF,
                soldeUSD: getData.data.soldeMembreUSD[0].soldeMembreUSD,
                adresse:
                    this.state.fetchData.CommuneActuelle +
                    " " +
                    this.state.fetchData.QuartierActuelle,
                telBeneficiaire: this.state.fetchData.phone1,
                typepiece: this.state.fetchData.typepiece,
                numpiece: this.state.fetchData.numpiece,
                beneficiaire: this.state.fetchData.intituleCompte,
                numDocument: "DC000" + this.state.getCompteurDocument,
            });
            console.log(this.state.fetchData);
            //disabled valider button
            document
                .getElementById("validerbtn")
                .removeAttribute("disabled", "disabled");
        } else {
            Swal.fire({
                title: "Erreur",
                text: getData.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
        console.log(this.state.fetchData);
    };

    saveOperation = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        if (this.state.checkSign == true) {
            const res = await axios.post("/positionnement/espece", this.state);
            if (res.data.success == 0) {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ loading: false });
            } else if (res.data.success == 1) {
                Swal.fire({
                    title: "Positionnement",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
                this.setState({ loading: false });

                this.setState({
                    disabled: !this.state.disabled,
                    loading: false,
                });
                document
                    .getElementById("validerbtn")
                    .setAttribute("disabled", "disabled");
                document
                    .getElementById("printbtn")
                    .removeAttribute("disabled", "disabled");
            } else {
                this.setState({
                    loading: false,
                    error_list: res.data.validate_error,
                });
            }
            console.log(res.data.success);
        } else {
            Swal.fire({
                title: "Verification de signature",
                text: "Vous n'avez pas verifié la signature.",
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading: false });
        }
    };

    //RECUPERE TOUTES LES OPERATIONS DE POSITIONNEMENT DEJA EFFECTUE
    getAllOperation = async () => {
        const getOperation = await axios.get("/positionnement/getalloperation");
        this.setState({ getAllOperat: getOperation.data.data });
        console.log(getOperation.data.data);
    };

    //POUR VERIFIER LA SIGNATURE

    checkSignature = async (e) => {
        e.preventDefault();
        this.setState({ checkSign: true });
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
            height: "25px !important",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            marginTop: "2px",
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
                                        <div className="col-md-2">
                                            <form
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Numéro compte..."
                                                        name="compteToSearch"
                                                        value={
                                                            this.state
                                                                .compteToSearch
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                    />
                                                    <td>
                                                        <button
                                                            type="button"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                width: "100%",
                                                                height: "28px",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                            className="btn btn-primary"
                                                            onClick={
                                                                this
                                                                    .handleAccount
                                                            }
                                                        >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </td>
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        style={{
                                                            height: "40px",
                                                            background:
                                                                "#dcdcdc",
                                                            border: "4px solid #fff",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .fetchData &&
                                                            this.state.fetchData
                                                                .numCompte
                                                        }
                                                    />
                                                </div>
                                            </form>
                                        </div>

                                        {/* separate */}

                                        <div className="col-md-4">
                                            <div
                                                className="card-body"
                                                style={{
                                                    background: "#dcdcdc",
                                                }}
                                            >
                                                <form
                                                    style={{
                                                        padding: "10px",
                                                        border: "2px solid #fff",
                                                        marginTop: "-15px",
                                                    }}
                                                >
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
                                                            <div className="input-group input-group-sm ">
                                                                <select
                                                                    name="devise"
                                                                    className={`form-control ${
                                                                        this
                                                                            .state
                                                                            .error_list
                                                                            .devise &&
                                                                        "is-invalid"
                                                                    }`}
                                                                    onChange={
                                                                        this
                                                                            .handleChange
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
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Intitulé c.
                                                                </label>
                                                            </td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        boxShadow:
                                                                            "inset 0 0 5px 5px #888",
                                                                        fontSize:
                                                                            "15px",
                                                                        marginTop:
                                                                            "2px",
                                                                    }}
                                                                    name="intituleCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .intituleCompte
                                                                            ? this
                                                                                  .state
                                                                                  .intituleCompte
                                                                            : this
                                                                                  .state
                                                                                  .fetchData &&
                                                                              this
                                                                                  .state
                                                                                  .fetchData
                                                                                  .intituleCompte
                                                                    }
                                                                    disabled
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Compte
                                                                </label>{" "}
                                                            </td>
                                                            <div className="input-group input-group-sm ">
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
                                                                    name="numCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .numCompte
                                                                            ? this
                                                                                  .state
                                                                                  .numCompte
                                                                            : this
                                                                                  .state
                                                                                  .fetchData &&
                                                                              this
                                                                                  .state
                                                                                  .fetchData
                                                                                  .numCompte
                                                                    }
                                                                    disabled
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div
                                                className="card-body"
                                                style={{
                                                    background: "#dcdcdc",
                                                }}
                                            >
                                                <form
                                                    style={{
                                                        padding: "10px",
                                                        border: "2px solid #fff",
                                                        marginTop: "-15px",
                                                    }}
                                                >
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Solde Min.
                                                                </label>
                                                            </td>
                                                            <div className="input-group input-group-sm ">
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
                                                                    name="intituleCompte"
                                                                    value={
                                                                        "0,00"
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Solde USD
                                                                </label>{" "}
                                                            </td>
                                                            <div className="input-group input-group-sm ">
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
                                                                    name="intituleCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .soldeUSD &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .soldeUSD
                                                                            )
                                                                        )
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Solde CDF
                                                                </label>{" "}
                                                            </td>
                                                            <div className="input-group input-group-sm ">
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
                                                                    name="intituleCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .soldeCDF &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .soldeCDF
                                                                            )
                                                                        )
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className="col-md-7"
                                            style={{
                                                background: "#dcdcdc",
                                                padding: "5px",
                                            }}
                                        >
                                            <form
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                    marginTop: "0px",
                                                    background: "#fff",
                                                }}
                                            >
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                    color: "steelblue",
                                                                    padding:
                                                                        "2px",
                                                                }}
                                                            >
                                                                <strong>
                                                                    Montant{" "}
                                                                </strong>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    name="montant"
                                                                    className={`form-control ${
                                                                        this
                                                                            .state
                                                                            .error_list
                                                                            .montant &&
                                                                        "is-invalid"
                                                                    }`}
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .montant
                                                                    }
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .disabled
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Document
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm ">
                                                                <select
                                                                    name="typeDocument"
                                                                    className={`form-control ${
                                                                        this
                                                                            .state
                                                                            .error_list
                                                                            .typeDocument &&
                                                                        "is-invalid"
                                                                    }`}
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .typeDocument
                                                                    }
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .disabled
                                                                            ? "disabled"
                                                                            : ""
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Sélectionnez
                                                                    </option>
                                                                    <option value="Visa retrait">
                                                                        Visa
                                                                        retrait
                                                                    </option>
                                                                    <option value="Bon de dépense">
                                                                        Bon de
                                                                        dépense
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                N° doc.
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className={`form-control ${
                                                                    this.state
                                                                        .error_list
                                                                        .numDocument &&
                                                                    "is-invalid"
                                                                }`}
                                                                name="numDocument"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .numDocument
                                                                }
                                                                disabled
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                            <div
                                                className="row"
                                                style={{
                                                    border: "2px #fff solid",
                                                }}
                                            >
                                                <div
                                                    className="col-md-2"
                                                    style={{
                                                        background: "#dcdcdc",
                                                        padding: "5px",
                                                    }}
                                                >
                                                    <form
                                                        style={{
                                                            padding: "5px",
                                                            border: "2px solid #dcdcdc",
                                                        }}
                                                    >
                                                        <div class="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="mendataire"
                                                                id="ProprietaireRadio"
                                                                value="option1"
                                                                checked
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="ProprietaireRadio"
                                                            >
                                                                Propriétaire
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="mendataire"
                                                                id="MendataireRadio"
                                                                value="option2"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="MendataireRadio"
                                                            >
                                                                Mandataire
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="mendataire"
                                                                id="AutreRadio"
                                                                value="option3"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="AutreRadio"
                                                            >
                                                                Autre
                                                            </label>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div
                                                    className="col-md-10"
                                                    style={{
                                                        background: "#dcdcdc",
                                                        padding: "0px",
                                                    }}
                                                >
                                                    <form
                                                        style={{
                                                            padding: "10px",
                                                            border: "2px solid #dcdcdc",
                                                        }}
                                                    >
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Nom bén.
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        name="beneficiaire"
                                                                        type="text"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .beneficiaire
                                                                                ? this
                                                                                      .state
                                                                                      .beneficiaire
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .intituleCompte
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </div>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Adresse
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="adresse"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .CommuneActuelle
                                                                                ? this
                                                                                      .state
                                                                                      .CommuneActuelle
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .CommuneActuelle +
                                                                                      " " +
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .QuartierActuelle &&
                                                                                  ""
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                            // ? "disabled"
                                                                            // : ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </div>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Pce
                                                                        d'indent.
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            name="typepiece"
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
                                                                                    .typepiece
                                                                                    ? this
                                                                                          .state
                                                                                          .typepiece
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .typepiece
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="Carte d'électeur">
                                                                                Carte
                                                                                d'électeur
                                                                            </option>
                                                                            <option value="Pass port">
                                                                                Pass
                                                                                port
                                                                            </option>
                                                                            <option value="Sans carte">
                                                                                Sans
                                                                                carte
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        N° Pièce
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            name="numpiece"
                                                                            className="form-control"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            style={
                                                                                inputColor
                                                                            }
                                                                            disabled={
                                                                                this
                                                                                    .state
                                                                                    .disabled
                                                                                    ? "disabled"
                                                                                    : ""
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .numpiece
                                                                                    ? this
                                                                                          .state
                                                                                          .numpiece
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .numpiece
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Réf.
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="Reference"
                                                                        type="text"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Reference
                                                                                ? this
                                                                                      .state
                                                                                      .Reference
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .Reference
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Tél
                                                                        déposant
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            className="form-control input-lg"
                                                                            type="text"
                                                                            style={
                                                                                inputColor
                                                                            }
                                                                            name="telBeneficiaire"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .telBeneficiaire
                                                                                    ? this
                                                                                          .state
                                                                                          .telBeneficiaire
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .phone1
                                                                            }
                                                                            disabled={
                                                                                this
                                                                                    .state
                                                                                    .disabled
                                                                                    ? "disabled"
                                                                                    : ""
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td></td>
                                                                <td
                                                                    style={{
                                                                        border: "0px",
                                                                    }}
                                                                >
                                                                    {" "}
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
                                                                        Valider{" "}
                                                                        {""}
                                                                        {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td
                                                                    style={{
                                                                        border: "0px",
                                                                    }}
                                                                >
                                                                    {" "}
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
                                                                        className="btn btn-success"
                                                                        id="printbtn"
                                                                        onClick=""
                                                                    >
                                                                        <i className="fas fa-print"></i>{" "}
                                                                        Impr{" "}
                                                                        {""}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-5">
                                            <ul
                                                className="nav nav-tabs"
                                                id="myTab"
                                                role="tablist"
                                                style={{
                                                    fontWeight: "bold",
                                                    background: "#dcdcdc",
                                                    color: "#fff",
                                                    padding: "5px",
                                                }}
                                            >
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link active"
                                                        id="identite-tab"
                                                        data-toggle="tab"
                                                        href="#identite"
                                                        role="tab"
                                                        aria-controls="identite"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Identité
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        id="mendataire-tab"
                                                        data-toggle="tab"
                                                        href="#mendataire"
                                                        role="tab"
                                                        aria-controls="mendataire"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Mandataire
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        id="mendataire-tab"
                                                        data-toggle="tab"
                                                        href="#signature"
                                                        role="tab"
                                                        aria-controls="signature"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Signature tut. compte
                                                    </a>
                                                </li>
                                            </ul>
                                            <div
                                                className="tab-content"
                                                id="myTabContent"
                                            >
                                                <div
                                                    className="tab-pane fade show active mt-2 col-md-12 "
                                                    id="identite"
                                                    role="tabpanel"
                                                    aria-labelledby="identite-tab"
                                                >
                                                    <div
                                                        className="row"
                                                        style={{
                                                            padding: "10px",
                                                            // border: "2px solid #fff",
                                                        }}
                                                    >
                                                        <div className="col-lg-12">
                                                            <div className="card card-default">
                                                                <div
                                                                    className="card-header"
                                                                    style={{
                                                                        background:
                                                                            "#DCDCDC",
                                                                        textAlign:
                                                                            "center",
                                                                        color: "#fff",
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .intituleCompte
                                                                                        ? this
                                                                                              .state
                                                                                              .intituleCompte
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .intituleCompte
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .lieuNaiss
                                                                                        ? this
                                                                                              .state
                                                                                              .lieuNaiss
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .lieuNaiss
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .sexe
                                                                                        ? this
                                                                                              .state
                                                                                              .sexe
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .sexe
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .typepiece
                                                                                        ? this
                                                                                              .state
                                                                                              .typepiece
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .typepiece
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .phone1
                                                                                        ? this
                                                                                              .state
                                                                                              .phone1
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .phone1
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                    <tr>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .otherMention
                                                                                        ? this
                                                                                              .state
                                                                                              .otherMention
                                                                                        : this
                                                                                              .state
                                                                                              .fetchData &&
                                                                                          this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .otherMention
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <tr>
                                                                        <td></td>
                                                                        <td>
                                                                            <img
                                                                                src={`uploads/membres/${
                                                                                    this
                                                                                        .state
                                                                                        .fetchData
                                                                                        ? this
                                                                                              .state
                                                                                              .fetchData
                                                                                              .photoMembre
                                                                                        : "default.jpg"
                                                                                }`}
                                                                                alt="photo-du-membre"
                                                                                className="img-thumbnail"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="tab-pane fade  mt-2 col-md-12 "
                                                    id="mendataire"
                                                    role="tabpanel"
                                                    aria-labelledby="mendataire-tab"
                                                >
                                                    <div
                                                        className="row"
                                                        style={{
                                                            padding: "10px",
                                                            // border: "2px solid #fff",
                                                        }}
                                                    >
                                                        <div className="col-lg-12">
                                                            <div className="card card-default">
                                                                <div
                                                                    className="card-header"
                                                                    style={{
                                                                        background:
                                                                            "#DCDCDC",
                                                                        textAlign:
                                                                            "center",
                                                                        color: "#fff",
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <div className="row">
                                                                <MendataireTable
                                                                    num={
                                                                        this
                                                                            .state
                                                                            .compteToSearch &&
                                                                        this
                                                                            .state
                                                                            .compteToSearch
                                                                    }
                                                                    refCompt={
                                                                        this
                                                                            .state
                                                                            .fetchData &&
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            .refCompte
                                                                    }
                                                                    membreImage={
                                                                        this
                                                                            .state
                                                                            .fetchData &&
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            .photoMembre
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="tab-pane fade  mt-2 col-md-12 "
                                                    id="signature"
                                                    role="tabpanel"
                                                    aria-labelledby="signature-tab"
                                                >
                                                    <div
                                                        className="row"
                                                        style={{
                                                            padding: "10px",
                                                            // border: "2px solid #fff",
                                                        }}
                                                    >
                                                        <div className="col-lg-12">
                                                            <div className="card card-default">
                                                                <div
                                                                    className="card-header"
                                                                    style={{
                                                                        background:
                                                                            "#DCDCDC",
                                                                        textAlign:
                                                                            "center",
                                                                        color: "#fff",
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <div className="row">
                                                                {this.state
                                                                    .fetchData && (
                                                                    <div className="col-md-12 positionnement-table-div">
                                                                        <table>
                                                                            <tr>
                                                                                <td>
                                                                                    <img
                                                                                        src={`uploads/membres/signatures/${
                                                                                            this
                                                                                                .state
                                                                                                .fetchData
                                                                                                ? this
                                                                                                      .state
                                                                                                      .fetchData
                                                                                                      .signatureMembre
                                                                                                : "default.jpg"
                                                                                        }`}
                                                                                        alt="Aucune signature"
                                                                                        className="img-thumbnail"
                                                                                        width="500"
                                                                                        height="150"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    {" "}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    {this
                                                                                        .state
                                                                                        .checkSign ==
                                                                                    true ? (
                                                                                        <button
                                                                                            style={{
                                                                                                height: "auto",
                                                                                                float: "right",
                                                                                                border: "0px",
                                                                                                padding:
                                                                                                    "5px",
                                                                                                marginLeft:
                                                                                                    "5px",
                                                                                                marginBottom:
                                                                                                    "5px",
                                                                                            }}
                                                                                            className="btn btn-success"
                                                                                            onClick={
                                                                                                this
                                                                                                    .checkSignature
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-check"></i>{" "}
                                                                                            Signature
                                                                                            verifiée
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button
                                                                                            style={{
                                                                                                height: "auto",
                                                                                                float: "right",

                                                                                                padding:
                                                                                                    "5px",
                                                                                                marginLeft:
                                                                                                    "5px",
                                                                                                marginBottom:
                                                                                                    "5px",
                                                                                                border: "0px",
                                                                                            }}
                                                                                            className="btn btn-primary"
                                                                                            onClick={
                                                                                                this
                                                                                                    .checkSignature
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-info"></i>{" "}
                                                                                            Vérifier
                                                                                            la
                                                                                            signature
                                                                                        </button>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="row"
                                        style={{
                                            background: "#dcdcdc",
                                            padding: "5px",
                                        }}
                                    >
                                        <div>
                                            <div className="col-md-6  positionnement-table-div">
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
                                                                #
                                                            </td>
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
                                                                Num compte
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
                                                            .getAllOperat &&
                                                            this.state.getAllOperat.map(
                                                                (
                                                                    res,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <React.Fragment>
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
                                                                                        res.NumDocument
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.NumCompte
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={
                                                                                        tableBorder
                                                                                    }
                                                                                >
                                                                                    {res.CodeMonnaie ==
                                                                                    "USD"
                                                                                        ? numberFormat(
                                                                                              parseInt(
                                                                                                  res.Montant
                                                                                              )
                                                                                          ) +
                                                                                          " USD"
                                                                                        : numberFormat(
                                                                                              parseInt(
                                                                                                  res.Montant
                                                                                              )
                                                                                          ) +
                                                                                          " CDF"}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
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
