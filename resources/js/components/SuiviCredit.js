import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import UpdateCredit from "./Modals/UpdateCredit";
import UpdateEcheancier from "./Modals/UpdateEcheancier";

export default class SuiviCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: false,
            loadingEch: false,
            compteToSearch: "",
            Decision: "Accepté",
            Motivation: "Client crédible",
            RefTypeCredit: "",
            RefProduitCredit: "",
            CodeAgence: "20",
            CodeGuichet: "0201",
            DateDemande: "",
            DateOctroi: "",
            DateEcheance: "",
            DateTranche: "",
            NbrTranche: "",
            NumCompteEpargne: "",
            NumCompteCredit: "",
            NumCompteEpargneGarantie: "",
            NomCompte: "",
            Duree: "",
            Dufferee: "",
            Grace: "",
            NumDossier: "",
            MontantDemande: "",
            ObjeFinance: "",
            MontantAccorde: "",
            Decision: "",
            Motivation: "",
            CodeMonnaie: "",
            Interval: "",
            ModeRemboursement: "",
            ModeCalcul: "",
            TauxInteret: "",
            CompteInteret: "",
            TauxInteretRetard: "",
            CompteInteretRetard: "",
            InteretRetardIn: "",
            InteretCalcule: "",
            TotCumule: "",
            RemboursCapitalIn: "",
            RemboursInteretIn: "",
            InteretSpotIn: "",
            RemboursEparneProgr: "",
            RemboursInteretRetarIn: "",
            RemboursCapital: "",
            RemboursInteret: "",
            RemboursEpargneProgr: "",
            RemboursInteretRetard: "",
            CapitalRestant: "",
            InteretRestant: "",
            CapitalEchu: "",
            EpargneEchu: "",
            InteretEchu: "",
            InteretRetardEchu: "",
            CapitalDu: "",
            InteretDu: "",
            EpargneDu: "",
            AvanceInteret: "",
            NonEchu: "",
            PourcentageProvision: "",
            JourRetard: "",
            SourceFinancement: "",
            Gestionnaire: "",
            Octroye: "",
            numAdherant: "",
            NumMensualite: "",
            FraisEtudeDossier: "",
            CompteEtudeDossier: "",
            FraisCommission: "",
            CompteCommission: "",
            Animateur: "",
            Accorde: "",
            AccordePar: "",
            OctroyePar: "",
            DateTombeEcheance: "",
            NomUtilisateur: "",
            Cloture: "0",
            CloturePar: "",
            DateCloture: "",
            Radie: "",
            CapitalRadie: "",
            InteretRadie: "",
            DateRadiation: "",
            NumCompteHB: "",
            MontantRadie: "",
            Anticipation: "",
            Reechelonne: "",
            DateReechellonement: "",
            MontantReechelonne: "",
            NbrTrancheReechellonne: "",
            DureeReechellone: "",
            GroupeSolidaire: "",
            Cyclable: "",
            Cycle: "",
            RefMode: "",
            TrancheDecalage: "",
            PeriodiciteDecalage: "",
            DescriptionGarantie: "",
            DureeDecalage: "",
            DateDecale: "",
            InteretPrecompte: "",
            error_list: [],
            fetchData: null,
            fetchData2: null,
            fetchTotInteret: "",
            NumCompteEpargneGarantie: "",
        };
        this.handleMainSave = this.handleMainSave.bind(this);
        this.addNewCredit = this.addNewCredit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.handleSaveEcheancier = this.handleSaveEcheancier.bind(this);
        this.AccordCredit = this.AccordCredit.bind(this);
        this.decaisserCredit = this.decaisserCredit.bind(this);
        this.handleSaveCapitalRembourser =
            this.handleSaveCapitalRembourser.bind(this);
        this.handleSaveInteretRembourser =
            this.handleSaveInteretRembourser.bind(this);
        this.reportCredit = this.reportCredit.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
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
        this.setState({ DateDemande: formatted_date });
    }
    //get data in input
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    handleMainSave = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("/credit/montagecredit", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled, loading: false });
            document
                .getElementById("saveMainBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading: false });
        } else {
            this.setState({
                error_list: res.data.validate_error,
            });
        }
    };
    addNewCredit = async (e) => {
        e.preventDefault();

        const res = await axios.post("/credit/nouveau");
        document
            .getElementById("saveMainBtn")
            .removeAttribute("disabled", "disabled");
        this.setState({
            NumDossier: "ND000" + res.data.lastid,
            NumDemande: "D000" + res.data.lastid,
            DateDemande: "",
            DateOctroi: "",
            DateEcheance: "",
            DateTranche: "",
            NbrTranche: "",
            NomCompte: "",
            NumCompteEpargneGarantie: "",
            Duree: "",
            Dufferee: "",
            Grace: "",
            MontantDemande: "",
            ObjeFinance: "",
            MontantAccorde: "",
            Decision: "",
            Motivation: "",
            Interval: "",
            ModeRemboursement: "",
            ModeCalcul: "",
            TauxInteret: "",
            CompteInteret: "",
            TauxInteretRetard: "",
            CompteInteretRetard: "",
            InteretRetardIn: "",
            InteretCalcule: "",
            TotCumule: "",
            RemboursCapitalIn: "",
            RemboursInteretIn: "",
            InteretSpotIn: "",
            RemboursEparneProgr: "",
            RemboursInteretRetarIn: "",
            RemboursCapital: "",
            RemboursInteret: "",
            RemboursEpargneProgr: "",
            RemboursInteretRetard: "",
            CapitalRestant: "",
            InteretRestant: "",
            CapitalEchu: "",
            EpargneEchu: "",
            InteretEchu: "",
            InteretRetardEchu: "",
            CapitalDu: "",
            InteretDu: "",
            EpargneDu: "",
            AvanceInteret: "",
            NonEchu: "",
            PourcentageProvision: "",
            JourRetard: "",
            SourceFinancement: "",
            Gestionnaire: "",
            Octroye: "",
            NumMensualite: "",
            FraisEtudeDossier: "",
            CompteEtudeDossier: "",
            FraisCommission: "",
            CompteCommission: "",
            Animateur: "",
            Accorde: "",
            AccordePar: "",
            OctroyePar: "",
            DateTombeEcheance: "",
            NomUtilisateur: "",
            // Cloture: "0",
            CloturePar: "",
            DateCloture: "",
            Radie: "",
            CapitalRadie: "",
            InteretRadie: "",
            DateRadiation: "",
            NumCompteHB: "",
            MontantRadie: "",
            Anticipation: "",
            Reechelonne: "",
            DateReechellonement: "",
            MontantReechelonne: "",
            NbrTrancheReechellonne: "",
            DureeReechellone: "",
            GroupeSolidaire: "",
            Cyclable: "",
            Cycle: "",
            RefMode: "",
            TrancheDecalage: "",
            PeriodiciteDecalage: "",
            DureeDecalage: "",
            InteretPrecompte: "",
            DateDecale: "",
            disabled: !this.state.disabled,
            fetchData: null,
            fetchData2: null,
        });
    };

    handleSearch = async (e) => {
        e.preventDefault();
        this.setState({ loading2: true });
        const res = await axios.post("/credit/search", this.state);
        if (res.data.success == 1) {
            this.setState({
                fetchData2: res.data.data,
                fetchData: res.data.data2,
                fetchTotInteret: res.data.soldeInteret,
                loading2: false,
                // disabled: !this.state.disabled,
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
        // console.log(this.state.fetchData2);
        let numCompte = this.state.fetchData2.NumCompte;
        let NumCompteCredit = numCompte.substring(2);
        let NewCreditAccount = "32" + NumCompteCredit;
        let NumEpargneG = numCompte.substring(3);
        let EpargneGarantieEccount = "334" + NumEpargneG;
        this.setState({
            NumCompteCredit: NewCreditAccount,
            NumCompteEpargne: this.state.fetchData2.NumCompte,
            NumCompteEpargneGarantie: EpargneGarantieEccount,
            NomCompte: this.state.fetchData2.NomCompte,
            numAdherant: this.state.fetchData2.NumAdherant,
        });
        this.setState({
            NumDossier: this.state.fetchData.NumDossier,
            RefTypeCredit: this.state.fetchData.RefTypeCredit,
            NbrTranche: this.state.fetchData.NbrTranche,
            // InteretPrecompte:
            //     parseInt(
            //         this.state.MontantAccorde * this.state.fetchData.TauxInteret
            //     ) / 100,
            TauxInteret: this.state.fetchData.TauxInteret,
        });
        console.log(NewCreditAccount);
    };

    handleSaveEcheancier = async (e) => {
        this.setState({ loadingEch: true });
        e.preventDefault();

        const res = await axios.post("/credit/echeancier/generate", this.state);

        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ loading: false });
            document
                .getElementById("saveEcheancierBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loadingEch: false });
        } else {
            this.setState({
                error_list: res.data.validate_error,
                loadingEch: false,
            });
        }

        console.log(this.state);
    };

    //PERMET D'ACCORDER OU OCTROYER UN CREDIT
    AccordCredit = async (e) => {
        if (e.target.checked) {
            this.setState({ isloading: true });
            document
                .getElementById("Accorde")
                .setAttribute("disabled", "disabled");
            const res = await axios.post("/credit/accord", this.state);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Octroi de crédit !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Erreur !",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
        }
    };

    //PERMET DE DECAISSER LE CREDIT
    decaisserCredit = async (e) => {
        document.getElementById("Octroye").setAttribute("disabled", "disabled");
        if (e.target.checked) {
            this.setState({ isloading: true });
            const res = await axios.post("/credit/decaissement", this.state);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Decaissement de crédit !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Decaissement de crédit !",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
        }
    };

    //PERMET DE CLOTURER UN CREDIT
    ClotureCredit = async (e) => {
        if (e.target.checked) {
            this.setState({ isloading: true });
            const res = await axios.post("/credit/cloture", this.state);
            if (res.data.success == 1) {
                Swal.fire({
                    title: "Clôture du crédit !",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            } else if (res.data.success == 0) {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                this.setState({ isloading: false });
            }
        }
    };

    //REMBOURSEMENT EN CAPITAL
    handleSaveCapitalRembourser = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            "/credit/remboursement/capital",
            this.state
        );
        if (res.data.success == 1) {
            Swal.fire({
                title: "Remboursement en capital !",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("saveRemboursBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Remboursement en capital !",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
        console.log(this.state);
    };
    handleSaveInteretRembourser = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            "/credit/remboursement/interet",
            this.state
        );
        if (res.data.success == 1) {
            Swal.fire({
                title: "Remboursement en Intérêt !",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("saveRemboursInterBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Remboursement en Intérêt !",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
        console.log(this.state);
    };

    reportCredit(e) {
        e.preventDefault();
        window.location = "/rapport-credit";
    }

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
            padding: "1px",
            fontSize: "14px",
        };
        // let inputColor = {
        //     height: "25px",
        //     border: "1px solid steelblue",
        //     padding: "3px",
        //     borderRadius: "0px",
        // };

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
                                    <button
                                        style={{
                                            height: "30px",
                                            float: "right",
                                            border: "0px",
                                            padding: "3px",
                                            marginLeft: "5px",
                                        }}
                                        className="btn btn-primary"
                                        onClick={this.reportCredit}
                                    >
                                        <i className="fas fa-eye"></i> Rapport
                                        crédit{" "}
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
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <div className="input-group input-group-sm ">
                                                            <select
                                                                type="text"
                                                                style={{
                                                                    border: "0px",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "13",
                                                                }}
                                                                className="font-weight-bold"
                                                                name="CodeMonnaie"
                                                                value={
                                                                    this.state
                                                                        .CodeMonnaie
                                                                        ? this
                                                                              .state
                                                                              .CodeMonnaie
                                                                        : this
                                                                              .state
                                                                              .fetchData &&
                                                                          this
                                                                              .state
                                                                              .fetchData
                                                                              .CodeMonnaie
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                // disabled={
                                                                //     this.state
                                                                //         .disabled
                                                                //         ? "disabled"
                                                                //         : ""
                                                                // }
                                                            >
                                                                <option value="">
                                                                    Dévise
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

                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "13",
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
                                                            }}
                                                            className="btn btn-primary"
                                                            onClick={
                                                                this
                                                                    .handleSearch
                                                            }
                                                        >
                                                            <i
                                                                className={`${
                                                                    this.state
                                                                        .loading2
                                                                        ? "spinner-border spinner-border-sm"
                                                                        : "fas fa-search"
                                                                }`}
                                                            ></i>
                                                            {/* <i className="fas fa-search"></i> */}
                                                        </button>
                                                    </td>
                                                </div>
                                            </form>
                                        </div>
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
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Numéro compte Epargne..."
                                                        name="NumCompteEpargne"
                                                        value={
                                                            this.state
                                                                .NumCompteEpargne
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="Num Cpte Crédit"
                                                        name="NumCompteCredit"
                                                        disabled
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .NumCompteCredit
                                                        }
                                                    />
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="Epargne garantie"
                                                        name="NumCompteEpargneGarantie"
                                                        disabled
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .NumCompteEpargneGarantie
                                                                ? this.state
                                                                      .NumCompteEpargneGarantie
                                                                : this.state
                                                                      .fetchData &&
                                                                  this.state
                                                                      .fetchData
                                                                      .NumCompteEpargneGarantie
                                                        }
                                                    />
                                                </div>
                                            </form>
                                        </div>
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
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="N° Dossier..."
                                                        name="NumDossier"
                                                        value={
                                                            this.state
                                                                .NumDossier
                                                                ? this.state
                                                                      .NumDossier
                                                                : this.state
                                                                      .fetchData &&
                                                                  this.state
                                                                      .fetchData
                                                                      .NumDossier
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="N° Demande"
                                                        name="NumDemande"
                                                        disabled
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .NumDemande
                                                                ? this.state
                                                                      .NumDemande
                                                                : this.state
                                                                      .fetchData &&
                                                                  this.state
                                                                      .fetchData
                                                                      .NumDemande
                                                        }
                                                    />
                                                </div>

                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="Intitulé"
                                                        name="NomCompte"
                                                        disabled
                                                        style={{
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "13",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state.NomCompte
                                                                ? this.state
                                                                      .NomCompte
                                                                : this.state
                                                                      .fetchData &&
                                                                  this.state
                                                                      .fetchData
                                                                      .NomCompte
                                                        }
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-2">
                                            <form
                                                style={{
                                                    padding: "5px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <div className="form-check form-switch">
                                                    {this.state.fetchData &&
                                                    this.state.fetchData
                                                        .Accorde == "1" ? (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDefault"
                                                            disabled
                                                            checked
                                                        />
                                                    ) : (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDefault"
                                                            disabled
                                                        />
                                                    )}

                                                    <label
                                                        className="form-check-label"
                                                        for="flexSwitchCheckDefault"
                                                    >
                                                        Accordé
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    {this.state.fetchData &&
                                                    this.state.fetchData
                                                        .Octroye == "1" ? (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            disabled
                                                            checked
                                                        />
                                                    ) : (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            disabled
                                                        />
                                                    )}

                                                    <label
                                                        class="form-check-label"
                                                        for="flexSwitchCheckChecked"
                                                    >
                                                        Octroyé
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    {this.state.fetchData &&
                                                    this.state.fetchData
                                                        .Reechelonne == "1" ? (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDisabled"
                                                            disabled
                                                            checked
                                                        />
                                                    ) : (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDisabled"
                                                            disabled
                                                        />
                                                    )}

                                                    <label
                                                        className="form-check-label"
                                                        for="flexSwitchCheckDisabled"
                                                    >
                                                        Réechelonner
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    {this.state.fetchData &&
                                                    this.state.fetchData
                                                        .Cloture == "1" ? (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckCheckedDisabled"
                                                            disabled
                                                            checked
                                                        />
                                                    ) : (
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckCheckedDisabled"
                                                            disabled
                                                        />
                                                    )}

                                                    <label
                                                        className="form-check-label"
                                                        for="flexSwitchCheckCheckedDisabled"
                                                    >
                                                        Cloturé
                                                    </label>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-2">
                                            <form>
                                                <table>
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
                                                                id="addMainBtn"
                                                                className="btn btn-secondary"
                                                                onClick={
                                                                    this
                                                                        .addNewCredit
                                                                }
                                                            >
                                                                Ajouter
                                                                <i className="fas fa-pencil"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {this.state
                                                                .fetchData && (
                                                                <tr>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .fetchData
                                                                            .Accorde ==
                                                                        1 ? (
                                                                            <span
                                                                                className="d-inline-block"
                                                                                tabindex="0"
                                                                                data-toggle="tooltip"
                                                                                title="Impossible de modifier un crédit déjà accordé."
                                                                            >
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
                                                                                    data-toggle="tooltip"
                                                                                    id="modifierbtn"
                                                                                    className="btn btn-success mt-1"
                                                                                    data-placement="top"
                                                                                    disabled
                                                                                >
                                                                                    Modifier{" "}
                                                                                    <i className="fas fa-edit"></i>
                                                                                </button>
                                                                            </span>
                                                                        ) : (
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
                                                                                data-toggle="modal"
                                                                                data-target="#modal-montage-credit"
                                                                                id="modifierbtn"
                                                                                className="btn btn-success mt-1"
                                                                            >
                                                                                Modifier{" "}
                                                                                <i className="fas fa-edit"></i>
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </td>
                                                    </tr>
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
                                                                id="saveMainBtn"
                                                                className="btn btn-primary mt-1"
                                                                onClick={
                                                                    this
                                                                        .handleMainSave
                                                                }
                                                            >
                                                                Valider
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
                                                                    Produit c.
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        style={{
                                                                            border: "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="font-weight-bold"
                                                                        name="RefProduitCredit"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .RefProduitCredit
                                                                            // ? this
                                                                            //       .state
                                                                            //       .RefProduitCredit
                                                                            // : this
                                                                            //       .state
                                                                            //       .fetchData &&
                                                                            //   this
                                                                            //       .state
                                                                            //       .fetchData
                                                                            //       .RefProduitCredit
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
                                                                    Type c.
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        style={{
                                                                            border: "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="font-weight-bold"
                                                                        name="RefTypeCredit"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .RefTypeCredit
                                                                            // ? this
                                                                            //       .state
                                                                            //       .RefTypeCredit
                                                                            // : this
                                                                            //       .state
                                                                            //       .fetchData &&
                                                                            //   this
                                                                            //       .state
                                                                            //       .fetchData
                                                                            //       .RefTypeCredit
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
                                                                        {/* {this
                                                                            .state
                                                                            .RefProduitCredit ==
                                                                            "Crédit au groupe solidaire" && (
                                                                            <>
                                                                                <option value="CREDIT TUINUKE">
                                                                                    CREDIT
                                                                                    TUINUKE
                                                                                </option>
                                                                                <option value="CREDIT INUKA">
                                                                                    CREDIT
                                                                                    INUKA
                                                                                </option>
                                                                            </>
                                                                        )}
                                                                        {this
                                                                            .state
                                                                            .RefProduitCredit ==
                                                                            "Crédit Individuel" && (
                                                                            <>
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
                                                                            </>
                                                                        )} */}
                                                                        <option value="CREDIT TUINUKE">
                                                                            CREDIT
                                                                            TUINUKE
                                                                        </option>
                                                                        <option value="CREDIT INUKA">
                                                                            CREDIT
                                                                            INUKA
                                                                        </option>

                                                                        <option value="C. A LA CONSOMMATION">
                                                                            C. A
                                                                            LA
                                                                            CONSOMMATION
                                                                        </option>
                                                                        <option value="C. PETIT COMMERCE">
                                                                            C.
                                                                            COMMERCERCIAL
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
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="font-weight-bold"
                                                                        name="Gestionnaire"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Gestionnaire
                                                                                ? this
                                                                                      .state
                                                                                      .Gestionnaire
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .Gestionnaire
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

                                                                        <option value="LYDIE">
                                                                            LYDIE
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                            <div className="col-md-3">
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
                                                                    Objet
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <select
                                                                        style={{
                                                                            border: "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="font-weight-bold"
                                                                        name="ObjeFinance"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .ObjeFinance
                                                                                ? this
                                                                                      .state
                                                                                      .ObjeFinance
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .ObjeFinance
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
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="font-weight-bold"
                                                                        name="Gestionnaire"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Gestionnaire
                                                                                ? this
                                                                                      .state
                                                                                      .Gestionnaire
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .Gestionnaire
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
                                                                        <option value="LYDIE">
                                                                            LYDIE
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {/* <tr>
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
                                                                    Solde
                                                                    capital
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
                                                                        name="CapitalDu"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .CapitalDu
                                                                                ? this
                                                                                      .state
                                                                                      .CapitalDu
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .CapitalDu
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
                                                                </div>
                                                            </td>
                                                        </tr> */}
                                                    </table>
                                                </form>
                                            </div>

                                            <div className="col-md-3">
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
                                                                    M. Demande
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="MontantDemande"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .MontantDemande
                                                                                ? this
                                                                                      .state
                                                                                      .MontantDemande
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .MontantDemande
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
                                                                    Taux intérêt
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="TauxInteret"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .TauxInteret
                                                                                ? this
                                                                                      .state
                                                                                      .TauxInteret
                                                                                : this
                                                                                      .state
                                                                                      .fetchData &&
                                                                                  this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .TauxInteret
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
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>

                                            <div className="col-md-3">
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
                                                                    Solde Cap.
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="CapitalDu"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .fetchData
                                                                                ? this
                                                                                      .state
                                                                                      .fetchData
                                                                                      .MontantAccorde
                                                                                : "0,00"
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
                                                                    Tot intérêt
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="InteretRestant"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .fetchTotInteret
                                                                                ? this
                                                                                      .state
                                                                                      .fetchTotInteret
                                                                                      .soldeInteret
                                                                                : "0,00"
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
                                                                    Tot Gén
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "13",
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="TotCumule"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .fetchTotInteret &&
                                                                            this
                                                                                .state
                                                                                .fetchData
                                                                                ? parseInt(
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .MontantAccorde
                                                                                  ) +
                                                                                  parseInt(
                                                                                      this
                                                                                          .state
                                                                                          .fetchTotInteret
                                                                                          .soldeInteret
                                                                                  )
                                                                                : "0,00"
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
                                                    </table>
                                                </form>
                                            </div>
                                            <div
                                                className="row"
                                                style={{
                                                    padding: "10px",
                                                    border: "0px solid #fff",
                                                }}
                                            >
                                                <div className="col-md-3">
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
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="DateDemande"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .DateDemande
                                                                                    ? this
                                                                                          .state
                                                                                          .DateDemande
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .DateDemande
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
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="font-weight-bold"
                                                                            name="ModeRemboursement"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .ModeRemboursement
                                                                                // ? this
                                                                                //       .state
                                                                                //       .ModeRemboursement
                                                                                // : this
                                                                                //       .state
                                                                                //       .fetchData &&
                                                                                //   this
                                                                                //       .state
                                                                                //       .fetchData
                                                                                //       .ModeRemboursement
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
                                                                        Echnce
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="NbrTranche"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NbrTranche
                                                                                // ? this
                                                                                //       .state
                                                                                //       .NbrTranche
                                                                                // : this
                                                                                //       .state
                                                                                //       .fetchData &&
                                                                                //   this
                                                                                //       .state
                                                                                //       .fetchData
                                                                                //       .NbrTranche
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
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>

                                                <div className="col-md-3">
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
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Duree"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Duree
                                                                                // ? this
                                                                                //       .state
                                                                                //       .Duree
                                                                                // : this
                                                                                //       .state
                                                                                //       .fetchData &&
                                                                                //   this
                                                                                //       .state
                                                                                //       .fetchData
                                                                                //       .Duree
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
                                                                        Interval(jrs)
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Interval"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Interval
                                                                                    ? this
                                                                                          .state
                                                                                          .Interval
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .Interval
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
                                                                        Période
                                                                        Grace
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Grace"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Grace
                                                                                    ? this
                                                                                          .state
                                                                                          .Grace
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .Grace
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
                                                        </table>
                                                    </form>
                                                </div>
                                                <div className="col-md-3">
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
                                                                        Taux de
                                                                        retard
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Duree"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .TauxInteretRetard
                                                                                    ? this
                                                                                          .state
                                                                                          .TauxInteretRetard
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .TauxInteretRetard
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
                                                                        Période
                                                                        differée
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="PeriodiciteDecalage"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .PeriodiciteDecalage
                                                                                    ? this
                                                                                          .state
                                                                                          .PeriodiciteDecalage
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .PeriodiciteDecalage
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
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Cycle"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Cycle
                                                                                    ? this
                                                                                          .state
                                                                                          .Cycle
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .Cycle
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
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>

                                                <div className="col-md-3">
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
                                                                        Agence
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="CodeAgence"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .CodeAgence
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
                                                                        Utilisateur
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="NomUtilisateur"
                                                                            value={
                                                                                this
                                                                                    .props
                                                                                    .NomUtilisateur
                                                                                    ? this
                                                                                          .props
                                                                                          .NomUtilisateur
                                                                                    : this
                                                                                          .state
                                                                                          .fetchData &&
                                                                                      this
                                                                                          .state
                                                                                          .fetchData
                                                                                          .NomUtilisateur
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
                                                                        C.
                                                                        Guichet
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group input-group-sm ">
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "13",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="CodeGuichet"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .CodeGuichet
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
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <ul
                                                        className="nav nav-tabs"
                                                        id="myTab"
                                                        role="tablist"
                                                        style={{
                                                            fontWeight: "bold",
                                                            background:
                                                                "#dcdcdc",
                                                            color: "#fff",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link active"
                                                                id="garantie-tab"
                                                                data-toggle="tab"
                                                                href="#garantie"
                                                                role="tab"
                                                                aria-controls="garantie"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Garantie
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link"
                                                                id="echeancier-tab"
                                                                data-toggle="tab"
                                                                href="#echeancier"
                                                                role="tab"
                                                                aria-controls="echeancier"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Echeancier &
                                                                Octrois
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link"
                                                                id="remboursementcap-tab"
                                                                data-toggle="tab"
                                                                href="#remboursementcap"
                                                                role="tab"
                                                                aria-controls="remboursementcap"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Remboursement en
                                                                capital
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link"
                                                                id="remboursementinteret-tab"
                                                                data-toggle="tab"
                                                                href="#remboursementinteret"
                                                                role="tab"
                                                                aria-controls="remboursementinteret"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Remboursement en
                                                                intérêt
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link"
                                                                id="cloture-tab"
                                                                data-toggle="tab"
                                                                href="#cloture"
                                                                role="tab"
                                                                aria-controls="cloture"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Clôture &
                                                                Extourne
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a
                                                                className="nav-link"
                                                                id="action-tab"
                                                                data-toggle="tab"
                                                                href="#action"
                                                                role="tab"
                                                                aria-controls="action"
                                                                aria-selected="true"
                                                            >
                                                                <i className="fas fa-plus"></i>{" "}
                                                                Action
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div
                                                        className="tab-content"
                                                        id="myTabContent"
                                                    >
                                                        <div
                                                            className="tab-pane fade show active  mt-2 col-md-12 "
                                                            id="garantie"
                                                            role="tabpanel"
                                                            aria-labelledby="garantie-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <form>
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
                                                                                                    Compte
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumCompteCredit
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumCompteCredit
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
                                                                                                                      .NumCompteCredit
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
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumDossier"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumDossier
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumDossier
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
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
                                                                                                    Garantie
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <select
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="DescriptionGarantie"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .TypeGarantie
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .TypeGarantie
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
                                                                                                                      .TypeGarantie
                                                                                                        }
                                                                                                        onChange={
                                                                                                            this
                                                                                                                .handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Sélectionnez
                                                                                                        </option>
                                                                                                        <option value="Cautio solidaire">
                                                                                                            Cautio
                                                                                                            solidaire
                                                                                                        </option>
                                                                                                        <option value="Salaire">
                                                                                                            Salaire
                                                                                                        </option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </form>
                                                                                </div>
                                                                                {/* <div className="col-md-2">
                                                                                    <form>
                                                                                        <table>
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
                                                                                                        id="saveGarantieBtn"
                                                                                                        className="btn btn-primary"
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleSaveEcheancier
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-check"></i>
                                                                                                    </button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </form>
                                                                                </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="tab-pane fade mt-2 col-md-12 "
                                                            id="echeancier"
                                                            role="tabpanel"
                                                            aria-labelledby="echeancier-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-12">
                                                                                    <div className="row">
                                                                                        <div className="col-md-2">
                                                                                            <form>
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
                                                                                                            Décision
                                                                                                        </label>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div className="input-group input-group-sm ">
                                                                                                            <select
                                                                                                                type="text"
                                                                                                                style={{
                                                                                                                    borderRadius:
                                                                                                                        "0px",
                                                                                                                    boxShadow:
                                                                                                                        "inset 0 0 5px 5px #888",
                                                                                                                    fontSize:
                                                                                                                        "13",
                                                                                                                }}
                                                                                                                className="form-control font-weight-bold"
                                                                                                                name="Decision"
                                                                                                                value={
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .Decision
                                                                                                                        ? this
                                                                                                                              .state
                                                                                                                              .Decision
                                                                                                                        : this
                                                                                                                              .state
                                                                                                                              .fetchData &&
                                                                                                                          this
                                                                                                                              .state
                                                                                                                              .fetchData
                                                                                                                              .Decision
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    this
                                                                                                                        .handleChange
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="Accepeté">
                                                                                                                    Accepté
                                                                                                                </option>
                                                                                                                <option value="Refusé">
                                                                                                                    Refusé
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
                                                                                                            Motif
                                                                                                        </label>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div className="input-group input-group-sm ">
                                                                                                            <select
                                                                                                                type="text"
                                                                                                                style={{
                                                                                                                    borderRadius:
                                                                                                                        "0px",
                                                                                                                    boxShadow:
                                                                                                                        "inset 0 0 5px 5px #888",
                                                                                                                    fontSize:
                                                                                                                        "13",
                                                                                                                }}
                                                                                                                className="form-control font-weight-bold"
                                                                                                                name="Motivation"
                                                                                                                value={
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .Motivation
                                                                                                                        ? this
                                                                                                                              .state
                                                                                                                              .Motivation
                                                                                                                        : this
                                                                                                                              .state
                                                                                                                              .fetchData &&
                                                                                                                          this
                                                                                                                              .state
                                                                                                                              .fetchData
                                                                                                                              .Motivation
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    this
                                                                                                                        .handleChange
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="Client crédible">
                                                                                                                    Client
                                                                                                                    crédible
                                                                                                                </option>
                                                                                                                <option value="Client non crédible">
                                                                                                                    Client
                                                                                                                    non
                                                                                                                    crédible
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
                                                                                                            Calcul
                                                                                                        </label>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div className="input-group input-group-sm ">
                                                                                                            <select
                                                                                                                type="text"
                                                                                                                style={{
                                                                                                                    borderRadius:
                                                                                                                        "0px",
                                                                                                                    fontWeight:
                                                                                                                        "bold",
                                                                                                                    boxShadow:
                                                                                                                        "inset 0 0 5px 5px #888",
                                                                                                                    fontSize:
                                                                                                                        "13",
                                                                                                                }}
                                                                                                                className={`form-control ${
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .error_list &&
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .error_list
                                                                                                                        .ModeCalcul &&
                                                                                                                    "is-invalid"
                                                                                                                }`}
                                                                                                                name="ModeCalcul"
                                                                                                                value={
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .ModeCalcul
                                                                                                                        ? this
                                                                                                                              .state
                                                                                                                              .ModeCalcul
                                                                                                                        : this
                                                                                                                              .state
                                                                                                                              .fetchData &&
                                                                                                                          this
                                                                                                                              .state
                                                                                                                              .fetchData
                                                                                                                              .ModeCalcul
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    this
                                                                                                                        .handleChange
                                                                                                                }
                                                                                                                // disabled={
                                                                                                                //     this
                                                                                                                //         .state
                                                                                                                //         .disabled
                                                                                                                //         ? "disabled"
                                                                                                                //         : ""
                                                                                                                // }
                                                                                                            >
                                                                                                                <option value="">
                                                                                                                    Sélectionnez
                                                                                                                </option>
                                                                                                                <option value="Degressif">
                                                                                                                    Dégressif
                                                                                                                </option>
                                                                                                                <option value="Constant">
                                                                                                                    Constant
                                                                                                                </option>
                                                                                                                <option value="Degressif__">
                                                                                                                    Degressif
                                                                                                                    M
                                                                                                                    --
                                                                                                                </option>
                                                                                                            </select>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </form>
                                                                                        </div>

                                                                                        <div className="col-md-3">
                                                                                            <form>
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
                                                                                                                Octroie
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                <input
                                                                                                                    type="date"
                                                                                                                    style={{
                                                                                                                        borderRadius:
                                                                                                                            "0px",
                                                                                                                        boxShadow:
                                                                                                                            "inset 0 0 5px 5px #888",
                                                                                                                        fontSize:
                                                                                                                            "13",
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateOctroi"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .DateOctroi
                                                                                                                            ? this
                                                                                                                                  .state
                                                                                                                                  .DateOctroi
                                                                                                                            : this
                                                                                                                                  .state
                                                                                                                                  .fetchData &&
                                                                                                                              this
                                                                                                                                  .state
                                                                                                                                  .fetchData
                                                                                                                                  .DateOctroi
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
                                                                                                                Date
                                                                                                                Echce
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                <input
                                                                                                                    type="date"
                                                                                                                    style={{
                                                                                                                        borderRadius:
                                                                                                                            "0px",
                                                                                                                        boxShadow:
                                                                                                                            "inset 0 0 5px 5px #888",
                                                                                                                        fontSize:
                                                                                                                            "13",
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateEcheance"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .DateEcheance
                                                                                                                            ? this
                                                                                                                                  .state
                                                                                                                                  .DateEcheance
                                                                                                                            : this
                                                                                                                                  .state
                                                                                                                                  .fetchData &&
                                                                                                                              this
                                                                                                                                  .state
                                                                                                                                  .fetchData
                                                                                                                                  .DateEcheance
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
                                                                                                                Montant
                                                                                                                Ac.
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    style={{
                                                                                                                        borderRadius:
                                                                                                                            "0px",
                                                                                                                        fontWeight:
                                                                                                                            "bold",
                                                                                                                        fontSize:
                                                                                                                            "14px",
                                                                                                                        color: "green",
                                                                                                                        boxShadow:
                                                                                                                            "inset 0 0 5px 5px #888",
                                                                                                                        fontSize:
                                                                                                                            "13",
                                                                                                                    }}
                                                                                                                    className={`form-control ${
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .error_list &&
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .error_list
                                                                                                                            .MontantAccorde &&
                                                                                                                        "is-invalid"
                                                                                                                    }`}
                                                                                                                    name="MontantAccorde"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .MontantAccorde
                                                                                                                            ? this
                                                                                                                                  .state
                                                                                                                                  .MontantAccorde
                                                                                                                            : this
                                                                                                                                  .state
                                                                                                                                  .fetchData &&
                                                                                                                              this
                                                                                                                                  .state
                                                                                                                                  .fetchData
                                                                                                                                  .MontantAccorde
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
                                                                                            <form>
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
                                                                                                                Tombé
                                                                                                                d'Echéance
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                <input
                                                                                                                    type="date"
                                                                                                                    style={{
                                                                                                                        borderRadius:
                                                                                                                            "0px",
                                                                                                                        boxShadow:
                                                                                                                            "inset 0 0 5px 5px #888",
                                                                                                                        fontSize:
                                                                                                                            "13",
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateTombeEcheance"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .DateTombeEcheance
                                                                                                                            ? this
                                                                                                                                  .state
                                                                                                                                  .DateTombeEcheance
                                                                                                                            : this
                                                                                                                                  .state
                                                                                                                                  .fetchData &&
                                                                                                                              this
                                                                                                                                  .state
                                                                                                                                  .fetchData
                                                                                                                                  .DateTombeEcheance
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
                                                                                                                Interv
                                                                                                                Tombé
                                                                                                                d'Echce
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    style={{
                                                                                                                        borderRadius:
                                                                                                                            "0px",
                                                                                                                        boxShadow:
                                                                                                                            "inset 0 0 5px 5px #888",
                                                                                                                        fontSize:
                                                                                                                            "13",
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="Interval"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
                                                                                                                            .Interval
                                                                                                                            ? this
                                                                                                                                  .state
                                                                                                                                  .Interval
                                                                                                                            : this
                                                                                                                                  .state
                                                                                                                                  .fetchData &&
                                                                                                                              this
                                                                                                                                  .state
                                                                                                                                  .fetchData
                                                                                                                                  .Interval
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
                                                                                                                Int.
                                                                                                                précompté
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="input-group input-group-sm ">
                                                                                                                {this
                                                                                                                    .state
                                                                                                                    .fetchData &&
                                                                                                                this
                                                                                                                    .state
                                                                                                                    .fetchData
                                                                                                                    .RefTypeCredit ==
                                                                                                                    "CREDIT TUINUKE" ? (
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        style={{
                                                                                                                            borderRadius:
                                                                                                                                "0px",
                                                                                                                            boxShadow:
                                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                                            fontSize:
                                                                                                                                "13",
                                                                                                                        }}
                                                                                                                        className="form-control font-weight-bold"
                                                                                                                        name="InteretPrecompte"
                                                                                                                        value={
                                                                                                                            parseInt(
                                                                                                                                this
                                                                                                                                    .state
                                                                                                                                    .fetchData
                                                                                                                                    .MontantAccorde *
                                                                                                                                    this
                                                                                                                                        .state
                                                                                                                                        .fetchData
                                                                                                                                        .TauxInteret
                                                                                                                            ) /
                                                                                                                            100
                                                                                                                        }
                                                                                                                        onChange={
                                                                                                                            this
                                                                                                                                .handleChange
                                                                                                                        }
                                                                                                                        disabled
                                                                                                                    />
                                                                                                                ) : (
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        style={{
                                                                                                                            borderRadius:
                                                                                                                                "0px",
                                                                                                                            boxShadow:
                                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                                            fontSize:
                                                                                                                                "13",
                                                                                                                        }}
                                                                                                                        className="form-control font-weight-bold"
                                                                                                                        name="InteretPrecompte"
                                                                                                                        value={
                                                                                                                            this
                                                                                                                                .state
                                                                                                                                .InteretPrecompte
                                                                                                                                ? this
                                                                                                                                      .state
                                                                                                                                      .InteretPrecompte
                                                                                                                                : this
                                                                                                                                      .state
                                                                                                                                      .fetchData &&
                                                                                                                                  this
                                                                                                                                      .state
                                                                                                                                      .fetchData
                                                                                                                                      .InteretPrecompte
                                                                                                                        }
                                                                                                                        onChange={
                                                                                                                            this
                                                                                                                                .handleChange
                                                                                                                        }
                                                                                                                        disabled
                                                                                                                    />
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </form>
                                                                                        </div>

                                                                                        <div className="col-md-2">
                                                                                            <form>
                                                                                                <table>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            {this
                                                                                                                .state
                                                                                                                .fetchData &&
                                                                                                            parseInt(
                                                                                                                this
                                                                                                                    .state
                                                                                                                    .fetchData
                                                                                                                    .MontantAccorde
                                                                                                            ) >
                                                                                                                0 ? (
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
                                                                                                                    id="saveEcheancierBtn"
                                                                                                                    className="btn btn-primary"
                                                                                                                    onClick={
                                                                                                                        this
                                                                                                                            .handleSaveEcheancier
                                                                                                                    }
                                                                                                                    disabled
                                                                                                                >
                                                                                                                    Valider
                                                                                                                    <i
                                                                                                                        className={`${
                                                                                                                            this
                                                                                                                                .state
                                                                                                                                .loadingEch
                                                                                                                                ? "spinner-border spinner-border-sm"
                                                                                                                                : "fas fa-save"
                                                                                                                        }`}
                                                                                                                    ></i>{" "}
                                                                                                                </button>
                                                                                                            ) : (
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
                                                                                                                    id="saveEcheancierBtn"
                                                                                                                    className="btn btn-primary"
                                                                                                                    onClick={
                                                                                                                        this
                                                                                                                            .handleSaveEcheancier
                                                                                                                    }
                                                                                                                >
                                                                                                                    Valider
                                                                                                                    <i
                                                                                                                        className={`${
                                                                                                                            this
                                                                                                                                .state
                                                                                                                                .loading
                                                                                                                                ? "spinner-border spinner-border-sm"
                                                                                                                                : "fas fa-save"
                                                                                                                        }`}
                                                                                                                    ></i>{" "}
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    {this
                                                                                                        .state
                                                                                                        .fetchData && (
                                                                                                        <tr>
                                                                                                            <td>
                                                                                                                {this
                                                                                                                    .state
                                                                                                                    .fetchData
                                                                                                                    .Accorde ==
                                                                                                                1 ? (
                                                                                                                    <span
                                                                                                                        className="d-inline-block"
                                                                                                                        tabindex="0"
                                                                                                                        data-toggle="tooltip"
                                                                                                                        title="Impossible de modifier un crédit déjà accordé."
                                                                                                                    >
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
                                                                                                                            data-toggle="tooltip"
                                                                                                                            id="modifierbtn"
                                                                                                                            className="btn btn-success mt-1"
                                                                                                                            data-placement="top"
                                                                                                                            disabled
                                                                                                                        >
                                                                                                                            Modifier{" "}
                                                                                                                            <i className="fas fa-edit"></i>
                                                                                                                        </button>
                                                                                                                    </span>
                                                                                                                ) : (
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
                                                                                                                        data-toggle="modal"
                                                                                                                        data-target="#modal-update-echeancier"
                                                                                                                        id="modifierbtn"
                                                                                                                        className="btn btn-success mt-1"
                                                                                                                    >
                                                                                                                        Modifier{" "}
                                                                                                                        <i className="fas fa-edit"></i>
                                                                                                                    </button>
                                                                                                                )}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )}
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

                                                        <div
                                                            className="tab-pane fade mt-2 col-md-12 "
                                                            id="remboursementcap"
                                                            role="tabpanel"
                                                            aria-labelledby="remboursementcap-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <form>
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
                                                                                                    Compte
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumCompteCredit
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumCompteCredit
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
                                                                                                                      .NumCompteCredit
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
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumDossier"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumDossier
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumDossier
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
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
                                                                                                    Montant
                                                                                                    Cap
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="RemboursCapital"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .RemboursCapital
                                                                                                        }
                                                                                                        onChange={
                                                                                                            this
                                                                                                                .handleChange
                                                                                                        }
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </form>
                                                                                </div>
                                                                                <div className="col-md-2">
                                                                                    <form>
                                                                                        <table>
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
                                                                                                        id="saveRemboursBtn"
                                                                                                        className="btn btn-primary "
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleSaveCapitalRembourser
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-save"></i>
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

                                                        <div
                                                            className="tab-pane fade mt-2 col-md-12 "
                                                            id="remboursementinteret"
                                                            role="tabpanel"
                                                            aria-labelledby="remboursementinteret-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <form>
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
                                                                                                    Compte
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumCompteCredit
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumCompteCredit
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
                                                                                                                      .NumCompteCredit
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
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumDossier"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .NumDossier
                                                                                                                ? this
                                                                                                                      .state
                                                                                                                      .NumDossier
                                                                                                                : this
                                                                                                                      .state
                                                                                                                      .fetchData &&
                                                                                                                  this
                                                                                                                      .state
                                                                                                                      .fetchData
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
                                                                                                    Montant
                                                                                                    Int.
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                            boxShadow:
                                                                                                                "inset 0 0 5px 5px #888",
                                                                                                            fontSize:
                                                                                                                "13",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="RemboursInteret"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .RemboursInteret
                                                                                                        }
                                                                                                        onChange={
                                                                                                            this
                                                                                                                .handleChange
                                                                                                        }
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </form>
                                                                                </div>
                                                                                <div className="col-md-2">
                                                                                    <form>
                                                                                        <table>
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
                                                                                                        id="saveRemboursInterBtn"
                                                                                                        className="btn btn-primary "
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleSaveInteretRembourser
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-save"></i>
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

                                                        <div
                                                            className="tab-pane fade mt-2 col-md-12 "
                                                            id="cloture"
                                                            role="tabpanel"
                                                            aria-labelledby="cloture-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-1">
                                                                                    <form>
                                                                                        <tr>
                                                                                            <td
                                                                                                style={
                                                                                                    tableBorder
                                                                                                }
                                                                                            >
                                                                                                <div className="form-check form-switch">
                                                                                                    {this
                                                                                                        .state
                                                                                                        .fetchData &&
                                                                                                    this
                                                                                                        .state
                                                                                                        .fetchData
                                                                                                        .Cloture ==
                                                                                                        1 ? (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="cloturer"
                                                                                                            checked
                                                                                                            disabled
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="cloturer"
                                                                                                            name="Cloture"
                                                                                                            value={
                                                                                                                this
                                                                                                                    .state
                                                                                                                    .Cloture
                                                                                                                    ? this
                                                                                                                          .state
                                                                                                                          .Cloture
                                                                                                                    : this
                                                                                                                          .state
                                                                                                                          .fetchData &&
                                                                                                                      this
                                                                                                                          .state
                                                                                                                          .fetchData
                                                                                                                          .Cloture
                                                                                                            }
                                                                                                            onChange={
                                                                                                                this
                                                                                                                    .ClotureCredit
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        for="cloturer"
                                                                                                    >
                                                                                                        Cloturer
                                                                                                    </label>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        {/* <tr>
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
                                                                                                    id="SaveClotureDossierBtn"
                                                                                                    className="btn btn-primary "
                                                                                                    onClick={
                                                                                                        this
                                                                                                            .handleSaveClotureDossier
                                                                                                    }
                                                                                                >
                                                                                                    Valider
                                                                                                    <i className="fas fa-check"></i>
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr> */}
                                                                                    </form>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="tab-pane fade mt-2 col-md-12 "
                                                            id="action"
                                                            role="tabpanel"
                                                            aria-labelledby="action-tab"
                                                        >
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    padding:
                                                                        "10px",
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
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-1">
                                                                                    <form>
                                                                                        <tr>
                                                                                            <td
                                                                                                style={
                                                                                                    tableBorder
                                                                                                }
                                                                                            >
                                                                                                <div className="form-check form-switch">
                                                                                                    {this
                                                                                                        .state
                                                                                                        .fetchData &&
                                                                                                    this
                                                                                                        .state
                                                                                                        .fetchData
                                                                                                        .Accorde ? (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="Accorde"
                                                                                                            name="Accorde"
                                                                                                            checked
                                                                                                            disabled
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="Accorde"
                                                                                                            name="Accorde"
                                                                                                            value={
                                                                                                                this
                                                                                                                    .state
                                                                                                                    .Accorde
                                                                                                                    ? this
                                                                                                                          .state
                                                                                                                          .Accorde
                                                                                                                    : this
                                                                                                                          .state
                                                                                                                          .fetchData &&
                                                                                                                      this
                                                                                                                          .state
                                                                                                                          .fetchData
                                                                                                                          .Accorde
                                                                                                            }
                                                                                                            onChange={
                                                                                                                this
                                                                                                                    .AccordCredit
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        for="Accorde"
                                                                                                    >
                                                                                                        Accorder
                                                                                                    </label>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>

                                                                                        <tr>
                                                                                            <td
                                                                                                style={
                                                                                                    tableBorder
                                                                                                }
                                                                                            >
                                                                                                <div className="form-check form-switch">
                                                                                                    {this
                                                                                                        .state
                                                                                                        .fetchData &&
                                                                                                    this
                                                                                                        .state
                                                                                                        .fetchData
                                                                                                        .Octroye ? (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="Octroye"
                                                                                                            name="Octroye"
                                                                                                            checked
                                                                                                            disabled
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="checkbox"
                                                                                                            id="Octroye"
                                                                                                            name=""
                                                                                                            value={
                                                                                                                this
                                                                                                                    .state
                                                                                                                    .Octroye
                                                                                                                    ? this
                                                                                                                          .state
                                                                                                                          .Octroye
                                                                                                                    : this
                                                                                                                          .state
                                                                                                                          .fetchData &&
                                                                                                                      this
                                                                                                                          .state
                                                                                                                          .fetchData
                                                                                                                          .Octroye
                                                                                                            }
                                                                                                            onChange={
                                                                                                                this
                                                                                                                    .decaisserCredit
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        for="Octroye"
                                                                                                    >
                                                                                                        Déboursement
                                                                                                    </label>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.fetchData && (
                            <>
                                <UpdateCredit
                                    numDossier={
                                        this.state.fetchData
                                            ? this.state.fetchData.NumDossier
                                            : null
                                    }
                                    creditData={this.state.fetchData}
                                />

                                <UpdateEcheancier
                                    numDossier={
                                        this.state.fetchData
                                            ? this.state.fetchData.NumDossier
                                            : null
                                    }
                                    creditData={this.state.fetchData}
                                />
                            </>
                        )}
                    </div>
                )}
            </React.Fragment>
        );
    }
}
