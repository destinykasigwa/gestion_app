import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class UpdateCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            RefTypeCredit: "",
            RefProduitCredit: "",
            MontantDemande: "",
            ObjeFinance: "",
            Motivation: "",
            ModeRemboursement: "",
            TauxInteret: "",
            DateDemande: "",
            NbrTranche: "",
            Cycle: "",
            Duree: "",
            CodeMonnaie: "",
            Gestionnaire: "",
            NumDossier: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMainUpdate = this.handleMainUpdate.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
    }

    // get data in input
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    static getDerivedStateFromProps(props, current_state) {
        let UpDateCredit = {
            RefTypeCredit: "",
            RefProduitCredit: "",
            MontantDemande: "",
            ObjeFinance: "",
            Motivation: "",
            ModeRemboursement: "",
            TauxInteret: "",
            DateDemande: "",
            NbrTranche: "",
            Cycle: "",
            Duree: "",
            CodeMonnaie: "",
            Gestionnaire: "",
            NumDossier: "",
        };
        //updating data from input
        if (
            current_state.RefProduitCredit &&
            current_state.RefProduitCredit !== props.creditData.RefProduitCredit
        ) {
            return null;
        }

        if (
            current_state.RefTypeCredit &&
            current_state.RefTypeCredit !== props.creditData.RefTypeCredit
        ) {
            return null;
        }

        if (
            current_state.MontantDemande &&
            current_state.MontantDemande !== props.creditData.MontantDemande
        ) {
            return null;
        }

        if (
            current_state.ObjeFinance &&
            current_state.ObjeFinance !== props.creditData.ObjeFinance
        ) {
            return null;
        }

        if (
            current_state.Motivation &&
            current_state.Motivation !== props.creditData.Motivation
        ) {
            return null;
        }

        if (
            current_state.ModeRemboursement &&
            current_state.ModeRemboursement !==
                props.creditData.ModeRemboursement
        ) {
            return null;
        }

        if (
            current_state.TauxInteret &&
            current_state.TauxInteret !== props.creditData.TauxInteret
        ) {
            return null;
        }

        if (
            current_state.DateDemande &&
            current_state.DateDemande !== props.creditData.DateDemande
        ) {
            return null;
        }

        if (
            current_state.NbrTranche &&
            current_state.NbrTranche !== props.creditData.NbrTranche
        ) {
            return null;
        }

        if (
            current_state.Cycle &&
            current_state.Cycle !== props.creditData.Cycle
        ) {
            return null;
        }

        if (
            current_state.Duree &&
            current_state.Duree !== props.creditData.Duree
        ) {
            return null;
        }
        if (
            current_state.CodeMonnaie &&
            current_state.CodeMonnaie !== props.creditData.CodeMonnaie
        ) {
            return null;
        }
        if (
            current_state.Gestionnaire &&
            current_state.Gestionnaire !== props.creditData.Gestionnaire
        ) {
            return null;
        }
        if (
            current_state.NumDossier &&
            current_state.NumDossier !== props.creditData.NumDossier
        ) {
            return null;
        }

        //updating data from props below
        if (
            current_state.RefTypeCredit !== props.creditData.RefTypeCredit ||
            current_state.RefTypeCredit === props.creditData.RefTypeCredit
        ) {
            UpDateCredit.RefTypeCredit = props.creditData.RefTypeCredit;
        }

        if (
            current_state.RefProduitCredit !==
                props.creditData.RefProduitCredit ||
            current_state.RefProduitCredit === props.creditData.RefProduitCredit
        ) {
            UpDateCredit.RefProduitCredit = props.creditData.RefProduitCredit;
        }
        if (
            current_state.MontantDemande !== props.creditData.MontantDemande ||
            current_state.MontantDemande === props.creditData.MontantDemande
        ) {
            UpDateCredit.MontantDemande = props.creditData.MontantDemande;
        }
        if (
            current_state.ObjeFinance !== props.creditData.ObjeFinance ||
            current_state.ObjeFinance === props.creditData.ObjeFinance
        ) {
            UpDateCredit.ObjeFinance = props.creditData.ObjeFinance;
        }

        if (
            current_state.Motivation !== props.creditData.Motivation ||
            current_state.Motivation === props.creditData.Motivation
        ) {
            UpDateCredit.Motivation = props.creditData.Motivation;
        }

        if (
            current_state.ModeRemboursement !==
                props.creditData.ModeRemboursement ||
            current_state.ModeRemboursement ===
                props.creditData.ModeRemboursement
        ) {
            UpDateCredit.ModeRemboursement = props.creditData.ModeRemboursement;
        }

        if (
            current_state.TauxInteret !== props.creditData.TauxInteret ||
            current_state.TauxInteret === props.creditData.TauxInteret
        ) {
            UpDateCredit.TauxInteret = props.creditData.TauxInteret;
        }

        if (
            current_state.DateDemande !== props.creditData.DateDemande ||
            current_state.DateDemande === props.creditData.DateDemande
        ) {
            UpDateCredit.DateDemande = props.creditData.DateDemande;
        }

        if (
            current_state.NbrTranche !== props.creditData.NbrTranche ||
            current_state.NbrTranche === props.creditData.NbrTranche
        ) {
            UpDateCredit.NbrTranche = props.creditData.NbrTranche;
        }

        if (
            current_state.Cycle !== props.creditData.Cycle ||
            current_state.Cycle === props.creditData.Cycle
        ) {
            UpDateCredit.Cycle = props.creditData.Cycle;
        }

        if (
            current_state.Duree !== props.creditData.Duree ||
            current_state.Duree === props.creditData.Duree
        ) {
            UpDateCredit.Duree = props.creditData.Duree;
        }

        if (
            current_state.CodeMonnaie !== props.creditData.CodeMonnaie ||
            current_state.CodeMonnaie === props.creditData.CodeMonnaie
        ) {
            UpDateCredit.CodeMonnaie = props.creditData.CodeMonnaie;
        }
        if (
            current_state.Gestionnaire !== props.creditData.Gestionnaire ||
            current_state.Gestionnaire === props.creditData.Gestionnaire
        ) {
            UpDateCredit.Gestionnaire = props.creditData.Gestionnaire;
        }
        if (
            current_state.NumDossier !== props.creditData.NumDossier ||
            current_state.NumDossier === props.creditData.NumDossier
        ) {
            UpDateCredit.NumDossier = props.creditData.NumDossier;
        }

        return UpDateCredit;
    }

    handleMainUpdate = async (e) => {
        e.preventDefault();
        this.setState({ numDossier: this.props.numDossier });
        const res = await axios.post("/montage/credit/update", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        }

        console.log(this.state);
    };

    render() {
        let labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "1px",
            fontSize: "14px",
        };

        let tableBorder = {
            border: "0px solid #fff",
            fontSize: "14px",
            textAlign: "left",
        };
        return (
            <>
                <div className="modal fade" id="modal-montage-credit">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Modification du crédit Numéro{" "}
                                    <strong> {this.props.numDossier} </strong>
                                </h4>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div
                                            className="card-body h-200"
                                            style={{
                                                background: "#dcdcdc",
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <form
                                                        style={{
                                                            padding: "10px",
                                                            border: "0px solid #fff",
                                                        }}
                                                    >
                                                        <table>
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
                                                                        Produit
                                                                        de
                                                                        crédit
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="RefProduitCredit"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .RefProduitCredit
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="Crédit au groupe solidaire">
                                                                                Crédit
                                                                                au
                                                                                GS
                                                                            </option>
                                                                            <option value="Crédit Individuel">
                                                                                Crédit
                                                                                Individuel
                                                                            </option>
                                                                        </select>
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
                                                                        Type
                                                                        Crédit
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="RefTypeCredit"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .RefTypeCredit
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>

                                                                            <option value="CREDIT TUINUKE">
                                                                                CREDIT
                                                                                TUINUKE
                                                                            </option>
                                                                            <option value="CREDIT INUKA">
                                                                                CREDIT
                                                                                INUKA
                                                                            </option>

                                                                            <option value="CREDIT A LA CONSOMMATION">
                                                                                CREDIT
                                                                                A
                                                                                LA
                                                                                CONSOMMATION
                                                                            </option>
                                                                            <option value="CREDIT PETIT COMMERCE">
                                                                                CREDIT
                                                                                PETIT
                                                                                COMMERCE
                                                                            </option>
                                                                        </select>
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
                                                                        Recouvreur
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            type="text"
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="Gestionnaire"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Gestionnaire
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="DESTIN KASIGWA">
                                                                                DESTIN
                                                                                KASIGWA
                                                                            </option>
                                                                            <option value="FSHAMABA">
                                                                                FSHAMAMBA
                                                                            </option>
                                                                        </select>
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
                                                                        Objet
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="ObjeFinance"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .ObjeFinance
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="Commerce">
                                                                                Commerce
                                                                            </option>
                                                                            <option value="Scolarité">
                                                                                Scolarité
                                                                            </option>
                                                                            <option value="Autre">
                                                                                Autre
                                                                            </option>
                                                                        </select>
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
                                                                        Gestionnaire
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="Gestionnaire"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Gestionnaire
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="DESTIN KASIGWA">
                                                                                DESTIN
                                                                                KASIGWA
                                                                            </option>
                                                                        </select>
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
                                                                        M.
                                                                        Demande
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="MontantDemande"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .MontantDemande
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
                                                                        Taux
                                                                        intérêt
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="TauxInteret"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .TauxInteret
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                                <div className="col-md-4">
                                                    <form
                                                        style={{
                                                            padding: "10px",
                                                            border: "0px solid #fff",
                                                        }}
                                                    >
                                                        <table>
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
                                                                        Date
                                                                        demande
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="date"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="DateDemande"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .DateDemande
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
                                                                        Frequence
                                                                        de
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            type="text"
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="ModeRemboursement"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .ModeRemboursement
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Sélectionnez
                                                                            </option>
                                                                            <option value="Journalier">
                                                                                Journalier
                                                                            </option>
                                                                            <option value="Hebdomadaire">
                                                                                Hebdomadaire
                                                                            </option>
                                                                            <option value="Mensuel">
                                                                                Mensuelle
                                                                            </option>
                                                                        </select>
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
                                                                        Nbr
                                                                        Echéance
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="NbrTranche"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NbrTranche
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
                                                                        Cycle
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Cycle"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Cycle
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
                                                                        Duree(jrs)
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Duree"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Duree
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
                                                                        Monnaie
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <select
                                                                            type="text"
                                                                            style={{
                                                                                border: "0px",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="CodeMonnaie"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .CodeMonnaie
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
                                                                        Num
                                                                        Dossier
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            placeholder="N° Dossier..."
                                                                            name="NumDossier"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NumDossier
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            disabled
                                                                        />
                                                                    </div>
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
                                                                            width: "100%",
                                                                            height: "30px",
                                                                            fontSize:
                                                                                "12px",
                                                                        }}
                                                                        id="saveMainBtn"
                                                                        className="btn btn-primary mt-1"
                                                                        onClick={
                                                                            this
                                                                                .handleMainUpdate
                                                                        }
                                                                    >
                                                                        Valider{" "}
                                                                        <i
                                                                            className={`${
                                                                                this
                                                                                    .state
                                                                                    .loading
                                                                                    ? "spinner-border spinner-border-sm"
                                                                                    : "fas fa-database"
                                                                            }`}
                                                                        ></i>{" "}
                                                                    </button>
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
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
