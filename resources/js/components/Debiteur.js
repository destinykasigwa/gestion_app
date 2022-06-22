import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Debiteur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            fetchData: null,
            soldeCDF: "",
            soldeUSD: "",
            compteToSearchCredit: "",
            compteToSearchDebit: "",
            Montant: "",
            Libelle: "",
            NomCompteDebit: "",
            NomCompteCredit: "",
            SoldeCompteCredit: "",
            SoldeCompteDebit: "",
            CodeMonnaieCredit: "",
            CodeMonnaieDebit: "",
            fetchDayOperation: "",
            searchRefOperation: "",
            fetchSearchedOperation: "",
        };
        this.textInput = React.createRef();
        this.actualiser = this.actualiser.bind(this);
        this.handleAccountCredit = this.handleAccountCredit.bind(this);
        this.handleAccountDebit = this.handleAccountDebit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addNewBtn = this.addNewBtn.bind(this);
        this.getDayOperation = this.getDayOperation.bind(this);
        this.handleSeachOperation = this.handleSeachOperation.bind(this);
        this.extourneOperation = this.extourneOperation.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        this.getDayOperation();
    }
    //put focus on given input
    focusTextInput() {
        this.textInput.current.focus();
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

    //GET A SEACHED NUMBER CREDIT ACCOUNT
    handleAccountCredit = async (e) => {
        e.preventDefault();
        const getData = await axios.post(
            "/compte/debiteur/search/credit",
            this.state
        );
        if (getData.data.success == 1) {
            this.setState({
                fetchData: getData.data.data,
                SoldeCompteCredit: getData.data.solde,
            });
            this.setState({
                disabled: !this.state.disabled,
                Operant: this.state.fetchData.NomCompte,
                NomCompteCredit: this.state.fetchData.NomCompte,
                refCompte: this.state.fetchData.NumAdherant,
                CodeMonnaieCredit: this.state.fetchData.CodeMonnaie,
            });
            // console.log(this.state.getMembreSolde);
            //disabled valider button
        } else if (getData.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: getData.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    //GET A SEACHED NUMBER DEBIT ACCOUNT
    handleAccountDebit = async (e) => {
        e.preventDefault();
        const getData = await axios.post(
            "/compte/debiteur/search/debit",
            this.state
        );
        if (getData.data.success == 1) {
            this.setState({
                fetchData: getData.data.data,
                SoldeCompteDebit: getData.data.solde,
            });
            this.setState({
                disabled: !this.state.disabled,
                Operant: this.state.fetchData.NomCompte,
                NomCompteDebit: this.state.fetchData.NomCompte,
                refCompte: this.state.fetchData.NumAdherant,
                CodeMonnaieDebit: this.state.fetchData.CodeMonnaie,
            });
            // console.log(this.state.getMembreSolde);
            //disabled valider button
        } else if (getData.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: getData.data.msg,
                icon: "error",
                button: "OK!",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: getData.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    saveOperation = async (e) => {
        e.preventDefault();
        const res = await axios.post("/debiteur/save/data", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Créditeur",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("savebtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    addNewBtn(e) {
        e.preventDefault();
        this.setState({
            soldeCDF: "",
            soldeUSD: "",
            compteToSearchCredit: "",
            compteToSearchDebit: "",
            Montant: "",
            Libelle: "",
            NomCompteDebit: "",
            NomCompteCredit: "",
            SoldeCompteCredit: "",
            SoldeCompteDebit: "",
            CodeMonnaieCredit: "",
            CodeMonnaieDebit: "",
        });
        document
            .getElementById("savebtn")
            .removeAttribute("disabled", "disabled");

        setTimeout(() => {
            this.textInput.current.focus();
        }, 10);
    }
    getDayOperation = async () => {
        const res = await axios.get("/compte/operation/journalier/debiteur");
        this.setState({
            fetchDayOperation: res.data.data,
        });
    };

    handleSeachOperation = async (ref) => {
        const res = await axios.get(
            "/compte/search/operation/reference/" + ref
        );
        if (res.data.success == 1) {
            this.setState({
                fetchSearchedOperation: res.data.data,
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
    extourneOperation = async (reference) => {
        let x = confirm("Etes-vous sûr de pouvoir extourné cette opération ?");
        if (x == true) {
            const res = await axios.get(
                "/compte/extourne/operation/" + reference
            );
            if (res.data.success == 1) {
                // this.setState({
                //     fetchSearchedOperation: res.data.data,
                // });
                Swal.fire({
                    title: "Créditeur",
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
        } else {
            Swal.fire({
                title: "Annulation",
                text: "L'extourne n'a pas eu lieu",
                icon: "info",
                button: "OK!",
            });
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
        };
        let tableBorder = {
            border: "2px solid #fff",
            fontSize: "14px",
            textAlign: "center",
        };

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
                                        <div
                                            className="row"
                                            style={{
                                                padding: "10px",
                                                border: "2px solid #fff",
                                            }}
                                        >
                                            <div className="col-md-3">
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
                                                            ref={this.textInput}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Compte à créditer..."
                                                            name="compteToSearchCredit"
                                                            value={
                                                                this.state
                                                                    .compteToSearchCredit
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
                                                                        .handleAccountCredit
                                                                }
                                                            >
                                                                <i className="fas fa-search"></i>
                                                            </button>
                                                        </td>
                                                    </div>

                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            type="text"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                            }}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Compte à Débiter"
                                                            name="compteToSearchDebit"
                                                            value={
                                                                this.state
                                                                    .compteToSearchDebit
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
                                                                        .handleAccountDebit
                                                                }
                                                            >
                                                                <i className="fas fa-search"></i>
                                                            </button>
                                                        </td>
                                                    </div>
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Libellé
                                                                </label>{" "}
                                                            </td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    type="text"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        height: "40px",
                                                                        marginTop:
                                                                            "1px",
                                                                    }}
                                                                    name="Libelle"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .Libelle
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
                                                                    Montant
                                                                </label>
                                                            </td>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                    }}
                                                                    name="Montant"
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .Montant
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </tr>

                                                        <tr>
                                                            <td></td>
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
                                                                    id="savebtn"
                                                                    className="btn btn-primary mt-1"
                                                                    onClick={
                                                                        this
                                                                            .saveOperation
                                                                    }
                                                                >
                                                                    Valider{" "}
                                                                    <i className="fas fa-check"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>

                                            {/* separate */}

                                            <div className="col-md-6">
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
                                                                        Crédit
                                                                        sur
                                                                    </label>
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        name="NomCompteCredit"
                                                                        className="form-control mt-1 font-weight-bold"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .NomCompteCredit
                                                                        }
                                                                        disabled
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />{" "}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .SoldeCompteCredit
                                                                    ) < 0 ? (
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                fontSize:
                                                                                    "17px",
                                                                                background:
                                                                                    "red",
                                                                                color: "#fff",
                                                                            }}
                                                                            name="SoldeCompteCredit"
                                                                            className="form-control mt-1 font-weight-bold"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .SoldeCompteCredit &&
                                                                                "Solde actuel: " +
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .SoldeCompteCredit
                                                                                        )
                                                                                    )
                                                                            }
                                                                            disabled
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                fontSize:
                                                                                    "17px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                            name="SoldeCompteCredit"
                                                                            className="form-control mt-1 font-weight-bold"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .SoldeCompteCredit &&
                                                                                "Solde actuel: " +
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .SoldeCompteCredit
                                                                                        )
                                                                                    )
                                                                            }
                                                                            disabled
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    )}
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
                                                                        Débit
                                                                        sur
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        className="form-control mt-1 font-weight-bold"
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        name="NomCompteDebit"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .NomCompteDebit
                                                                        }
                                                                        disabled
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />{" "}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .SoldeCompteDebit
                                                                    ) < 0 ? (
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                fontSize:
                                                                                    "17px",
                                                                                background:
                                                                                    "red",
                                                                                color: "#fff",
                                                                            }}
                                                                            name="SoldeCompteDebit"
                                                                            className="form-control mt-1 font-weight-bold"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .SoldeCompteDebit &&
                                                                                "Solde actuel: " +
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .SoldeCompteDebit
                                                                                        )
                                                                                    )
                                                                            }
                                                                            disabled
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                fontSize:
                                                                                    "17px",
                                                                                background:
                                                                                    "green",
                                                                                color: "#fff",
                                                                            }}
                                                                            name="SoldeCompteDebit"
                                                                            className="form-control mt-1 font-weight-bold"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .SoldeCompteDebit &&
                                                                                "Solde actuel: " +
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .SoldeCompteDebit
                                                                                        )
                                                                                    )
                                                                            }
                                                                            disabled
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>

                                            <div className="col-md-2">
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
                                                                    this
                                                                        .addNewBtn
                                                                }
                                                            >
                                                                Ajouter{" "}
                                                                <i className="fas fa-database"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-8 debiteur-table-div">
                                                <div className="col-md-4 float-end mt-1">
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="text"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                            }}
                                                            ref={this.textInput}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Rechercher..."
                                                            name="searchRefOperation"
                                                            value={
                                                                this.state
                                                                    .searchRefOperation
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
                                                                className="btn btn-success"
                                                                onClick={() => {
                                                                    this.handleSeachOperation(
                                                                        this
                                                                            .state
                                                                            .searchRefOperation
                                                                    );
                                                                }}
                                                            >
                                                                <i className="fas fa-search"></i>
                                                            </button>
                                                        </td>{" "}
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => {
                                                                this.extourneOperation(
                                                                    this.state
                                                                        .searchRefOperation
                                                                );
                                                            }}
                                                        >
                                                            <i class="fas fa-exchange-alt"></i>
                                                            Extouner
                                                        </button>
                                                    </div>
                                                </div>
                                                <table
                                                    className="tableStyle"
                                                    style={{
                                                        background: "#444",
                                                        padding: "5px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <thead>
                                                        <th style={tableBorder}>
                                                            #
                                                        </th>
                                                        <th style={tableBorder}>
                                                            Reference
                                                        </th>
                                                        <th style={tableBorder}>
                                                            Montant
                                                        </th>
                                                        <th style={tableBorder}>
                                                            Devise
                                                        </th>
                                                        <th style={tableBorder}>
                                                            Opération
                                                        </th>

                                                        <th style={tableBorder}>
                                                            Libellé
                                                        </th>
                                                        <th style={tableBorder}>
                                                            Action
                                                        </th>
                                                    </thead>
                                                    {!this.state
                                                        .fetchSearchedOperation &&
                                                    this.state.fetchDayOperation
                                                        ? this.state.fetchDayOperation.map(
                                                              (res, index) => {
                                                                  return (
                                                                      <tr
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <td>
                                                                              {" "}
                                                                              {
                                                                                  compteur++
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              {
                                                                                  res.NumTransaction
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              {parseInt(
                                                                                  res.Credit
                                                                              ) >
                                                                              0
                                                                                  ? parseInt(
                                                                                        res.Credit
                                                                                    )
                                                                                  : parseInt(
                                                                                        res.Debit
                                                                                    )}{" "}
                                                                          </td>
                                                                          <td>
                                                                              {res.CodeMonnaie ==
                                                                              1
                                                                                  ? "USD"
                                                                                  : "CDF"}{" "}
                                                                          </td>
                                                                          <td>
                                                                              {
                                                                                  res.TypeTransaction
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {
                                                                                  res.Libelle
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              <button
                                                                                  className="btn btn-success"
                                                                                  onClick={() => {
                                                                                      this.extourneOperation(
                                                                                          res.NumTransaction
                                                                                      );
                                                                                  }}
                                                                              >
                                                                                  <i class="fas fa-exchange-alt"></i>
                                                                                  Extouner
                                                                              </button>
                                                                          </td>
                                                                      </tr>
                                                                  );
                                                              }
                                                          )
                                                        : this.state
                                                              .fetchSearchedOperation &&
                                                          this.state.fetchSearchedOperation.map(
                                                              (res, index) => {
                                                                  return (
                                                                      <tr
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <td>
                                                                              {" "}
                                                                              {
                                                                                  compteur++
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              {
                                                                                  res.NumTransaction
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              {parseInt(
                                                                                  res.Credit
                                                                              ) >
                                                                              0
                                                                                  ? parseInt(
                                                                                        res.Credit
                                                                                    )
                                                                                  : parseInt(
                                                                                        res.Debit
                                                                                    )}{" "}
                                                                          </td>
                                                                          <td>
                                                                              {res.CodeMonnaie ==
                                                                              1
                                                                                  ? "USD"
                                                                                  : "CDF"}{" "}
                                                                          </td>
                                                                          <td>
                                                                              {
                                                                                  res.TypeTransaction
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {
                                                                                  res.Libelle
                                                                              }{" "}
                                                                          </td>
                                                                          <td>
                                                                              {" "}
                                                                              <button
                                                                                  className="btn btn-success"
                                                                                  onClick={() => {
                                                                                      this.extourneOperation(
                                                                                          res.NumTransaction
                                                                                      );
                                                                                  }}
                                                                              >
                                                                                  <i class="fas fa-exchange-alt"></i>
                                                                                  Extouner
                                                                              </button>
                                                                          </td>
                                                                      </tr>
                                                                  );
                                                              }
                                                          )}
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
