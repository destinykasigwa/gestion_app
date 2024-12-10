import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateSMSBankingUser from "./Modals/UpdateSMSBankingUser";

export default class SMSbanking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: false,
            loading3: false,
            NumCompte: "",
            NomCompte: "",
            Civilite: "",
            Email: "",
            Telephone: "+243",
            searchData: false,
            // DateActivation: "",
            // DateDesActivation: "",
            // NumAbrege: "",
            disabled: false,
            searchedItem: "",
            SendSMS: false,
            fetchData: [],
            fetchSeachedData: "",
            fetchUpdateData: null,
        };
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveBtn = this.saveBtn.bind(this);
        this.handleSeach = this.handleSeach.bind(this);
        this.UpdateUser = this.UpdateUser.bind();
        this.DeleteUser = this.DeleteUser.bind(this);
        this.getData = this.getData.bind(this);
        this.ActivateUserOnMSG = this.ActivateUserOnMSG.bind(this);
        this.ActivateUserOnEmail = this.ActivateUserOnEmail.bind(this);
        this.getIndividualsUserSmsBankingDetails =
            this.getIndividualsUserSmsBankingDetails.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        // this.setState({ disabled: true });
        this.getData();
    }
    //to refresh
    actualiser() {
        location.reload();
    }
    //GET DATA FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    saveBtn = async (e) => {
        e.preventDefault();
        this.setState({ loading2: true });
        const res = await axios.post(
            "sms-banking/add-new-costomer/question",
            this.state
        );
        if (res.data.success == 1) {
            const question = confirm(
                "Vous êtes sur le point d'ajouter sur SMS banking " +
                    res.data.NomMembre +
                    " Voulez-vous continuer ?"
            );
            if (question == true) {
                const res2 = await axios.post(
                    "sms-banking/add-new-costomer",
                    this.state
                );
                Swal.fire({
                    title: "Succès",
                    text: res2.data.msg,
                    icon: "success",
                    button: "OK!",
                });
            }
            this.setState({
                loading2: false,
                NumCompte: "",
                NomCompte: "",
                Civilite: "",
                Email: "",
                Telephone: "+243",
            });
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

    handleSeach = async (item) => {
        this.setState({ loading3: true });
        if (!this.state.searchedItem) {
            Swal.fire({
                title: "Erreur",
                text: "Veuillez renseigné un numéro de compte",
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading3: false });
        }

        const res = await axios.get("sms-banking/search/user/" + item);
        if (res.data.success == 1) {
            this.setState({
                fetchSeachedData: res.data.data,
                searchData: true,
            });
            // console.log(this.state.fetchSeachedData);

            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ loading3: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading3: false, searchData: false });
        }
    };

    UpdateUser = async () => {};
    DeleteUser = async (item) => {
        const question = confirm(
            "Voulez-vous vraiment supprimé cet utilsateur sur le service SMS Banking ?"
        );
        if (question == true) {
            const res = await axios.delete("sms-banking/delete/item/" + item);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Succès",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
            }
        }
    };

    ActivateUserOnMSG = async (item) => {
        const res = await axios.get("sms-banking/activate-user/msg/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    ActivateUserOnEmail = async (item) => {
        const res = await axios.get("sms-banking/activate-user/email/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    getData = async () => {
        try {
            const res = await axios.get("sms-banking/getlastest");
            if (res.data.success == 1) {
                this.setState({ fetchData: res.data.data });
            }
        } catch (error) {
            console.log(error);
        }
    };

    getIndividualsUserSmsBankingDetails = (id) => {
        axios
            .post("sms-banking/update/user-details", {
                userId: id,
            })
            .then((response) => {
                this.setState({
                    fetchUpdateData: response.data.data,
                });
                console.log(this.state.fetchUpdateData);
            });
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
        let labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "3px",
            fontSize: "14px",
        };
        let inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            marginTop: "2px",

            // boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "16px",
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
                                            border: "2px solid #dcdcdc",
                                            background: "#fff",
                                        }}
                                    >
                                        <div
                                            className="col-md-8"
                                            style={{
                                                boxShadow:
                                                    "inset 0 0 5px 5px #888",
                                                padding: "20px",
                                                margin: "4px",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    background: "steelblue",
                                                    padding: "10px",
                                                    color: "#fff",
                                                    margin: "0px auto",
                                                    width: "99%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Ajout SMSBanking
                                            </h3>
                                            <br />
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
                                                                NumCompte Abr.
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <input
                                                                name="NumCompte"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .NumCompte
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Intitulé de
                                                                compte
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <input
                                                                name="NomCompte"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .NomCompte
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr> */}
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Civilité
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <select
                                                                name="Civilite"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .Civilite
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value=" Monsieur">
                                                                    Monsieur
                                                                </option>
                                                                <option value="Madame">
                                                                    Madame
                                                                </option>
                                                                <option value="Mademoiselle">
                                                                    Mademoiselle
                                                                </option>
                                                            </select>
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
                                                                Email
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <input
                                                                name="Email"
                                                                type="email"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .Email
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Téléphone
                                                            </label>{" "}
                                                        </td>
                                                        <td>
                                                            <input
                                                                name="Telephone"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .Telephone
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td>
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
                                                                    this.saveBtn
                                                                }
                                                            >
                                                                <i
                                                                    className={`${
                                                                        this
                                                                            .state
                                                                            .loading2
                                                                            ? "spinner-border spinner-border-sm"
                                                                            : "fas fa-check"
                                                                    }`}
                                                                ></i>{" "}
                                                                Valider {""}
                                                                {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div
                                            className="col-md-12"
                                            style={{
                                                boxShadow:
                                                    "inset 0 0 5px 5px #888",
                                                padding: "20px",
                                                margin: "4px",
                                            }}
                                        >
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
                                                            ref={this.textInput}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Rechercher..."
                                                            name="searchedItem"
                                                            value={
                                                                this.state
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
                                                                    this.state
                                                                        .searchedItem
                                                                );
                                                            }}
                                                        >
                                                            <i
                                                                className={`${
                                                                    this.state
                                                                        .loading3
                                                                        ? "spinner-border spinner-border-sm"
                                                                        : "fas fa-search"
                                                                }`}
                                                            ></i>
                                                            Rechercher
                                                        </button>
                                                    </td>{" "}
                                                </tr>
                                            </table>
                                            {this.state.searchData == false ? (
                                                this.state.fetchData.length !=
                                                    0 && (
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Compte</th>
                                                                <th>
                                                                    Intitulé
                                                                </th>
                                                                {/* <th>
                                                                    Civilité
                                                                </th> */}
                                                                <th>Email</th>
                                                                <th>
                                                                    Téléphone
                                                                </th>
                                                                {/* <th>
                                                                    Date Act.
                                                                </th>
                                                                <th>
                                                                    Date Des.
                                                                </th> */}
                                                                <th>
                                                                    Compte Abr.
                                                                </th>
                                                                <th>Action</th>
                                                                <th>Action</th>
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
                                                                                    res.NumCompte
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NomCompte
                                                                                }
                                                                            </td>
                                                                            {/* <td>
                                                                                {
                                                                                    res.Civilite
                                                                                }
                                                                            </td> */}
                                                                            <td>
                                                                                {
                                                                                    res.Email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Telephone
                                                                                }
                                                                            </td>
                                                                            {/* <td>
                                                                                {
                                                                                    res.DateActivation
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.DateDesActivation
                                                                                }
                                                                            </td> */}
                                                                            <td>
                                                                                {
                                                                                    res.NumAbrege
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <div
                                                                                    class="btn-group"
                                                                                    role="group"
                                                                                    aria-label="Exemple"
                                                                                >
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            this.getIndividualsUserSmsBankingDetails(
                                                                                                res.id
                                                                                            );
                                                                                        }}
                                                                                        class="btn btn-primary"
                                                                                        data-toggle="modal"
                                                                                        data-target="#modal-sms-banking"
                                                                                        id="modifierbtn"
                                                                                    >
                                                                                        Modifier
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            this.DeleteUser(
                                                                                                res.id
                                                                                            );
                                                                                        }}
                                                                                        class="btn btn-danger"
                                                                                    >
                                                                                        Supprimer
                                                                                    </button>
                                                                                    {res.ActivatedSMS ==
                                                                                    1 ? (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.ActivateUserOnMSG(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-danger"
                                                                                        >
                                                                                            Désactiver
                                                                                            sur
                                                                                            SMS
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.ActivateUserOnMSG(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-primary"
                                                                                        >
                                                                                            Activer
                                                                                            sur
                                                                                            SMS
                                                                                        </button>
                                                                                    )}

                                                                                    {res.ActivatedEmail ==
                                                                                    1 ? (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.ActivateUserOnEmail(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-danger"
                                                                                        >
                                                                                            Désactiver
                                                                                            sur
                                                                                            Email
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.ActivateUserOnEmail(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-primary"
                                                                                        >
                                                                                            Activer
                                                                                            sur
                                                                                            Email
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="form-check form-switch">
                                                                                    {res.Telephone !=
                                                                                        null &&
                                                                                    res.ActivatedSMS !=
                                                                                        0 ? (
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            id="SMS"
                                                                                            name="SendSMS"
                                                                                            checked
                                                                                            disabled
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .SendSMS
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .SendSMS
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            id="SMS"
                                                                                            name="SendSMS"
                                                                                            // checked
                                                                                            disabled
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .SendSMS
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .SendSMS
                                                                                            }
                                                                                        />
                                                                                    )}

                                                                                    <label
                                                                                        className="form-check-label"
                                                                                        for="SMS"
                                                                                    >
                                                                                        SMS
                                                                                    </label>
                                                                                </div>

                                                                                <div className="form-check form-switch">
                                                                                    {res.Email !=
                                                                                        null &&
                                                                                    res.ActivatedEmail !=
                                                                                        0 ? (
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            id="Email"
                                                                                            name="Cloture"
                                                                                            checked
                                                                                            disabled
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .SendEmail
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .SendEmail
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            id="Email"
                                                                                            name="Cloture"
                                                                                            // checked
                                                                                            disabled
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .SendEmail
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .SendEmail
                                                                                            }
                                                                                        />
                                                                                    )}

                                                                                    <label
                                                                                        className="form-check-label"
                                                                                        for="Email"
                                                                                    >
                                                                                        Email
                                                                                    </label>
                                                                                </div>

                                                                                <UpdateSMSBankingUser
                                                                                    modalId={
                                                                                        res.id
                                                                                    }
                                                                                    data={
                                                                                        this
                                                                                            .state
                                                                                            .fetchUpdateData
                                                                                    }
                                                                                    nameMembre={
                                                                                        res.NomCompte
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )
                                            ) : (
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Compte</th>
                                                            <th>Intitulé</th>
                                                            <th>Civilité</th>
                                                            <th>Adresse</th>
                                                            <th>Téléphone</th>
                                                            <th>Date Act.</th>
                                                            <th>Date Des.</th>
                                                            <th>Compte Abr.</th>
                                                            <th>Action</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state
                                                            .fetchSeachedData && (
                                                            <tr>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .NumCompte
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .NomCompte
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .Civilite
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .Email
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .Telephone
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .DateActivation
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .DateDesActivation
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .NumAbrege
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        class="btn-group"
                                                                        role="group"
                                                                        aria-label="Exemple"
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                this.getIndividualsUserSmsBankingDetails(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSeachedData
                                                                                        .id
                                                                                );
                                                                            }}
                                                                            class="btn btn-primary"
                                                                            data-toggle="modal"
                                                                            data-target="#modal-sms-banking"
                                                                            id="modifierbtn"
                                                                        >
                                                                            Modifier
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                this.DeleteUser(
                                                                                    this
                                                                                        .state
                                                                                        .fetchSeachedData
                                                                                        .id
                                                                                );
                                                                            }}
                                                                            class="btn btn-danger"
                                                                        >
                                                                            Supprimer
                                                                        </button>

                                                                        {this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .ActivatedSMS ==
                                                                        1 ? (
                                                                            <button
                                                                                onClick={() => {
                                                                                    this.ActivateUserOnMSG(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSeachedData
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                                class="btn btn-primary"
                                                                            >
                                                                                Désactiver
                                                                                sur
                                                                                SMS
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => {
                                                                                    this.ActivateUserOnMSG(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSeachedData
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                                class="btn btn-danger"
                                                                            >
                                                                                Activer
                                                                                sur
                                                                                SMS
                                                                            </button>
                                                                        )}

                                                                        {this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .ActivatedEmail ==
                                                                        1 ? (
                                                                            <button
                                                                                onClick={() => {
                                                                                    this.ActivateUserOnEmail(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSeachedData
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                                class="btn btn-danger"
                                                                            >
                                                                                Désactiver
                                                                                sur
                                                                                Email
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => {
                                                                                    this.ActivateUserOnEmail(
                                                                                        this
                                                                                            .state
                                                                                            .fetchSeachedData
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                                class="btn btn-primary"
                                                                            >
                                                                                Activer
                                                                                sur
                                                                                Email
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        {this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .Telephone &&
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .ActivatedSMS ? (
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="SMS"
                                                                                name="SendSMS"
                                                                                checked
                                                                                disabled
                                                                                // value={
                                                                                //     this
                                                                                //         .state
                                                                                //         .SendSMS
                                                                                // }
                                                                                // onChange={
                                                                                //     this
                                                                                //         .SendSMS
                                                                                // }
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="SMS"
                                                                                name="SendSMS"
                                                                                // checked
                                                                                disabled
                                                                                // value={
                                                                                //     this
                                                                                //         .state
                                                                                //         .SendSMS
                                                                                // }
                                                                                // onChange={
                                                                                //     this
                                                                                //         .SendSMS
                                                                                // }
                                                                            />
                                                                        )}

                                                                        <label
                                                                            className="form-check-label"
                                                                            for="SMS"
                                                                        >
                                                                            SMS
                                                                        </label>
                                                                    </div>

                                                                    <div className="form-check form-switch">
                                                                        {this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .Email !=
                                                                            null &&
                                                                        this
                                                                            .state
                                                                            .fetchSeachedData
                                                                            .ActivatedEmail ==
                                                                            1 ? (
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="Email"
                                                                                name="Cloture"
                                                                                checked
                                                                                disabled
                                                                                // value={
                                                                                //     this
                                                                                //         .state
                                                                                //         .SendEmail
                                                                                // }
                                                                                // onChange={
                                                                                //     this
                                                                                //         .SendEmail
                                                                                // }
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="Email"
                                                                                name="Cloture"
                                                                                // checked
                                                                                disabled
                                                                                // value={
                                                                                //     this
                                                                                //         .state
                                                                                //         .SendEmail
                                                                                // }
                                                                                // onChange={
                                                                                //     this
                                                                                //         .SendEmail
                                                                                // }
                                                                            />
                                                                        )}

                                                                        <label
                                                                            className="form-check-label"
                                                                            for="Email"
                                                                        >
                                                                            Email
                                                                        </label>
                                                                    </div>
                                                                    <UpdateSMSBankingUser
                                                                        modalId={
                                                                            this
                                                                                .state
                                                                                .state
                                                                        }
                                                                        data={
                                                                            this
                                                                                .state
                                                                                .fetchUpdateData
                                                                        }
                                                                        nameMembre={
                                                                            this
                                                                                .state
                                                                                .fetchSeachedData
                                                                                .NomCompte
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
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
