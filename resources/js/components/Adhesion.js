import React from "react";
// import ReactDOM from "react-dom";
import axios from "axios";
// import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Mendataire from "./Mendataire";
import PersonneLie from "./PesonneLie";
import UpdateMembre from "./Modals/UpdateMembre";
import ActivationCompte from "./ActivationCompte";
import WebCame from "./WebCame";
import AddSignatureOnAccount from "./AddSignatureOnAccount";
import ModalSignature from "./Modals/ModalSignature";

// import EditMembre from './EditMembre';

class Adhesion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: true,
            disabled: true,
            compteToSearch: "",
            codeAgence: "20",
            codeMonaie: "USD",
            intituleCompte: "",
            produitEpargne: "",
            typeClient: "",
            // refCompte:"655",
            guichetAdresse: "GOMA",
            numCompte: "",
            dateOuverture: new Date(),
            lieuNaiss: "",
            dateNaiss: "",
            etatCivile: "",
            conjoitName: "",
            fatherName: "",
            motherName: "",
            profession: "",
            workingPlace: "",
            cilivilty: "",
            sexe: "",
            phone1: "",
            phone2: "",
            email: "",
            typepiece: "",
            numpiece: "",
            delivrancePlace: "",
            delivranceDate: "",
            gestionnaire: "",
            provinceOrigine: "",
            territoireOrigine: "",
            collectiviteOrigine: "",
            provinceActuelle: "",
            villeActuelle: "",
            CommuneActuelle: "",
            QuartierActuelle: "",
            parainAccount: "",
            parainName: "",
            typeGestion: "",
            critere1: "",
            otherMention: "",
            activationCompte: "false",
            fetchData: null,
            fetchLastId: [],
            error_list: [],
            compteAbrege: "",
            MontantPremiereMise: "",
            userInfo: null,
            salarieCompte: "",
        };
        this.textInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleGetRow = this.handleGetRow.bind(this);
        // this.handUpdate=this.handUpdate.bind(this);
        // this.handleUpdate=this.handleUpdate.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            document
                .getElementById("modifierbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("validerbtn")
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
        this.setState({ dateOuverture: formatted_date });
        this.getUserInfo();
    }

    //put focus on given input
    focusTextInput() {
        this.textInput.current.focus();
    }
    //CHECK IF ITS A ALLOWED USER OR NOT
    getUserInfo = async () => {
        const UserInfo = await axios.get("users/getUserInfo");
        this.setState({ userInfo: UserInfo.data.Role });
        // console.log(this.state.userInfo + "rrrrr");
    };
    //add new account number
    handleNew = async (e) => {
        e.preventDefault();
        this.setState({ isloading: true });
        const getData = await axios.post("/createnew");
        const contAbreg = getData.data.lastId;
        if (contAbreg < 10) {
            this.setState({
                numCompte: "330000000" + getData.data.lastId + "201",
                compteAbrege: getData.data.lastId,
                // compteAbrege: getData.data.lastId + "20",
            });
        } else if (contAbreg >= 10 && contAbreg < 100) {
            this.setState({
                numCompte: "33000000" + getData.data.lastId + "201",
                compteAbrege: getData.data.lastId,
                // compteAbrege: getData.data.lastId + "20",
            });
        } else if (contAbreg >= 100 && contAbreg < 1000) {
            this.setState({
                numCompte: "3300000" + getData.data.lastId + "201",
                compteAbrege: getData.data.lastId,
                // compteAbrege: getData.data.lastId + "20",
            });
        } else if (contAbreg >= 1000 && contAbreg < 10000) {
            this.setState({
                numCompte: "330000" + getData.data.lastId + "201",
                compteAbrege: getData.data.lastId,
                // compteAbrege: getData.data.lastId + "20",
            });
        }

        console.log(contAbreg);
        // console.log(this.state.fetchLastId);
        //clean data in all in put

        this.setState({
            compteToSearch: "",
            intituleCompte: "",
            produitEpargne: "",
            typeClient: "",
            lieuNaiss: "",
            dateNaiss: "",
            etatCivile: "",
            conjoitName: "",
            fatherName: "",
            motherName: "",
            profession: "",
            workingPlace: "",
            cilivilty: "",
            sexe: "",
            phone1: "243",
            phone2: "243",
            email: "",
            typepiece: "",
            numpiece: "",
            delivrancePlace: "",
            delivranceDate: "",
            gestionnaire: "",
            provinceOrigine: "",
            territoireOrigine: "",
            collectiviteOrigine: "",
            provinceActuelle: "",
            villeActuelle: "",
            CommuneActuelle: "",
            QuartierActuelle: "",
            parainAccount: "",
            parainName: "",
            typeGestion: "",
            critere1: "",
            otherMention: "",
            personneLieName: "",
            lieuNaissLie: "",
            dateNaissLie: "",
            degreParante: "",
            activationCompte: "false",
            MontantPremiereMise: "",
        });
        this.setState({ disabled: !this.state.disabled, isloading: false });
        setTimeout(() => {
            this.textInput.current.focus();
        }, 10);
        document.getElementById("validerbtn").removeAttribute("disabled");
    };
    //get data in input
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }
    //save new record
    handleSubmit = async (event) => {
        console.log(this.state);
        event.preventDefault();
        const res = await axios.post("/createnew", this.state);

        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Error",
                text: res.data.msg,
                icon: "info",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled });
        } else {
            this.setState({
                error_list: res.data.validate_error,
            });
        }
        // console.log(es.data.success);
    };

    //get row to update
    handleGetRow = async (e) => {
        e.preventDefault();
        const getDataToUpDate = await axios.get(
            "api/" + this.state.compteToSearch
        );
        if (getDataToUpDate.data.success == 1) {
            this.setState({ fetchData: getDataToUpDate.data.data });
            this.setState({ disabled: !this.state.disabled });
            //  console.log(this.state.fetchData);
            //disabled valider button
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document.getElementById("modifierbtn").removeAttribute("disabled");
            document
                .getElementById("ajouterbtn")
                .setAttribute("disabled", "disabled");
        } else {
            Swal.fire({
                title: "Erreur",
                text: getDataToUpDate.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    //to refresh
    actualiser() {
        location.reload();
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
        var inputColor2 = {
            height: "25px",
            border: "1px solid white",
            padding: "3px",
            width: "60px",
        };
        let tableBorder = {
            border: "0px solid #fff",
            fontSize: "14px",
            textAlign: "left",
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
                                    {/* <h3 className="card-title"><b>ADHESION</b></h3> */}
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
                                        {this.state.userInfo == 1 && (
                                            <>
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
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                                className="form-control font-weight-bold"
                                                                placeholder="Numéro compte..."
                                                                name="compteToSearch"
                                                                value={
                                                                    this.state
                                                                        .compteToSearch
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        width: "100%",
                                                                        height: "30px",
                                                                        fontSize:
                                                                            "12px",
                                                                    }}
                                                                    className="btn btn-primary"
                                                                    onClick={
                                                                        this
                                                                            .handleGetRow
                                                                    }
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-search"></i>
                                                                </button>
                                                            </td>
                                                        </div>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                value={
                                                                    this.state
                                                                        .fetchData &&
                                                                    this.state
                                                                        .fetchData
                                                                        .numCompte
                                                                }
                                                                type="text"
                                                                readOnly
                                                                style={{
                                                                    height: "40px",
                                                                    background:
                                                                        "#dcdcdc",
                                                                    border: "4px solid #fff",
                                                                }}
                                                                className="form-control mt-1 font-weight-bold"
                                                            />
                                                        </div>
                                                    </form>
                                                </div>

                                                <div className="col-md-3">
                                                    <form
                                                        style={{
                                                            padding: "10px",
                                                            border: "2px solid #fff",
                                                        }}
                                                    >
                                                        <table>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Code
                                                                        Agence
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={
                                                                                inputColor2
                                                                            }
                                                                            name="codeAgence"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .codeAgence
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Code
                                                                        monaie
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        readOnly
                                                                        style={
                                                                            inputColor2
                                                                        }
                                                                        name="codeMonaie"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .codeMonaie
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    >
                                                                        <option value="USD">
                                                                            USD
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </tr>

                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Epargne
                                                                    </label>
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        className="form-control text-uppercase"
                                                                        name="produitEpargne"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .produitEpargne
                                                                        }
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
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="Epargne à vie">
                                                                            Epargne
                                                                            à
                                                                            vie
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Type
                                                                        client
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        className="form-control text-uppercase"
                                                                        name="typeClient"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .typeClient
                                                                        }
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
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value=" Personne phyisique">
                                                                            Personne
                                                                            phyisique
                                                                        </option>
                                                                        <option value=" Personne morale">
                                                                            Personne
                                                                            morale
                                                                        </option>
                                                                        <option value="groupe solidaire">
                                                                            Groupe
                                                                            solidaire
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                            </>
                                        )}

                                        {/* separate */}

                                        <div className="col-md-3">
                                            <form
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <table>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Intitulé c.
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    textTransform:
                                                                        "uppercase",
                                                                }}
                                                                className={`form-control text-uppercase ${
                                                                    this.state
                                                                        .error_list
                                                                        .intituleCompte &&
                                                                    "is-invalid"
                                                                }`}
                                                                name="intituleCompte"
                                                                value={
                                                                    this.state
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
                                                                ref={
                                                                    this
                                                                        .textInput
                                                                }
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Guichet
                                                            </label>
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <select
                                                                readOnly
                                                                style={
                                                                    inputColor2
                                                                }
                                                                name="guichetAdresse"
                                                                value={
                                                                    this.state
                                                                        .guichetAdresse
                                                                }
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
                                                            >
                                                                <option value="GOMA">
                                                                    GOMA
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Compte salarié
                                                            </label>
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <select
                                                                readOnly
                                                                style={
                                                                    inputColor2
                                                                }
                                                                name="salarieCompte"
                                                                value={
                                                                    this.state
                                                                        .salarieCompte
                                                                }
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
                                                            >
                                                                <option
                                                                    selected
                                                                    value="NON"
                                                                >
                                                                    NON
                                                                </option>
                                                                <option value="OUI">
                                                                    OUI
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                N° Compte
                                                            </label>
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                                className={`form-control text-uppercase ${
                                                                    this.state
                                                                        .error_list
                                                                        .numCompte &&
                                                                    "is-invalid"
                                                                }`}
                                                                name="numCompte"
                                                                value={
                                                                    this.state
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
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Date
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                                className="form-control text-uppercase"
                                                                name="dateOuverture"
                                                                value={
                                                                    this.state
                                                                        .dateOuverture
                                                                        ? this
                                                                              .state
                                                                              .dateOuverture
                                                                        : this
                                                                              .state
                                                                              .fetchData &&
                                                                          this
                                                                              .state
                                                                              .fetchData
                                                                              .dateOuverture
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled
                                                            />
                                                        </div>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div className="col-md-1">
                                            <table
                                                style={{
                                                    marginLeft: "5px",
                                                    border: "3px solid #fff",
                                                }}
                                            >
                                                <tr>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                width: "100%",
                                                                height: "30px",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                            id="ajouterbtn"
                                                            className="btn btn-primary"
                                                            onClick={
                                                                this.handleNew
                                                            }
                                                        >
                                                            Ajouter{" "}
                                                            {/* <i className="fas fa-database"></i> */}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {this.state.fetchData && (
                                                    <tr>
                                                        <td>
                                                            <button
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                    width: "100%",
                                                                    height: "30px",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                                data-toggle="modal"
                                                                data-target="#modal-update-membre"
                                                                id="modifierbtn"
                                                                className="btn btn-primary mt-1"
                                                            >
                                                                Modifier{" "}
                                                                {/* <i className="fas fa-edit"></i> */}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                width: "100%",
                                                                height: "30px",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                            id="validerbtn"
                                                            className="btn btn-primary mt-1"
                                                            onClick={
                                                                this
                                                                    .handleSubmit
                                                            }
                                                        >
                                                            Valider{" "}
                                                            {/* <i className="fas fa-check"></i> */}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div className="col-md-3">
                                            <table
                                                style={{
                                                    border: "3px solid #fff",
                                                    padding: "5px",
                                                }}
                                                className="table-img"
                                            >
                                                <tr>
                                                    <td>
                                                        <img
                                                            src={`uploads/membres/${
                                                                this.state
                                                                    .fetchData
                                                                    ? this.state
                                                                          .fetchData
                                                                          .photoMembre
                                                                    : "default.jpg"
                                                            }`}
                                                            alt="photo-du-membre"
                                                            className="img-thumbnail"
                                                        />
                                                    </td>

                                                    <td>
                                                        <img
                                                            src={`uploads/membres/signatures/${
                                                                this.state
                                                                    .fetchData
                                                                    ? this.state
                                                                          .fetchData
                                                                          .signatureMembre
                                                                    : "default.jpg"
                                                            }`}
                                                            alt="Aucune signature"
                                                            className="img-thumbnail"
                                                            data-toggle="modal"
                                                            data-target="#modal-vieuw-signature"
                                                        />
                                                        <ModalSignature
                                                            signatureData={
                                                                this.state
                                                                    .fetchData &&
                                                                this.state
                                                                    .fetchData
                                                                    .signatureMembre
                                                            }
                                                            imageData={
                                                                this.state
                                                                    .fetchData &&
                                                                this.state
                                                                    .fetchData
                                                                    .photoMembre
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <form method="POST">
                                        <div className="row">
                                            <div className="col-md-12">
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
                                                            id="adresse-tab"
                                                            data-toggle="tab"
                                                            href="#adresse"
                                                            role="tab"
                                                            aria-controls="adresse"
                                                            aria-selected="false"
                                                        >
                                                            <i className="fas fa-plus"></i>{" "}
                                                            Adresse
                                                        </a>
                                                    </li>

                                                    <li className="nav-item">
                                                        <a
                                                            className="nav-link"
                                                            id="otherinfo-tab"
                                                            data-toggle="tab"
                                                            href="#otherinfo"
                                                            role="tab"
                                                            aria-controls="otherinfo"
                                                            aria-selected="false"
                                                        >
                                                            <i className="fas fa-plus"></i>{" "}
                                                            Autres informations
                                                        </a>
                                                    </li>
                                                    {this.state.userInfo ==
                                                        1 && (
                                                        <>
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    id="mendataire-tab"
                                                                    data-toggle="tab"
                                                                    href="#mendataire"
                                                                    role="tab"
                                                                    aria-controls="mendataire"
                                                                    aria-selected="false"
                                                                >
                                                                    <i
                                                                        className="fa fa-plus"
                                                                        aria-hidden="true"
                                                                    ></i>{" "}
                                                                    Mendataire
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    id="personnelie-tab"
                                                                    data-toggle="tab"
                                                                    href="#personnelie"
                                                                    role="tab"
                                                                    aria-controls="personnelie"
                                                                    aria-selected="false"
                                                                >
                                                                    Personnes
                                                                    liés{" "}
                                                                    <i className="fa fa-plus"></i>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    id="compteparne-tab"
                                                                    data-toggle="tab"
                                                                    href="#comptepargne"
                                                                    role="tab"
                                                                    aria-controls="comptepargne"
                                                                    aria-selected="false"
                                                                >
                                                                    Compte
                                                                    epargne{" "}
                                                                    <i className="fa fa-plus"></i>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    id="webcame-tab"
                                                                    data-toggle="tab"
                                                                    href="#webcame"
                                                                    role="tab"
                                                                    aria-controls="webcame"
                                                                    aria-selected="false"
                                                                >
                                                                    Web came{" "}
                                                                    <i className="fa fa-plus"></i>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    id="signature-tab"
                                                                    data-toggle="tab"
                                                                    href="#signature"
                                                                    role="tab"
                                                                    aria-controls="signature"
                                                                    aria-selected="false"
                                                                >
                                                                    Signature{" "}
                                                                    <i className="fa fa-plus"></i>
                                                                </a>
                                                            </li>
                                                        </>
                                                    )}
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
                                                                border: "2px solid #fff",
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
                                                                    >
                                                                        {/* <h3 className="card-title">
<b>ADRESSE</b>
</h3> */}
                                                                    </div>

                                                                    <div
                                                                        className="card-body h-200"
                                                                        style={{
                                                                            background:
                                                                                "#dcdcdc",
                                                                        }}
                                                                    >
                                                                        <form
                                                                            method="POST"
                                                                            style={{
                                                                                padding:
                                                                                    "10px",
                                                                                border: "2px solid #fff",
                                                                            }}
                                                                        >
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <table>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <label
                                                                                                    htmlFor="lieuNaiss"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Né
                                                                                                    à
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="lieuNaiss"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="lieuNaiss"
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="dateNaissance"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Date
                                                                                                    Naissance
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="dateNaissance"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="dateNaiss"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .dateNaiss
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .dateNaiss
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .dateNaiss
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="etatCivile"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Etat
                                                                                                    civile
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <select
                                                                                                    className={`form-control ${
                                                                                                        this
                                                                                                            .state
                                                                                                            .error_list
                                                                                                            .etatCivile &&
                                                                                                        "is-invalid"
                                                                                                    }`}
                                                                                                    id="etatCivile"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="etatCivile"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .etatCivile
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .etatCivile
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .dateNaiss
                                                                                                    }
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
                                                                                                >
                                                                                                    <option value="">
                                                                                                        Sélectionnez
                                                                                                    </option>
                                                                                                    <option value="Marié(e)">
                                                                                                        Marié(e)
                                                                                                    </option>
                                                                                                    <option value="Célibataire">
                                                                                                        Célibataire
                                                                                                    </option>
                                                                                                    <option value="veuf(ve)">
                                                                                                        veuf(ve)
                                                                                                    </option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="condjoint"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Marié(e)
                                                                                                    à
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="condjoint"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="conjoitName"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .conjoitName
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .conjoitName
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .conjoitName
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="nomPere"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Nom
                                                                                                    du
                                                                                                    père
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="nomPere"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="fatherName"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .fatherName
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .fatherName
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .fatherName
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="nomMere"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Nom
                                                                                                    de
                                                                                                    la
                                                                                                    mère
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="nomMere"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="motherName"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .motherName
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .motherName
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .motherName
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="profession"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Profession
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="profession"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="profession"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .profession
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .profession
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .profession
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="lieuTravail"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Lieu
                                                                                                    de
                                                                                                    travail
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="lieuTravail"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="workingPlace"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .workingPlace
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .workingPlace
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .workingPlace
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                                <div className="col-md-3">
                                                                                    <table>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <label
                                                                                                    htmlFor="civilite"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Civilité
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <select
                                                                                                    id="civilite"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="cilivilty"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .cilivilty
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .cilivilty
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .cilivilty
                                                                                                    }
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
                                                                                                >
                                                                                                    <option value="">
                                                                                                        Sélectionnez
                                                                                                    </option>
                                                                                                    <option value="Monsieur">
                                                                                                        Monsieur
                                                                                                    </option>
                                                                                                    <option value="Madame">
                                                                                                        Madame
                                                                                                    </option>
                                                                                                    <option value="Ma demoiselle">
                                                                                                        Ma
                                                                                                        demoiselle
                                                                                                    </option>
                                                                                                    <option value="Groupe solidaire">
                                                                                                        Groupe
                                                                                                        solidaire
                                                                                                    </option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="sexe"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Sexe
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <select
                                                                                                    id="sexe"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="sexe"
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
                                                                                                >
                                                                                                    <option value="">
                                                                                                        Sélectionnez
                                                                                                    </option>
                                                                                                    <option value="M">
                                                                                                        M
                                                                                                    </option>
                                                                                                    <option value="F">
                                                                                                        F
                                                                                                    </option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="tel1"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Téléphone
                                                                                                    1
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    className={`form-control ${
                                                                                                        this
                                                                                                            .state
                                                                                                            .error_list
                                                                                                            .phone1 &&
                                                                                                        "is-invalid"
                                                                                                    }`}
                                                                                                    id="tel1"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="phone1"
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="tel2"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Téléphone
                                                                                                    2
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    className={`form-control ${
                                                                                                        this
                                                                                                            .state
                                                                                                            .error_list
                                                                                                            .phone2 &&
                                                                                                        "is-invalid"
                                                                                                    }`}
                                                                                                    id="tel2"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="phone2"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .phone2
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .phone2
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .phone2
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>

                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="email"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Email
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="email"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="email"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .email
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .email
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .email
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="typepiece"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Type
                                                                                                    pièce
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <select
                                                                                                    id="typepiece"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="typepiece"
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
                                                                                                >
                                                                                                    <option value="">
                                                                                                        Sélectionnez
                                                                                                    </option>
                                                                                                    <option value="Carte d'électeur">
                                                                                                        Carte
                                                                                                        d'électeur
                                                                                                    </option>
                                                                                                    <option value="Carte d'éleve/Etudiant">
                                                                                                        Carte
                                                                                                        d'éleve/Etudiant
                                                                                                    </option>
                                                                                                    <option value="pass port">
                                                                                                        Pass
                                                                                                        port
                                                                                                    </option>
                                                                                                    <option value="Permis de conduire">
                                                                                                        Permis
                                                                                                        de
                                                                                                        conduire
                                                                                                    </option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="numpiece"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Num
                                                                                                    pièce
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="numpiece"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="numpiece"
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <label
                                                                                                    htmlFor="delivranceplace"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Délivré
                                                                                                    à
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="delivranceplace"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="delivrancePlace"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .delivrancePlace
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .delivrancePlace
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .delivrancePlace
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                                <div className="col-md-3">
                                                                                    <table>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <label
                                                                                                    htmlFor="delivrancePiece"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Date
                                                                                                    de
                                                                                                    délivrance
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="delivrancePiece"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="delivranceDate"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .delivranceDate
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .delivranceDate
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .delivranceDate
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="gestionnaire"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Gestionnaire
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <select
                                                                                                    id="gestionnaire"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="gestionnaire"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .gestionnaire
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .gestionnaire
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .gestionnaire
                                                                                                    }
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
                                                                                                >
                                                                                                    <option value="Sélectionnez">
                                                                                                        Sélectionnez
                                                                                                    </option>
                                                                                                    <option value="DESTIN KASIGWA">
                                                                                                        DESTIN
                                                                                                        KASIGWA
                                                                                                    </option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="provinceOrigine"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Province
                                                                                                    d'origine
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="provinceOrigine"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="provinceOrigine"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .provinceOrigine
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .provinceOrigine
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .provinceOrigine
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="territoireOrigine"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Térritoire
                                                                                                    d'origine
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="territoireOrigine"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="territoireOrigine"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .territoireOrigine
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .territoireOrigine
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .territoireOrigine
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="collectivite"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Collectivité
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="collectivite"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="collectiviteOrigine"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .collectiviteOrigine
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .collectiviteOrigine
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .collectiviteOrigine
                                                                                                    }
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <label
                                                                                                    htmlFor="autremention"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    Autres
                                                                                                    mentions
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                {" "}
                                                                                                <input
                                                                                                    id="autremention"
                                                                                                    style={{
                                                                                                        height: "40px",
                                                                                                        border: "1px solid steelblue",
                                                                                                        padding:
                                                                                                            "3px",
                                                                                                    }}
                                                                                                    name="otherMention"
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
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                        {/* display here the update membre modal */}
                                                                        {this
                                                                            .state
                                                                            .fetchData && (
                                                                            <UpdateMembre
                                                                                dataMembre={
                                                                                    this
                                                                                        .state
                                                                                        .fetchData
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="tab-pane fade mt-2 col-md-12"
                                                        id="adresse"
                                                        role="tabpanel"
                                                        aria-labelledby="adresse-tab"
                                                    >
                                                        <div
                                                            className="row"
                                                            style={{
                                                                padding: "10px",
                                                                border: "2px solid #fff",
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
                                                                    >
                                                                        {/* <h3 className="card-title">
<b>Adresse</b>
</h3> */}
                                                                    </div>

                                                                    <div
                                                                        className="card-body h-200"
                                                                        style={{
                                                                            background:
                                                                                "#dcdcdc",
                                                                        }}
                                                                    >
                                                                        <div className="col-md-12">
                                                                            <form method="POST">
                                                                                <table>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="province"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Province*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                className={`form-control ${
                                                                                                    this
                                                                                                        .state
                                                                                                        .error_list
                                                                                                        .provinceActuelle &&
                                                                                                    "is-invalid"
                                                                                                }`}
                                                                                                id="province"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="provinceActuelle"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .provinceActuelle
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .provinceActuelle
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .provinceActuelle
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                <option value="Bas-Uele">
                                                                                                    Bas-Uele
                                                                                                </option>

                                                                                                <option value="Equateur">
                                                                                                    Equateur
                                                                                                </option>
                                                                                                <option value="Haut-katanga">
                                                                                                    Haut-katanga
                                                                                                </option>
                                                                                                <option value="Haut-Lomani">
                                                                                                    Haut-Lomani
                                                                                                </option>
                                                                                                <option value="Haut-Uele">
                                                                                                    Haut-Uele
                                                                                                </option>
                                                                                                <option value="Ituri">
                                                                                                    Ituri
                                                                                                </option>
                                                                                                <option value="Kasai">
                                                                                                    Kasai
                                                                                                </option>
                                                                                                <option value="Kasai-Central">
                                                                                                    Kasai-Central
                                                                                                </option>
                                                                                                <option value="Kasai-Oiental">
                                                                                                    Kasai-Oriental
                                                                                                </option>
                                                                                                <option value="Kinshasa">
                                                                                                    Kinshasa
                                                                                                </option>
                                                                                                <option value="Congo-Central">
                                                                                                    Congo-Cental
                                                                                                </option>
                                                                                                <option value="Kwango">
                                                                                                    Kwango
                                                                                                </option>
                                                                                                <option value="Kwilu">
                                                                                                    Kwilu
                                                                                                </option>
                                                                                                <option value="Lomami">
                                                                                                    Lomami
                                                                                                </option>
                                                                                                <option value="Lualaba">
                                                                                                    Lualaba
                                                                                                </option>
                                                                                                <option value="Mai-Ndombe">
                                                                                                    Mai-Ndombe
                                                                                                </option>
                                                                                                <option value="Maniema">
                                                                                                    Maniema
                                                                                                </option>
                                                                                                <option value="Mongala">
                                                                                                    Mongala
                                                                                                </option>
                                                                                                <option value="Nord-Kivu">
                                                                                                    Nord-Kivu
                                                                                                </option>
                                                                                                <option value="Nord-Ubangi">
                                                                                                    Nord-Ubangi
                                                                                                </option>
                                                                                                <option value="Sankuru">
                                                                                                    Sankuru
                                                                                                </option>
                                                                                                <option value="Sud-Kivu">
                                                                                                    Sud-Kivu
                                                                                                </option>
                                                                                                <option value="Sud-Ubangi">
                                                                                                    Sud-Ubangi
                                                                                                </option>
                                                                                                <option value="Tanganyika">
                                                                                                    Tanganyika
                                                                                                </option>
                                                                                                <option value="Tshopo">
                                                                                                    Tshopo
                                                                                                </option>
                                                                                                <option value="Tshapa">
                                                                                                    Tshapa
                                                                                                </option>
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="terrouville"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Territoire
                                                                                                ou
                                                                                                ville*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                className={`form-control ${
                                                                                                    this
                                                                                                        .state
                                                                                                        .error_list
                                                                                                        .villeActuelle &&
                                                                                                    "is-invalid"
                                                                                                }`}
                                                                                                id="terrouville"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="villeActuelle"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .villeActuelle
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Bas-Uele" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Aketi">
                                                                                                            Aketi
                                                                                                        </option>
                                                                                                        <option value="Aketi ville">
                                                                                                            Aketi
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Ango">
                                                                                                            Ango
                                                                                                        </option>
                                                                                                        <option value="Bambesa">
                                                                                                            Bambesa
                                                                                                        </option>
                                                                                                        <option value="Bando">
                                                                                                            Bando
                                                                                                        </option>
                                                                                                        <option value="Bando ville">
                                                                                                            Bando
                                                                                                            Ville
                                                                                                        </option>
                                                                                                        <option value="Buta">
                                                                                                            Buta
                                                                                                        </option>
                                                                                                        <option value="Buta ville">
                                                                                                            Buta
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Dingila ville">
                                                                                                            Dingila
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Poko">
                                                                                                            Poko
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}

                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Equateur" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Basankuru">
                                                                                                            Basankuru
                                                                                                        </option>
                                                                                                        <option value="Bikoro">
                                                                                                            Bikoro
                                                                                                        </option>
                                                                                                        <option value="Bolamba">
                                                                                                            Bolamba
                                                                                                        </option>
                                                                                                        <option value="Bomongo">
                                                                                                            Bomongo
                                                                                                        </option>
                                                                                                        <option value="Igende">
                                                                                                            Igende
                                                                                                        </option>
                                                                                                        <option value="Lokolela">
                                                                                                            Lokolela
                                                                                                        </option>
                                                                                                        <option value="Makanza">
                                                                                                            Makanza
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Haut-Katanga" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Kambove">
                                                                                                            Kambove
                                                                                                        </option>
                                                                                                        <option value="Kisenga">
                                                                                                            Kisenga
                                                                                                        </option>
                                                                                                        <option value="Kipushi">
                                                                                                            Kipushi
                                                                                                        </option>
                                                                                                        <option value="Kipushi ville">
                                                                                                            Kipushi
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Likasi ville">
                                                                                                            Likasi
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Mitwaba">
                                                                                                            Mitwaba
                                                                                                        </option>
                                                                                                        <option value="Pweto">
                                                                                                            Pweto
                                                                                                        </option>
                                                                                                        <option value="Sakania">
                                                                                                            Sakania
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Haut-Lomami" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Bukama">
                                                                                                            Bukama
                                                                                                        </option>
                                                                                                        <option value="Kabongo">
                                                                                                            Kabongo
                                                                                                        </option>
                                                                                                        <option value="Kamina">
                                                                                                            Kamina
                                                                                                        </option>
                                                                                                        <option value="Kamina ville">
                                                                                                            Kamina
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Kaniama">
                                                                                                            Kaniama
                                                                                                        </option>
                                                                                                        <option value="Malemba nkulu">
                                                                                                            Malemba
                                                                                                            nkulu
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}

                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Haut-Uele" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Aba ville">
                                                                                                            Aba
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Dungu">
                                                                                                            Dungu
                                                                                                        </option>
                                                                                                        <option value="Dungu ville">
                                                                                                            Dungu
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Faradje">
                                                                                                            Faradje
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Isiro ville">
                                                                                                            Isiro
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Rungu">
                                                                                                            Rungu
                                                                                                        </option>
                                                                                                        <option value="Wamba">
                                                                                                            Wamba
                                                                                                        </option>
                                                                                                        <option value="Wamba ville">
                                                                                                            Wamba
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Watsa">
                                                                                                            Watsa
                                                                                                        </option>
                                                                                                        <option value="Watsa ville">
                                                                                                            Watsa
                                                                                                            ville
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}

                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Ituri" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Ari wara ville">
                                                                                                            Ari
                                                                                                            wara
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Aru">
                                                                                                            Aru
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Bunia ville">
                                                                                                            Bunia
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Ingbokolo ville">
                                                                                                            Ingbokolo
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Irumu">
                                                                                                            Irumu
                                                                                                        </option>
                                                                                                        <option value="Mahagi">
                                                                                                            Mahagi
                                                                                                        </option>
                                                                                                        <option value="Mahagi ville">
                                                                                                            Mahagi
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Wamba ville">
                                                                                                            Wamba
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Mambasa">
                                                                                                            Mambasa
                                                                                                        </option>
                                                                                                        <option value="Mongwalu ville">
                                                                                                            Mongwalu
                                                                                                            ville
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Nord-Kivu" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Beni">
                                                                                                            Beni
                                                                                                        </option>
                                                                                                        <option value="Beni ville">
                                                                                                            Beni
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Butembo ville">
                                                                                                            Butembo
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Goma ville">
                                                                                                            Goma
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Lubero">
                                                                                                            Lubero
                                                                                                        </option>
                                                                                                        <option value="Masisi">
                                                                                                            Masisi
                                                                                                        </option>
                                                                                                        <option value="Nyiragongo">
                                                                                                            Nyiragongo
                                                                                                        </option>
                                                                                                        <option value="Rutshuru">
                                                                                                            Rutshuru
                                                                                                        </option>
                                                                                                        <option value="Walikale">
                                                                                                            Walikale
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .provinceActuelle ===
                                                                                                    "Sud-Kivu" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Bukavu ville">
                                                                                                            Bukavu
                                                                                                            ville
                                                                                                        </option>
                                                                                                        <option value="Idjwi">
                                                                                                            Idjwi
                                                                                                        </option>
                                                                                                        <option value="Fizi">
                                                                                                            Fizi
                                                                                                        </option>
                                                                                                        <option value="Kabare">
                                                                                                            Kabare
                                                                                                        </option>
                                                                                                        <option value="Kalehe">
                                                                                                            Kalehe
                                                                                                        </option>
                                                                                                        <option value="Mwenga">
                                                                                                            Mwenga
                                                                                                        </option>
                                                                                                        <option value="Shabunda">
                                                                                                            Shabunda
                                                                                                        </option>
                                                                                                        <option value="Uvira">
                                                                                                            Uvira
                                                                                                        </option>
                                                                                                        <option value="Walungu">
                                                                                                            Walungu
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="secteur"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Secteur
                                                                                                chefferie
                                                                                                ou
                                                                                                commune*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                className={`form-control ${
                                                                                                    this
                                                                                                        .state
                                                                                                        .error_list
                                                                                                        .CommuneActuelle &&
                                                                                                    "is-invalid"
                                                                                                }`}
                                                                                                id="secteur"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="CommuneActuelle"
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
                                                                                                              .CommuneActuelle
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                {this
                                                                                                    .state
                                                                                                    .villeActuelle ===
                                                                                                    "Bukavu ville" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Bagira">
                                                                                                            Bagira
                                                                                                        </option>
                                                                                                        <option value="Ibanda">
                                                                                                            Ibanda
                                                                                                        </option>
                                                                                                        <option value="Kadutu">
                                                                                                            Kadutu
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .villeActuelle ===
                                                                                                    "Goma ville" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Goma">
                                                                                                            Goma
                                                                                                        </option>
                                                                                                        <option value="Karisimbi">
                                                                                                            Karisimbi
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="groupement"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Groupement
                                                                                                ou
                                                                                                quartier*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                className={`form-control ${
                                                                                                    this
                                                                                                        .state
                                                                                                        .error_list
                                                                                                        .QuartierActuelle &&
                                                                                                    "is-invalid"
                                                                                                }`}
                                                                                                id="groupement"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="QuartierActuelle"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .QuartierActuelle
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .QuartierActuelle
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .QuartierActuelle
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                {this
                                                                                                    .state
                                                                                                    .CommuneActuelle ===
                                                                                                    "Goma" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Himbi">
                                                                                                            Himbi
                                                                                                        </option>
                                                                                                        <option value="Katindo">
                                                                                                            Katindo
                                                                                                        </option>
                                                                                                        <option value="Kyeshero">
                                                                                                            Kyeshero
                                                                                                        </option>
                                                                                                        <option value="Lac vert">
                                                                                                            Lac
                                                                                                            vert
                                                                                                        </option>
                                                                                                        <option value="Mapendo">
                                                                                                            Mapendo
                                                                                                        </option>
                                                                                                        <option value="Mikeno">
                                                                                                            Mikeno
                                                                                                        </option>
                                                                                                        <option value="Volcan">
                                                                                                            Volcan
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                                {this
                                                                                                    .state
                                                                                                    .CommuneActuelle ===
                                                                                                    "Karisimbi" && (
                                                                                                    <React.Fragment>
                                                                                                        <option value="Bujovu">
                                                                                                            Bujovu
                                                                                                        </option>
                                                                                                        <option value="Kahembe">
                                                                                                            Kahembe
                                                                                                        </option>
                                                                                                        <option value="Kasika">
                                                                                                            Kasika
                                                                                                        </option>
                                                                                                        <option value="Katoyi">
                                                                                                            Katoyi
                                                                                                        </option>
                                                                                                        <option value="Mabanga nord">
                                                                                                            Mabanga
                                                                                                            nord
                                                                                                        </option>
                                                                                                        <option value="Mabanga sud">
                                                                                                            Mabanga
                                                                                                            sud
                                                                                                        </option>
                                                                                                        <option value="Majengo">
                                                                                                            Majengo
                                                                                                        </option>
                                                                                                        <option value="Mugungu">
                                                                                                            Mugungu
                                                                                                        </option>
                                                                                                        <option value="Murara">
                                                                                                            Murara
                                                                                                        </option>
                                                                                                        <option value="Ndosho">
                                                                                                            Ndosho
                                                                                                        </option>
                                                                                                        <option value="Virunga">
                                                                                                            Virunga
                                                                                                        </option>
                                                                                                    </React.Fragment>
                                                                                                )}
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="suiteadresse"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Suite
                                                                                                adresse
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <input
                                                                                                id="suiteadresse"
                                                                                                style={{
                                                                                                    height: "40px",
                                                                                                    border: "1px solid steelblue",
                                                                                                    padding:
                                                                                                        "3px",
                                                                                                }}
                                                                                                name="address"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .address
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .address
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .address
                                                                                                }
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
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="tab-pane fade mt-2 col-md-6"
                                                        id="otherinfo"
                                                        role="tabpanel"
                                                        aria-labelledby="otherinfo-tab"
                                                    >
                                                        <div
                                                            className="row"
                                                            style={{
                                                                padding: "10px",
                                                                border: "2px solid #fff",
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
                                                                    >
                                                                        {/* <h3 className="card-title">
                                                                   <b>Autres information</b>
                                                                   </h3> */}
                                                                    </div>

                                                                    <div
                                                                        className="card-body h-200"
                                                                        style={{
                                                                            background:
                                                                                "#dcdcdc",
                                                                        }}
                                                                    >
                                                                        <div className="col-md-8">
                                                                            <form method="POST">
                                                                                <table>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="province"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                N°
                                                                                                compte
                                                                                                parain
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                id="province"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="parainAccount"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .parainAccount
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .parainAccount
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .parainAccount
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <label
                                                                                                htmlFor="nomparain"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Nom
                                                                                                du
                                                                                                parain
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            <input
                                                                                                readOnly
                                                                                                id="nomparain"
                                                                                                type="text"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="parainName"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .parainName
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .parainName
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .parainName
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
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="typegestion"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Type
                                                                                                de
                                                                                                gestion*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                id="typegestion"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="typeGestion"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .typeGestion
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .typeGestion
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .typeGestion
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                <option value="Individuel">
                                                                                                    Individuel
                                                                                                </option>
                                                                                                <option value="Collectif">
                                                                                                    Collectif
                                                                                                </option>
                                                                                                <option value="Condjoint">
                                                                                                    Condjoint
                                                                                                </option>
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="critere"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Critère
                                                                                                1*
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                className={`form-control ${
                                                                                                    this
                                                                                                        .state
                                                                                                        .error_list
                                                                                                        .critere1 &&
                                                                                                    "is-invalid"
                                                                                                }`}
                                                                                                id="critere"
                                                                                                style={
                                                                                                    inputColor
                                                                                                }
                                                                                                name="critere1"
                                                                                                value={
                                                                                                    this
                                                                                                        .state
                                                                                                        .critere1
                                                                                                        ? this
                                                                                                              .state
                                                                                                              .critere1
                                                                                                        : this
                                                                                                              .state
                                                                                                              .fetchData &&
                                                                                                          this
                                                                                                              .state
                                                                                                              .fetchData
                                                                                                              .critere1
                                                                                                }
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
                                                                                            >
                                                                                                <option value="">
                                                                                                    Sélectionnez
                                                                                                </option>
                                                                                                <option value="A">
                                                                                                    A
                                                                                                </option>
                                                                                                <option value="B">
                                                                                                    B
                                                                                                </option>
                                                                                                <option value="C">
                                                                                                    C
                                                                                                </option>
                                                                                                <option value="D">
                                                                                                    D
                                                                                                </option>
                                                                                                <option value="Autre">
                                                                                                    Autre
                                                                                                </option>
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                    {this
                                                                                        .state
                                                                                        .critere1 ==
                                                                                        "Autre" && (
                                                                                        <tr>
                                                                                            <td>
                                                                                                <label
                                                                                                    htmlFor="nomparain"
                                                                                                    style={
                                                                                                        labelColor
                                                                                                    }
                                                                                                >
                                                                                                    M.
                                                                                                    mise
                                                                                                    en
                                                                                                    FC
                                                                                                </label>{" "}
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    id="MontantPremiereMise"
                                                                                                    type="text"
                                                                                                    style={
                                                                                                        inputColor
                                                                                                    }
                                                                                                    name="MontantPremiereMise"
                                                                                                    value={
                                                                                                        this
                                                                                                            .state
                                                                                                            .MontantPremiereMise
                                                                                                            ? this
                                                                                                                  .state
                                                                                                                  .MontantPremiereMise
                                                                                                            : this
                                                                                                                  .state
                                                                                                                  .fetchData &&
                                                                                                              this
                                                                                                                  .state
                                                                                                                  .fetchData
                                                                                                                  .MontantPremiereMise
                                                                                                    }
                                                                                                    onChange={
                                                                                                        this
                                                                                                            .handleChange
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                                    <tr>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <label
                                                                                                htmlFor="critere2"
                                                                                                style={
                                                                                                    labelColor
                                                                                                }
                                                                                            >
                                                                                                Critère
                                                                                                2
                                                                                            </label>{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {" "}
                                                                                            <select
                                                                                                id="critere2"
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
                                                                                            ></select>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {this.state.userInfo ==
                                                        1 && (
                                                        <>
                                                            <div
                                                                className="tab-pane col-md-12"
                                                                id="mendataire"
                                                                role="tabpanel"
                                                                aria-labelledby="mendataire-tab"
                                                            >
                                                                <Mendataire
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

                                                            <div
                                                                className="tab-pane fade mt-2"
                                                                id="personnelie"
                                                                role="tabpanel"
                                                                aria-labelledby="personnelie-tab"
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

                                                                        <div
                                                                            className="card-body h-200"
                                                                            style={{
                                                                                background:
                                                                                    "#dcdcdc",
                                                                            }}
                                                                        >
                                                                            <div className="col-md-12">
                                                                                <PersonneLie
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
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="tab-pane fade mt-2"
                                                                id="comptepargne"
                                                                role="tabpanel"
                                                                aria-labelledby="comptepargne-tab"
                                                            >
                                                                {/* //ACTIVATE COMPTE */}

                                                                <ActivationCompte
                                                                    refCompte={
                                                                        this
                                                                            .state
                                                                            .compteToSearch
                                                                            ? this
                                                                                  .state
                                                                                  .compteToSearch
                                                                            : null
                                                                    }
                                                                    idCompteMembre={
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            ? this
                                                                                  .state
                                                                                  .fetchData
                                                                                  .refCompte
                                                                            : null
                                                                    }
                                                                />
                                                            </div>

                                                            <div
                                                                className="tab-pane fade mt-2"
                                                                id="webcame"
                                                                role="tabpanel"
                                                                aria-labelledby="webcame-tab"
                                                            >
                                                                {/* //ACTIVATE COMPTE */}

                                                                <WebCame
                                                                    idCompteMembre={
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            ? this
                                                                                  .state
                                                                                  .fetchData
                                                                                  .refCompte
                                                                            : null
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className="tab-pane fade mt-2"
                                                                id="signature"
                                                                role="tabpanel"
                                                                aria-labelledby="signature-tab"
                                                            >
                                                                {/* //ADDING SIGNATURE ON ACCOUNT */}

                                                                <AddSignatureOnAccount
                                                                    idCompteMembre={
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            ? this
                                                                                  .state
                                                                                  .fetchData
                                                                                  .refCompte
                                                                            : null
                                                                    }
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
export default Adhesion;
