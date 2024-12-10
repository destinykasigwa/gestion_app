import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Comptabilite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: false,
            loading3: false,
            compteDebit: "",
            compteCredit: "",
            getDataDebitCDF: null,
            getDataDebitUSD: "",
            LibelleDebit: "",
            LibelleCredit: "",
            MontantDebit: "",
            MontantCredit: "",
            getDataCreditCDF: null,
            getDataCreditUSD: null,
            compteCredit: "",
            DateComptable: "",
            IntituleCompteNew: "",
            RefGroupe: "",
            RefSousGroupe: "",
            RefCadre: "",
            RefTypeCompte: "",
            fetchDayOperation: "",
            fetchCreatedAccount: "",
            searchRefOperation: "",
            fetchSearchedOperation: "",
            fetchDayOperationProduit: "",
            DeviseDebit: "",
            DeviseCredit: "",
        };

        this.actualiser = this.actualiser.bind(this);
        this.fetchCompte = this.fetchCompte.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveOperationDebit = this.saveOperationDebit.bind(this);
        this.saveOperationCredit = this.saveOperationCredit.bind(this);
        this.getDayOperation = this.getDayOperation.bind(this);
        this.handleSeachOperation = this.handleSeachOperation.bind(this);
        this.extourneOperation = this.extourneOperation.bind(this);
        this.addNewAccount = this.addNewAccount.bind(this);
        this.saveNewCompte = this.saveNewCompte.bind(this);
        this.addNewCredit = this.addNewCredit.bind(this);
        this.addNewDebit = this.addNewDebit.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        this.fetchCompte();
        this.getDayOperation();
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
    fetchCompte = async () => {
        const res = await axios.get("/comptabilite/compte/data");
        if (res.data.success == 1) {
            this.setState({
                getDataDebitCDF: res.data.dataChargeCDF,
                getDataDebitUSD: res.data.dataChargeUSD,
                getDataCreditCDF: res.data.dataProduitCDF,
                getDataCreditUSD: res.data.dataProduitUSD,
                fetchCreatedAccount: res.data.dataCompte,
            });
        }
    };

    saveOperationDebit = async (e) => {
        e.preventDefault();
        this.setState({ loading2: true });
        const res = await axios.post(
            "/compte/debit/data/save",
            this.state
            //  {
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            // }
        );
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("addNewDebitBtn")
                .setAttribute("disabled", "disabled");
            this.setState({ loading2: false });
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

    saveOperationCredit = async (e) => {
        e.preventDefault();
        this.setState({ loading3: true });
        const res = await axios.post("/compte/credit/data", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("savebtnCredit")
                .setAttribute("disabled", "disabled");
            this.setState({ loading3: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading3: false });
        }
    };

    getDayOperation = async () => {
        const res = await axios.get("/compte/operation/journalier/charge");
        this.setState({
            fetchDayOperation: res.data.data,
            fetchDayOperationProduit: res.data.dataProduit,
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

    saveNewCompte = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const res = await axios.post("/compte/nouveau/data", this.state);
        if (res.data.success == 1) {
            // this.setState({
            //     fetchSearchedOperation: res.data.data,
            // });
            Swal.fire({
                title: "Ajout Compte",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("saveNewAccountBtn")
                .setAttribute("disabled", "disabled");
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

    addNewAccount(e) {
        e.preventDefault();
        this.setState({
            IntituleCompteNew: "",
            RefGroupe: "",
            RefSousGroupe: "",
            RefTypeCompte: "",
            RefCadre: "",
        });
        document
            .getElementById("saveNewAccountBtn")
            .removeAttribute("disabled", "disabled");
    }

    addNewCredit(e) {
        e.preventDefault();
        this.setState({
            compteCredit: "",
            MontantCredit: "",
            LibelleCredit: "",
        });

        document
            .getElementById("savebtnCredit")
            .removeAttribute("disabled", "disabled");
    }

    addNewDebit(e) {
        e.preventDefault();
        this.setState({
            compteDebit: "",
            MontantDebit: "",
            LibelleDebit: "",
        });
        document
            .getElementById("addNewDebitBtn")
            .removeAttribute("disabled", "disabled");
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
            fontSize: "14px",
        };
        let inputColor = {
            height: "28px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            width: "300px",
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "15px",
        };
        let inputColor2 = {
            height: "28px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "15px",
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
        let compteur = 1;
        let compteur2 = 1;
        let compteur3 = 1;

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
                                        <div className="col-md-8">
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
                                                        id="debit-tab"
                                                        data-toggle="tab"
                                                        href="#debit"
                                                        role="tab"
                                                        aria-controls="debit"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Débiteur
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        id="credit-tab"
                                                        data-toggle="tab"
                                                        href="#credit"
                                                        role="tab"
                                                        aria-controls="credit"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Créditeur
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        id="nouveaucompte-tab"
                                                        data-toggle="tab"
                                                        href="#nouveaucompte"
                                                        role="tab"
                                                        aria-controls="nouveaucompte"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Nouveau compte
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        id="datecomptable-tab"
                                                        data-toggle="tab"
                                                        href="#datecomptable"
                                                        role="tab"
                                                        aria-controls="datecomptable"
                                                        aria-selected="true"
                                                    >
                                                        <i className="fas fa-plus"></i>{" "}
                                                        Date saisie
                                                    </a>
                                                </li>
                                            </ul>
                                            <div
                                                className="tab-content"
                                                id="myTabContent"
                                            >
                                                <div
                                                    className="tab-pane fade show active mt-2 col-md-12 "
                                                    id="debit"
                                                    role="tabpanel"
                                                    aria-labelledby="debit-tab"
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
                                                                ></div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <form>
                                                                        <table>
                                                                            <tr>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    <label
                                                                                        htmlFor="DeviseDebit"
                                                                                        style={
                                                                                            labelColor
                                                                                        }
                                                                                    >
                                                                                        {" "}
                                                                                        Dévise
                                                                                    </label>{" "}
                                                                                </td>

                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    <select
                                                                                        id="DeviseDebit"
                                                                                        name="DeviseDebit"
                                                                                        style={
                                                                                            inputColor2
                                                                                        }
                                                                                        value={
                                                                                            this
                                                                                                .state
                                                                                                .DeviseDebit
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
                                                                            {this
                                                                                .state
                                                                                .DeviseDebit ==
                                                                                "CDF" && (
                                                                                <tr>
                                                                                    <td
                                                                                        style={
                                                                                            borderTable
                                                                                        }
                                                                                    >
                                                                                        <label
                                                                                            style={
                                                                                                labelColor
                                                                                            }
                                                                                        >
                                                                                            Intitulé
                                                                                        </label>
                                                                                    </td>
                                                                                    <td
                                                                                        style={
                                                                                            borderTable
                                                                                        }
                                                                                    >
                                                                                        <input
                                                                                            list="compteDebit"
                                                                                            name="compteDebit"
                                                                                            className="form-control"
                                                                                            style={
                                                                                                inputColor
                                                                                            }
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .compteDebit
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .handleChange
                                                                                            }
                                                                                        />
                                                                                        <datalist id="compteDebit">
                                                                                            {this
                                                                                                .state
                                                                                                .getDataDebitCDF &&
                                                                                                this.state.getDataDebitCDF.map(
                                                                                                    (
                                                                                                        data
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <option
                                                                                                                value={
                                                                                                                    data.NomCompte
                                                                                                                }
                                                                                                            />
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                        </datalist>
                                                                                    </td>
                                                                                </tr>
                                                                            )}

                                                                            {this
                                                                                .state
                                                                                .DeviseDebit ==
                                                                                "USD" && (
                                                                                <tr>
                                                                                    <td
                                                                                        style={
                                                                                            borderTable
                                                                                        }
                                                                                    >
                                                                                        <label
                                                                                            style={
                                                                                                labelColor
                                                                                            }
                                                                                        >
                                                                                            Intitulé
                                                                                        </label>
                                                                                    </td>
                                                                                    <td
                                                                                        style={
                                                                                            borderTable
                                                                                        }
                                                                                    >
                                                                                        <input
                                                                                            list="compteDebit"
                                                                                            name="compteDebit"
                                                                                            className="form-control"
                                                                                            style={
                                                                                                inputColor
                                                                                            }
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .compteDebit
                                                                                            }
                                                                                            onChange={
                                                                                                this
                                                                                                    .handleChange
                                                                                            }
                                                                                        />
                                                                                        <datalist id="compteDebit">
                                                                                            {this
                                                                                                .state
                                                                                                .getDataDebitUSD &&
                                                                                                this.state.getDataDebitUSD.map(
                                                                                                    (
                                                                                                        data
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <option
                                                                                                                value={
                                                                                                                    data.NomCompte
                                                                                                                }
                                                                                                            />
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                        </datalist>
                                                                                    </td>
                                                                                </tr>
                                                                            )}

                                                                            <tr>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    <label
                                                                                        htmlFor="LibelleDebit"
                                                                                        style={
                                                                                            labelColor
                                                                                        }
                                                                                    >
                                                                                        {" "}
                                                                                        Libellé
                                                                                    </label>{" "}
                                                                                </td>

                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    <input
                                                                                        type="text"
                                                                                        style={
                                                                                            inputColor
                                                                                        }
                                                                                        id="LibelleDebit"
                                                                                        name="LibelleDebit"
                                                                                        value={
                                                                                            this
                                                                                                .state
                                                                                                .LibelleDebit
                                                                                        }
                                                                                        onChange={
                                                                                            this
                                                                                                .handleChange
                                                                                        }
                                                                                    />{" "}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    <label
                                                                                        style={
                                                                                            labelColor
                                                                                        }
                                                                                    >
                                                                                        Montant
                                                                                    </label>
                                                                                </td>

                                                                                <input
                                                                                    type="text"
                                                                                    style={{
                                                                                        borderRadius:
                                                                                            "0px",
                                                                                        width: "100px",
                                                                                        boxShadow:
                                                                                            "inset 0 0 5px 5px #888",
                                                                                        fontSize:
                                                                                            "15px",
                                                                                    }}
                                                                                    name="MontantDebit"
                                                                                    className="form-control mt-1 font-weight-bold"
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .MontantDebit
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                ></td>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    <button
                                                                                        type="button"
                                                                                        style={{
                                                                                            borderRadius:
                                                                                                "0px",
                                                                                            width: "30%",
                                                                                            height: "30px",
                                                                                            fontSize:
                                                                                                "12px",
                                                                                        }}
                                                                                        id="addNewDebitBtn"
                                                                                        className="btn btn-primary mt-1"
                                                                                        onClick={
                                                                                            this
                                                                                                .saveOperationDebit
                                                                                        }
                                                                                    >
                                                                                        Débiter{" "}
                                                                                        <i
                                                                                            className={`${
                                                                                                this
                                                                                                    .state
                                                                                                    .loading2
                                                                                                    ? "spinner-border spinner-border-sm"
                                                                                                    : "fas fa-check"
                                                                                            }`}
                                                                                        ></i>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                ></td>
                                                                                <td
                                                                                    style={
                                                                                        borderTable
                                                                                    }
                                                                                >
                                                                                    <button
                                                                                        type="button"
                                                                                        style={{
                                                                                            borderRadius:
                                                                                                "0px",
                                                                                            width: "30%",
                                                                                            height: "30px",
                                                                                            fontSize:
                                                                                                "12px",
                                                                                        }}
                                                                                        id="savebtn"
                                                                                        className="btn btn-success mt-1"
                                                                                        onClick={
                                                                                            this
                                                                                                .addNewDebit
                                                                                        }
                                                                                    >
                                                                                        Ajouter{" "}
                                                                                        <i className="fas fa-plus"></i>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </form>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-12 debiteur-table-div">
                                                                    <div className="col-md-4 float-end mt-1">
                                                                        <div className="input-group input-group-sm">
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
                                                                                ref={
                                                                                    this
                                                                                        .textInput
                                                                                }
                                                                                className="form-control font-weight-bold"
                                                                                placeholder="Rechercher..."
                                                                                name="searchRefOperation"
                                                                                value={
                                                                                    this
                                                                                        .state
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
                                                                                        this
                                                                                            .state
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
                                                                            background:
                                                                                "#444",
                                                                            padding:
                                                                                "5px",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        <thead>
                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                #
                                                                            </th>
                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Reference
                                                                            </th>
                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                NumCompte
                                                                            </th>

                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Montant
                                                                            </th>

                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Devise
                                                                            </th>
                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Opération
                                                                            </th>

                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Libellé
                                                                            </th>
                                                                            <th
                                                                                style={
                                                                                    tableBorder
                                                                                }
                                                                            >
                                                                                Action
                                                                            </th>
                                                                        </thead>
                                                                        {!this
                                                                            .state
                                                                            .fetchSearchedOperation &&
                                                                        this
                                                                            .state
                                                                            .fetchDayOperation
                                                                            ? this.state.fetchDayOperation.map(
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
                                                                                                  {
                                                                                                      res.NumCompte
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
                                                                            : this
                                                                                  .state
                                                                                  .fetchSearchedOperation &&
                                                                              this.state.fetchSearchedOperation.map(
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
                                                                                                  {
                                                                                                      res.NumCompte
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
                                                <div
                                                    className="tab-pane fade  mt-2 col-md-12 "
                                                    id="credit"
                                                    role="tabpanel"
                                                    aria-labelledby="credit-tab"
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
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <form>
                                                                <table>
                                                                    <tr>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <label
                                                                                htmlFor="DeviseCredit"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                Dévise
                                                                            </label>{" "}
                                                                        </td>

                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <select
                                                                                id="DeviseCredit"
                                                                                name="DeviseCredit"
                                                                                style={
                                                                                    inputColor2
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .DeviseCredit
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
                                                                    {this.state
                                                                        .DeviseCredit ==
                                                                        "CDF" && (
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    borderTable
                                                                                }
                                                                            >
                                                                                <label
                                                                                    style={
                                                                                        labelColor
                                                                                    }
                                                                                >
                                                                                    Intitulé
                                                                                </label>
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    borderTable
                                                                                }
                                                                            >
                                                                                <input
                                                                                    list="compteCredit"
                                                                                    name="compteCredit"
                                                                                    className="form-control"
                                                                                    style={
                                                                                        inputColor
                                                                                    }
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .compteCredit
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                                <datalist id="compteCredit">
                                                                                    {this
                                                                                        .state
                                                                                        .getDataCreditCDF &&
                                                                                        this.state.getDataCreditCDF.map(
                                                                                            (
                                                                                                data
                                                                                            ) => {
                                                                                                return (
                                                                                                    <option
                                                                                                        value={
                                                                                                            data.NomCompte
                                                                                                        }
                                                                                                    />
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </datalist>
                                                                            </td>
                                                                        </tr>
                                                                    )}

                                                                    {this.state
                                                                        .DeviseCredit ==
                                                                        "USD" && (
                                                                        <tr>
                                                                            <td
                                                                                style={
                                                                                    borderTable
                                                                                }
                                                                            >
                                                                                <label
                                                                                    style={
                                                                                        labelColor
                                                                                    }
                                                                                >
                                                                                    Intitulé
                                                                                </label>
                                                                            </td>
                                                                            <td
                                                                                style={
                                                                                    borderTable
                                                                                }
                                                                            >
                                                                                <input
                                                                                    list="compteCredit"
                                                                                    name="compteCredit"
                                                                                    className="form-control"
                                                                                    style={
                                                                                        inputColor
                                                                                    }
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .compteCredit
                                                                                    }
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                />
                                                                                <datalist id="compteCredit">
                                                                                    {this
                                                                                        .state
                                                                                        .getDataCreditUSD &&
                                                                                        this.state.getDataCreditUSD.map(
                                                                                            (
                                                                                                data
                                                                                            ) => {
                                                                                                return (
                                                                                                    <option
                                                                                                        value={
                                                                                                            data.NomCompte
                                                                                                        }
                                                                                                    />
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </datalist>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                    <tr>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <label
                                                                                htmlFor="LibelleCredit"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                Libellé
                                                                            </label>{" "}
                                                                        </td>

                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <input
                                                                                type="text"
                                                                                style={
                                                                                    inputColor
                                                                                }
                                                                                id="LibelleCredit"
                                                                                name="LibelleCredit"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .LibelleCredit
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleChange
                                                                                }
                                                                            />{" "}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <label
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                Montant
                                                                            </label>
                                                                        </td>

                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                width: "100px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            name="MontantCredit"
                                                                            className="form-control mt-1 font-weight-bold"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .MontantCredit
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        ></td>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                style={{
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "30%",
                                                                                    height: "30px",
                                                                                    fontSize:
                                                                                        "12px",
                                                                                }}
                                                                                id="savebtnCredit"
                                                                                className="btn btn-primary mt-1"
                                                                                onClick={
                                                                                    this
                                                                                        .saveOperationCredit
                                                                                }
                                                                            >
                                                                                Créditer{" "}
                                                                                <i
                                                                                    className={`${
                                                                                        this
                                                                                            .state
                                                                                            .loading3
                                                                                            ? "spinner-border spinner-border-sm"
                                                                                            : "fas fa-check"
                                                                                    }`}
                                                                                ></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        ></td>
                                                                        <td
                                                                            style={
                                                                                borderTable
                                                                            }
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                style={{
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "30%",
                                                                                    height: "30px",
                                                                                    fontSize:
                                                                                        "12px",
                                                                                }}
                                                                                id="addNewCreditBtn"
                                                                                className="btn btn-success mt-1"
                                                                                onClick={
                                                                                    this
                                                                                        .addNewCredit
                                                                                }
                                                                            >
                                                                                Ajouter{" "}
                                                                                <i className="fas fa-plus"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </form>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 debiteur-table-div">
                                                                <div className="col-md-4 float-end mt-1">
                                                                    <div className="input-group input-group-sm">
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
                                                                            ref={
                                                                                this
                                                                                    .textInput
                                                                            }
                                                                            className="form-control font-weight-bold"
                                                                            placeholder="Rechercher..."
                                                                            name="searchRefOperation"
                                                                            value={
                                                                                this
                                                                                    .state
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
                                                                                    this
                                                                                        .state
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
                                                                        background:
                                                                            "#444",
                                                                        padding:
                                                                            "5px",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            #
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Reference
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            NumCompte
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Montant
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Devise
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Opération
                                                                        </th>

                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Libellé
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Action
                                                                        </th>
                                                                    </thead>
                                                                    {!this.state
                                                                        .fetchSearchedOperation &&
                                                                    this.state
                                                                        .fetchDayOperationProduit
                                                                        ? this.state.fetchDayOperationProduit.map(
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
                                                                                              {" "}
                                                                                              {
                                                                                                  compteur2++
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
                                                                                              {
                                                                                                  res.NumCompte
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
                                                                        : this
                                                                              .state
                                                                              .fetchSearchedOperation &&
                                                                          this.state.fetchSearchedOperation.map(
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
                                                                                              {" "}
                                                                                              {
                                                                                                  compteur2++
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
                                                                                              {
                                                                                                  res.NumCompte
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
                                                <div
                                                    className="tab-pane fade  mt-2 col-md-12 "
                                                    id="nouveaucompte"
                                                    role="tabpanel"
                                                    aria-labelledby="nouveaucompte-tab"
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
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <form>
                                                                <table>
                                                                    <tr>
                                                                        <td>
                                                                            <label
                                                                                htmlFor="IntituleCompteNew"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                Intitulé
                                                                                compte
                                                                            </label>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                id="IntituleCompteNew"
                                                                                name="IntituleCompteNew"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                style={{
                                                                                    width: "300px",
                                                                                    height: "30px",
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    boxShadow:
                                                                                        "inset 0 0 5px 5px #888",
                                                                                    fontSize:
                                                                                        "15px",
                                                                                }}
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .IntituleCompteNew
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
                                                                                htmlFor="RefTypeCompte"
                                                                            >
                                                                                Réf
                                                                                type
                                                                                compte
                                                                            </label>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                id="RefTypeCompte"
                                                                                name="RefTypeCompte"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                style={{
                                                                                    height: "30px",
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "150px",
                                                                                    boxShadow:
                                                                                        "inset 0 0 5px 5px #888",
                                                                                    fontSize:
                                                                                        "15px",
                                                                                }}
                                                                                placeholder="Exemple 7"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .RefTypeCompte
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
                                                                                htmlFor="RefCadre"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                Réf
                                                                                cadre
                                                                            </label>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                id="RefCadre"
                                                                                name="RefCadre"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                placeholder="Exemple 70"
                                                                                style={{
                                                                                    height: "30px",
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "150px",
                                                                                    boxShadow:
                                                                                        "inset 0 0 5px 5px #888",
                                                                                    fontSize:
                                                                                        "15px",
                                                                                }}
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .RefCadre
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
                                                                                htmlFor="RefSousGroupe"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                Réf
                                                                                groupe
                                                                            </label>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                id="RefGroupe"
                                                                                name="RefGroupe"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                style={{
                                                                                    height: "30px",
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "150px",
                                                                                    boxShadow:
                                                                                        "inset 0 0 5px 5px #888",
                                                                                    fontSize:
                                                                                        "15px",
                                                                                }}
                                                                                placeholder="Exemple 700"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .RefGroupe
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
                                                                                htmlFor="RefSousGroupe"
                                                                                style={
                                                                                    labelColor
                                                                                }
                                                                            >
                                                                                Réf
                                                                                sous
                                                                                groupe
                                                                            </label>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                id="RefSousGroupe"
                                                                                name="RefSousGroupe"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                style={{
                                                                                    height: "30px",
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "150px",
                                                                                    boxShadow:
                                                                                        "inset 0 0 5px 5px #888",
                                                                                    fontSize:
                                                                                        "15px",
                                                                                }}
                                                                                placeholder="Exemple 7000"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .RefSousGroupe
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
                                                                                type="button"
                                                                                style={{
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "30%",
                                                                                    height: "30px",
                                                                                    fontSize:
                                                                                        "12px",
                                                                                }}
                                                                                id="saveNewAccountBtn"
                                                                                className="btn btn-primary mt-1"
                                                                                onClick={
                                                                                    this
                                                                                        .saveNewCompte
                                                                                }
                                                                            >
                                                                                Valider{" "}
                                                                                <i
                                                                                    className={`${
                                                                                        this
                                                                                            .state
                                                                                            .loading
                                                                                            ? "spinner-border spinner-border-sm"
                                                                                            : "fas fa-check"
                                                                                    }`}
                                                                                ></i>
                                                                            </button>{" "}
                                                                            <button
                                                                                type="button"
                                                                                style={{
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                    width: "30%",
                                                                                    height: "30px",
                                                                                    fontSize:
                                                                                        "12px",
                                                                                }}
                                                                                id="savebtn"
                                                                                className="btn btn-success mt-1"
                                                                                onClick={
                                                                                    this
                                                                                        .addNewAccount
                                                                                }
                                                                            >
                                                                                Ajouter{" "}
                                                                                <i className="fas fa-plus"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </form>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 table-search-by-name">
                                                                <table
                                                                    className="tableStyle"
                                                                    style={{
                                                                        background:
                                                                            "#444",
                                                                        padding:
                                                                            "5px",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            #
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            NumCompte
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            Nom
                                                                            compte
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            RefTypeCompte
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            RefCadre
                                                                        </th>
                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            RefGroupe
                                                                        </th>

                                                                        <th
                                                                            style={
                                                                                tableBorder
                                                                            }
                                                                        >
                                                                            RefSousGroupe
                                                                        </th>
                                                                    </thead>
                                                                    <tbody>
                                                                        {this
                                                                            .state
                                                                            .fetchCreatedAccount &&
                                                                            this.state.fetchCreatedAccount.map(
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
                                                                                                    compteur3++
                                                                                                }{" "}
                                                                                            </td>
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
                                                                                            <td>
                                                                                                {
                                                                                                    res.RefTypeCompte
                                                                                                }
                                                                                            </td>
                                                                                            <td>
                                                                                                {
                                                                                                    res.RefCadre
                                                                                                }
                                                                                            </td>
                                                                                            <td>
                                                                                                {
                                                                                                    res.RefGroupe
                                                                                                }
                                                                                            </td>
                                                                                            <td>
                                                                                                {
                                                                                                    res.RefSousGroupe
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="tab-pane fade  mt-2 col-md-12 "
                                                    id="datecomptable"
                                                    role="tabpanel"
                                                    aria-labelledby="datecomptable-tab"
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
                                                                ></div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                {/* <form>
                                                                    <table>
                                                                        <tr>
                                                                            <td
                                                                                style={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                    color: "steelblue",
                                                                                }}
                                                                            >
                                                                                Définir
                                                                                la
                                                                                date
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    style={{
                                                                                        height: "33px",
                                                                                        border: "1px solid steelblue",
                                                                                        boxShadow:
                                                                                            "inset 0 0 5px 5px #888",
                                                                                        fontSize:
                                                                                            "15px",
                                                                                    }}
                                                                                    type="date"
                                                                                    name="DateComptable"
                                                                                    onChange={
                                                                                        this
                                                                                            .handleChange
                                                                                    }
                                                                                    value={
                                                                                        this
                                                                                            .state
                                                                                            .DateComptable
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                <button
                                                                                    style={{
                                                                                        height: "33px",
                                                                                        border: "1px solid steelblue",
                                                                                    }}
                                                                                    type="text"
                                                                                    id="btnsaveDate"
                                                                                    disabled
                                                                                    className="btn mt-1"
                                                                                    onClick={
                                                                                        this
                                                                                            .definirDateComptable
                                                                                    }
                                                                                >
                                                                                    <i className="fas fa-check"></i>{" "}
                                                                                    Valider
                                                                                    
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </form> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
