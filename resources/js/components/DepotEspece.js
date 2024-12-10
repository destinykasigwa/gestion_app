import React from "react";
import "../../css/app.css";
import axios from "axios";
import Swal from "sweetalert2";

export default class DepotEspece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: false,
            DateTransaction: "",
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montantDepot: 0,
            devise: "",
            numCompte: "",
            intitule: "",
            vightMille: 0,
            dixMille: 0,
            cinqMille: 0,
            milleFranc: 0,
            cinqCentFr: 0,
            deuxCentFranc: 0,
            centFranc: 0,
            cinquanteFanc: 0,
            telDeposant: "",
            operant: "",
            deposantName: "",
            commission: 0,
            codeAgence: "20",
            libelle: "DEPOT D'ESPECE",
            error_list: [],
            taux: "2000",
            fetchData: null,
            compteToSearch: "",
            refCompte: "",
            getAllBilletage: null,
            getBilletageUSD: null,
            getLastestOperationCDF: null,
            getLastestOperationUSD: null,
            getSommeCDF: null,
            getSommeUSD: null,
            fetchDaylyAproCDF: null,
            fetchDaylyAproUSD: null,
            soldeCDF: "",
            soldeUSD: "",
            fetchDataCapRetard: "",
        };
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.getBilletage = this.getBilletage.bind(this);
        this.getDaylyAppro = this.getDaylyAppro.bind(this);
        this.acceptItemCDF = this.acceptItemCDF.bind(this);
        this.acceptItemUSD = this.acceptItemUSD.bind(this);
        this.addNewBtn = this.addNewBtn.bind(this);
        this.printRecu = this.printRecu.bind(this);
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

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printBtn")
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
        this.getBilletage();
        this.getDaylyAppro();
    }

    saveOperation = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("/depot/espece", this.state);

        if (res.data.success == 1) {
            Swal.fire({
                title: "Crédit sur compte",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled, loading: false });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printBtn")
                .removeAttribute("disabled", "disabled");
            this.setState({
                hundred: 0,
                fitfty: 0,
                twenty: 0,
                ten: 0,
                five: 0,
                oneDollar: 0,
                montantDepot: 0,
                devise: "",
                numCompte: "",
                intitule: "",
                vightMille: 0,
                dixMille: 0,
                cinqMille: 0,
                milleFranc: 0,
                cinqCentFr: 0,
                deuxCentFranc: 0,
                centFranc: 0,
                cinquanteFanc: 0,
                telDeposant: "",
                operant: "",
                deposantName: "",
                codeAgence: "20",
                libelle: "DEPOT D'ESPECE",
                error_list: [],
                taux: "2000",
                fetchData: null,
                compteToSearch: "",
                refCompte: "",
                // getAllBilletage: null,
                // getBilletageUSD: null,
                // getLastestOperationCDF: null,
                // getLastestOperationUSD: null,
                // getSommeCDF: null,
                // getSommeUSD: null,
                fetchDaylyAproCDF: null,
                fetchDaylyAproUSD: null,
                soldeCDF: "",
                soldeUSD: "",
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Crédit sur compte",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ disabled: !this.state.disabled, loading: false });
        } else {
            this.setState({
                error_list: res.data.validate_error,
            });
        }
        console.log(res.data.success);
    };

    //GET A SEACHED NUMBER
    handleAccount = async (e) => {
        e.preventDefault();
        this.setState({ loading2: true });
        const getData = await axios.get(
            "compte/search/" + this.state.compteToSearch
        );
        if (getData.data.success == 1) {
            this.setState({
                loading2: false,
                fetchData: getData.data.data[0],
                soldeCDF: getData.data.soldeMembreCDF[0].soldeMembreCDF,
                soldeUSD: getData.data.soldeMembreUSD[0].soldeMembreUSD,
                fetchDataCapRetard: getData.data.dataRetardRemboursementMembre,
            });
            this.setState({
                disabled: !this.state.disabled,
                // refCompte: this.state.fetchData.refCompte
                refCompte: this.state.compteToSearch,
                numCompte: this.state.fetchData.numCompte,
                operant: this.state.fetchData.intituleCompte,
            });
            console.log(this.state.numCompte);
            //disabled valider button
            document
                .getElementById("validerbtn")
                .removeAttribute("disabled", "disabled");
        } else if (getData.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: getData.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading2: false });
        }

        // console.log(this.state.fetchData);
    };
    //getBilletageInDB

    getBilletage = async () => {
        const getBilletag = await axios.get("billetage/getbilletage");
        this.setState({
            getAllBilletage: getBilletag.data.data,
            getBilletageUSD: getBilletag.data.data2,
            getLastestOperationCDF: getBilletag.data.data3,
            getLastestOperationUSD: getBilletag.data.data4,
            getSommeCDF: getBilletag.data.data5,
            getSommeUSD: getBilletag.data.data6,
        });
        console.log(this.state.getLastestOperationCDF);
    };

    //GET ALL DAYLY APPRO
    getDaylyAppro = async () => {
        const dataAppro = await axios.get("/appro/received");
        this.setState({
            fetchDaylyAproCDF: dataAppro.data.data,
            fetchDaylyAproUSD: dataAppro.data.data2,
        });
        console.log(this.state.fetchDaylyAproCDF);
    };

    //ACCEPT A SPECIIQUE APPRO ITEM CDF

    acceptItemCDF(id) {
        const question = confirm("voulez vous vraiment accepter cette appro?");
        if (question == true) {
            axios.delete("accept/appro/cdf/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Validation",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Validation",
                text: "Validation annulée",
                icon: "info",
                button: "OK!",
            });
        }
    }
    //ACCEPT A SPECIFIC APPRO ITEM USD
    acceptItemUSD(id) {
        const question = confirm("voulez vous vraiment accepter cette appro ?");
        if (question == true) {
            axios.delete("accept/appro/usd/" + id).then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Validation",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Validation",
                text: "Validation annulée",
                icon: "info",
                button: "OK!",
            });
        }
    }
    addNewBtn(e) {
        e.preventDefault();
        this.setState({
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montantDepot: 0,
            devise: "",
            numCompte: "",
            intitule: "",
            vightMille: 0,
            dixMille: 0,
            cinqMille: 0,
            milleFranc: 0,
            cinqCentFr: 0,
            deuxCentFranc: 0,
            centFranc: 0,
            cinquanteFanc: 0,
            telDeposant: "",
            operant: "",
            deposantName: "",
            codeAgence: "20",
            libelle: "DEPOT D'ESPECE",
            error_list: [],
            taux: "2000",
            fetchData: null,
            compteToSearch: "",
            refCompte: "",
            // getAllBilletage: null,
            // getBilletageUSD: null,
            // getLastestOperationCDF: null,
            // getLastestOperationUSD: null,
            // getSommeCDF: null,
            // getSommeUSD: null,
            fetchDaylyAproCDF: null,
            fetchDaylyAproUSD: null,
            soldeCDF: "",
            soldeUSD: "",
        });
        // document
        //     .getElementById("validerbtn")
        //     .removeAttribute("disabled", "disabled");
    }

    printRecu = () => {
        window.location = "recu-depot";
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
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "16px",
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
        let compteur2 = 1;
        let compteur3 = 1;
        let compteur4 = 1;
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
                                                            fontSize: "18px",
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
                                                            fontSize: "18px",
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
                                                {this.state
                                                    .fetchDataCapRetard && (
                                                    <>
                                                        <div className="input-group input-group-sm ">
                                                            <label
                                                                style={{
                                                                    height: "auto",
                                                                    background:
                                                                        "#dcdcdc",
                                                                    border: "4px solid #fff",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "13px",
                                                                    color: "red",
                                                                }}
                                                                className="mt-1 font-weight-bold"
                                                            >
                                                                Cap retard:
                                                                {this.state
                                                                    .fetchDataCapRetard &&
                                                                    this.state
                                                                        .fetchDataCapRetard
                                                                        .CapitalRetard}
                                                            </label>
                                                        </div>
                                                        <div className="input-group input-group-sm ">
                                                            <label
                                                                style={{
                                                                    height: "auto",
                                                                    background:
                                                                        "#dcdcdc",
                                                                    border: "4px solid #fff",
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "13px",
                                                                    color: "red",
                                                                }}
                                                                className="mt-0 font-weight-bold"
                                                            >
                                                                Int. retard:
                                                                {this.state
                                                                    .fetchDataCapRetard &&
                                                                    this.state
                                                                        .fetchDataCapRetard
                                                                        .InteretRetardEchu}
                                                            </label>
                                                        </div>
                                                    </>
                                                )}
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
                                                                            "18px",
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
                                                                    Code A.
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
                                                                            "18px",
                                                                    }}
                                                                    name="codeAgence"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .codeAgence
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
                                                                            "18px",
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
                                                                            "18px",
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
                                                                            "18px",
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
                                                                            "18px",
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
                                                                this.addNewBtn
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

                                    <div
                                        className="row"
                                        style={{
                                            padding: "10px",
                                            border: "2px solid #fff",
                                        }}
                                    >
                                        <div
                                            className="col-md-4"
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                            }}
                                        >
                                            {/* <form
                                                style={{ marginTop: "12px" }}
                                              
                                            > */}
                                            <table>
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            style={labelColor}
                                                        >
                                                            Devise
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <select
                                                            name="devise"
                                                            className={`form-control ${
                                                                this.state
                                                                    .error_list
                                                                    .devise &&
                                                                "is-invalid"
                                                            }`}
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            readOnly
                                                            style={inputColor}
                                                            value={
                                                                this.state
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
                                                            style={labelColor}
                                                        >
                                                            Libellé
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            name="libelle"
                                                            className={`form-control ${
                                                                this.state
                                                                    .error_list
                                                                    .libelle &&
                                                                "is-invalid"
                                                            }`}
                                                            type="text"
                                                            style={inputColor}
                                                            value={
                                                                this.state
                                                                    .libelle
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
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            style={labelColor}
                                                        >
                                                            Nom du déposant
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            type="text"
                                                            style={inputColor}
                                                            name="deposantName"
                                                            value={
                                                                this.state
                                                                    .deposantName
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
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            style={labelColor}
                                                        >
                                                            Tél déposant
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            type="text"
                                                            style={inputColor}
                                                            name="telDeposant"
                                                            value={
                                                                this.state
                                                                    .telDeposant
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
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            style={labelColor}
                                                        >
                                                            Commission
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            name="commission"
                                                            type="text"
                                                            style={inputColor}
                                                            value={
                                                                this.state
                                                                    .commission
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
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            style={labelColor}
                                                        >
                                                            Montant
                                                        </label>{" "}
                                                    </td>
                                                    <div className="input-group input-group-sm ">
                                                        <input
                                                            name="montantDepot"
                                                            className={`form-control ${
                                                                this.state
                                                                    .error_list
                                                                    .montantDepot &&
                                                                "is-invalid"
                                                            }`}
                                                            type="text"
                                                            style={inputColor}
                                                            value={
                                                                this.state
                                                                    .montantDepot
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
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td
                                                        style={{
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {this.state.hundred *
                                                            100 +
                                                            this.state.fitfty *
                                                                50 +
                                                            this.state.twenty *
                                                                20 +
                                                            this.state.ten *
                                                                10 +
                                                            this.state.five *
                                                                5 +
                                                            this.state
                                                                .oneDollar *
                                                                1 ===
                                                            parseInt(
                                                                this.state
                                                                    .montantDepot
                                                            ) ||
                                                        this.state.vightMille *
                                                            20000 +
                                                            this.state
                                                                .dixMille *
                                                                10000 +
                                                            this.state
                                                                .cinqMille *
                                                                5000 +
                                                            this.state
                                                                .milleFranc *
                                                                1000 +
                                                            this.state
                                                                .cinqCentFr *
                                                                500 +
                                                            this.state
                                                                .deuxCentFranc *
                                                                200 +
                                                            this.state
                                                                .centFranc *
                                                                100 +
                                                            this.state
                                                                .cinquanteFanc *
                                                                50 ===
                                                            parseInt(
                                                                this.state
                                                                    .montantDepot
                                                            ) ? (
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
                                                                Valider {""}
                                                                {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                            </button>
                                                        ) : (
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
                                                                disabled
                                                            >
                                                                <i className="fas fa-check"></i>{" "}
                                                                Valider {""}
                                                                {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td
                                                        style={{
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        <button
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                width: "100%",
                                                                height: "30px",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                            className="btn btn-primary"
                                                            id="printBtn"
                                                            onClick={
                                                                this.printRecu
                                                            }
                                                        >
                                                            <i className="fas fa-print"></i>{" "}
                                                            Imprimer {""}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                            {/* </form> */}
                                        </div>

                                        <div className="col-md-5">
                                            <div
                                                className="card-body"
                                                style={{ background: "#fff" }}
                                            >
                                                {this.state.devise === "USD" ? (
                                                    <form
                                                        method="POST"
                                                        style={{
                                                            height: "auto",
                                                        }}
                                                    >
                                                        <table className="tableDepotEspece">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-md-4">
                                                                        Coupures
                                                                    </th>
                                                                    <th className="col-md-4">
                                                                        Nbr
                                                                        Billets
                                                                    </th>
                                                                    <th className="col-md-2">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>100</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="hundred"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .hundred
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .hundred *
                                                                            100}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>50</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="fitfty"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .fitfty
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .fitfty *
                                                                            50}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>20</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="twenty"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .twenty
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .twenty *
                                                                            20}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>10</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="ten"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .ten
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .ten *
                                                                            10}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>5</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="five"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .five
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .five *
                                                                            5}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>1</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="oneDollar"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .oneDollar
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .oneDollar *
                                                                            1}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        padding:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                    <th>
                                                                        {" "}
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .hundred
                                                                        ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fitfty
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .twenty
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .ten
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .five
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .oneDollar
                                                                            )}{" "}
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            fontSize:
                                                                                "25px",
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .hundred *
                                                                            100 +
                                                                            this
                                                                                .state
                                                                                .fitfty *
                                                                                50 +
                                                                            this
                                                                                .state
                                                                                .twenty *
                                                                                20 +
                                                                            this
                                                                                .state
                                                                                .ten *
                                                                                10 +
                                                                            this
                                                                                .state
                                                                                .five *
                                                                                5 +
                                                                            this
                                                                                .state
                                                                                .oneDollar *
                                                                                1}{" "}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                ) : (
                                                    <form
                                                        method="POST"
                                                        style={{
                                                            height: "340px",
                                                        }}
                                                    >
                                                        <table className="tableDepotEspece">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-md-4">
                                                                        Coupures
                                                                    </th>
                                                                    <th className="col-md-4">
                                                                        Nbr
                                                                        Billets
                                                                    </th>
                                                                    <th className="col-md-2">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        20000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="vightMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .vightMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .vightMille *
                                                                            20000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        10000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="dixMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .dixMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .dixMille *
                                                                            10000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        5000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinqMille"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinqMille
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinqMille *
                                                                            5000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>
                                                                        1000
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="milleFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .milleFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .milleFranc *
                                                                            1000}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>500</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinqCentFr"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinqCentFr
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinqCentFr *
                                                                            500}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>200</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="deuxCentFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .deuxCentFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .deuxCentFranc *
                                                                            200}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>100</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="centFranc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .centFranc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .centFranc *
                                                                            100}
                                                                    </td>
                                                                </tr>
                                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                                    <td>50</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            name="cinquanteFanc"
                                                                            style={{
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .cinquanteFanc
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {this
                                                                            .state
                                                                            .cinquanteFanc *
                                                                            50}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        padding:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                    <th>
                                                                        {" "}
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .vightMille
                                                                        ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .dixMille
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinqMille
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .milleFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinqCentFr
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .deuxCentFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .centFranc
                                                                            ) +
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .cinquanteFanc
                                                                            )}{" "}
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            fontSize:
                                                                                "25px",
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {this
                                                                            .state
                                                                            .vightMille *
                                                                            20000 +
                                                                            this
                                                                                .state
                                                                                .dixMille *
                                                                                10000 +
                                                                            this
                                                                                .state
                                                                                .cinqMille *
                                                                                5000 +
                                                                            this
                                                                                .state
                                                                                .milleFranc *
                                                                                1000 +
                                                                            this
                                                                                .state
                                                                                .cinqCentFr *
                                                                                500 +
                                                                            this
                                                                                .state
                                                                                .deuxCentFranc *
                                                                                200 +
                                                                            this
                                                                                .state
                                                                                .centFranc *
                                                                                100 +
                                                                            this
                                                                                .state
                                                                                .cinquanteFanc *
                                                                                50}{" "}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="col-md-3 appro-table-div"
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                            }}
                                        >
                                            {this.state.devise == "USD" ? (
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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
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
                                                            .fetchDaylyAproUSD && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .centDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .centDollars
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .cinquanteDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .cinquanteDollars
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .vightDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .vightDollars
                                                                        ) * 20}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .dixDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .dixDollars
                                                                        ) * 10}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .cinqDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .cinqDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .unDollars
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproUSD
                                                                                .unDollars
                                                                        ) * 5}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td>TOT</td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-success"
                                                                            onClick={() => {
                                                                                this.acceptItemUSD(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .id
                                                                                );
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-check"></i>
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchDaylyAproUSD
                                                                                    .centDollars
                                                                            ) *
                                                                                100 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .cinquanteDollars
                                                                                ) *
                                                                                    50 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .vightDollars
                                                                                ) *
                                                                                    20 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .dixDollars
                                                                                ) *
                                                                                    10 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .cinqDollars
                                                                                ) *
                                                                                    5 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproUSD
                                                                                        .unDollars
                                                                                ) *
                                                                                    1
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            ) : (
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
                                                                Coupure
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                Nombre
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
                                                            .fetchDaylyAproCDF && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        20 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .vightMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .vightMilleFranc
                                                                        ) *
                                                                            20000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        10 000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .dixMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .dixMilleFranc
                                                                        ) *
                                                                            10000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        5000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinqMilleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinqMilleFranc
                                                                        ) *
                                                                            5000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        1000 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .milleFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .milleFranc
                                                                        ) *
                                                                            1000}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        500 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinqCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinqCentFranc
                                                                        ) * 500}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        200 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .deuxCentFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .deuxCentFranc
                                                                        ) * 200}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        100 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .centFranc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .centFranc
                                                                        ) * 100}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        50 X
                                                                    </td>

                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinquanteFanc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchDaylyAproCDF
                                                                                .cinquanteFanc
                                                                        ) * 50}
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        tableBorder,
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        TOT
                                                                    </td>

                                                                    <td
                                                                        style={{
                                                                            tableBorder,
                                                                        }}
                                                                    >
                                                                        <button
                                                                            className="btn btn-success"
                                                                            onClick={() => {
                                                                                this.acceptItemCDF(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .id
                                                                                );
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-check"></i>
                                                                        </button>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "green",
                                                                            color: "#fff",
                                                                            fontSize:
                                                                                "28px",
                                                                            textAlign:
                                                                                "center",
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .fetchDaylyAproCDF
                                                                                    .vightMilleFranc
                                                                            ) *
                                                                                20000 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .dixMilleFranc
                                                                                ) *
                                                                                    10000 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .cinqMilleFranc
                                                                                ) *
                                                                                    5000 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .milleFranc
                                                                                ) *
                                                                                    1000 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .cinqCentFranc
                                                                                ) *
                                                                                    500 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .deuxCentFranc
                                                                                ) *
                                                                                    200 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .centFranc
                                                                                ) *
                                                                                    100 +
                                                                                parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .fetchDaylyAproCDF
                                                                                        .cinquanteFanc
                                                                                ) *
                                                                                    50
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid">
                            <div
                                className="row"
                                style={{ border: "4px solid #dcdcdc" }}
                            >
                                {/* SI L'UTILISATEUR SELECTIONNE LE CDF COMME DEVISE ON LUI AFFICHE CES 5 BILLETAGE RECENTS */}

                                {this.state.devise == "CDF" ? (
                                    <>
                                        <h3 className="text-muted">
                                            Billetage en CDF
                                        </h3>
                                        <div className="col-md-5 billetage-div">
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
                                                        Coupure
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Nombre
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Montant
                                                    </th>
                                                </thead>
                                                {this.state
                                                    .getAllBilletage[0] && (
                                                    <>
                                                        <tr>
                                                            <td className="col-md-1">
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                20 000 x
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .vightMilleFran
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .vightMilleFran
                                                                    ) * 20000
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                10 000 x
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .dixMilleFran
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .dixMilleFran
                                                                    ) * 10000
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                5000 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .cinqMilleFran
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .cinqMilleFran
                                                                    ) * 5000
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                1000 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .milleFran
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .milleFran
                                                                    ) * 1000
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                500 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .cinqCentFran
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .cinqCentFran
                                                                    ) * 500
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                200 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .deuxCentFran
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .deuxCentFran
                                                                    ) * 200
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                100 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .centFran
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .centFran
                                                                    ) * 100
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                50 x
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getAllBilletage[0]
                                                                        .cinquanteFan
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .cinquanteFan
                                                                    ) * 50
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <strong>
                                                                    TOT
                                                                </strong>
                                                            </td>
                                                            <td></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {" "}
                                                                <strong>
                                                                    {" "}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .vightMilleFran
                                                                    ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .dixMilleFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinqMilleFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .milleFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinqCentFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .deuxCentFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .centFran
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinquanteFan
                                                                        )}{" "}
                                                                </strong>{" "}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                    fontSize:
                                                                        "28px",
                                                                    textAlign:
                                                                        "center",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {" "}
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getAllBilletage[0]
                                                                            .vightMilleFran
                                                                    ) *
                                                                        20000 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .dixMilleFran
                                                                        ) *
                                                                            10000 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinqMilleFran
                                                                        ) *
                                                                            5000 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .milleFran
                                                                        ) *
                                                                            1000 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinqCentFran
                                                                        ) *
                                                                            500 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .deuxCentFran
                                                                        ) *
                                                                            200 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .centFran
                                                                        ) *
                                                                            100 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getAllBilletage[0]
                                                                                .cinquanteFan
                                                                        ) *
                                                                            50
                                                                )}{" "}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                            </table>
                                        </div>

                                        {/* SINON SI L'UTILISATEUR SELECTIONNE LE USD COMME DEVISE ON LUI AFFICHE CES 5 BILLETAGE RECENTS */}
                                    </>
                                ) : this.state.devise == "USD" ? (
                                    <>
                                        <h3 className="text-muted">
                                            Billetage en USD
                                        </h3>
                                        <div className="col-md-5 billetage-div">
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
                                                        Coupure
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Nombre
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Montant
                                                    </th>
                                                </thead>
                                                {this.state
                                                    .getBilletageUSD[0] && (
                                                    <>
                                                        <tr>
                                                            <td className="col-md-1">
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                100 x
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .centDollar
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .centDollar
                                                                    ) * 100
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                50 x
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .cinquanteDollar
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .cinquanteDollar
                                                                    ) * 50
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                20 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .vightDollar
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .vightDollar
                                                                    ) * 20
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                10 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .dixDollar
                                                                }
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .dixDollar
                                                                    ) * 10
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                5 x
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .cinqDollar
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .cinqDollar
                                                                    ) * 5
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                {compteur2++}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                1
                                                            </td>

                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {parseInt(
                                                                    this.state
                                                                        .getBilletageUSD[0]
                                                                        .unDollar
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .unDollar
                                                                    ) * 1
                                                                )}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <strong>
                                                                    TOT
                                                                </strong>
                                                            </td>
                                                            <td></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {" "}
                                                                <strong>
                                                                    {" "}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .centDollar
                                                                    ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .cinquanteDollar
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .vightDollar
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .dixDollar
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .cinqDollar
                                                                        ) +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .unDollar
                                                                        )}{" "}
                                                                </strong>{" "}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                    fontSize:
                                                                        "28px",
                                                                    textAlign:
                                                                        "center",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {" "}
                                                                {numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getBilletageUSD[0]
                                                                            .centDollar
                                                                    ) *
                                                                        100 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .cinquanteDollar
                                                                        ) *
                                                                            50 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .vightDollar
                                                                        ) *
                                                                            20 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .dixDollar
                                                                        ) *
                                                                            10 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .cinqDollar
                                                                        ) *
                                                                            5 +
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .getBilletageUSD[0]
                                                                                .unDollar
                                                                        ) *
                                                                            1
                                                                )}{" "}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                            </table>
                                        </div>
                                    </>
                                ) : null}
                                {this.state.devise == "CDF" ? (
                                    <>
                                        <div className="col-md-7 operation-recente-div">
                                            <h3 className="text-muted">
                                                Opérations recentes en CDF
                                            </h3>

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
                                                        numCompte
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Intitulé
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Débit
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Crédit
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Libellé
                                                    </th>
                                                </thead>
                                                {this.state
                                                    .getLastestOperationCDF[0] &&
                                                    this.state.getLastestOperationCDF.map(
                                                        (result, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            compteur3++
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.NumCompte
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.Operant
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                result.Debitfc
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                result.Creditfc
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.Libelle
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                <tfoot>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "2px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                        >
                                                            {" "}
                                                            {this.state
                                                                .getSommeCDF[0] &&
                                                                numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getSommeCDF[0]
                                                                            .sommeDeDebitCDF
                                                                    )
                                                                )}{" "}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                        >
                                                            {this.state
                                                                .getSommeUSD[0] &&
                                                                numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getSommeCDF[0]
                                                                            .sommeDeCreditCDF
                                                                    )
                                                                )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "2px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </>
                                ) : this.state.devise == "USD" ? (
                                    <>
                                        <div className="col-md-7 operation-recente-div">
                                            <h3 className="text-muted">
                                                Opérations recentes en USD
                                            </h3>
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
                                                        numCompte
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Intitulé
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Débit
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Crédit
                                                    </th>
                                                    <th style={tableBorder}>
                                                        Libellé
                                                    </th>
                                                </thead>
                                                {this.state
                                                    .getLastestOperationUSD[0] &&
                                                    this.state.getLastestOperationUSD.map(
                                                        (result, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            compteur4++
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.NumCompte
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.Operant
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                result.Debit$
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                result.Credit$
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            result.Libelle
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                <tfoot>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                        <td
                                                            style={{
                                                                border: "2px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                        >
                                                            {" "}
                                                            {this.state
                                                                .getSommeCDF[0] &&
                                                                numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getSommeUSD[0]
                                                                            .sommeDeDebitUSD
                                                                    )
                                                                )}{" "}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "0px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                        >
                                                            {this.state
                                                                .getSommeUSD[0] &&
                                                                numberFormat(
                                                                    parseInt(
                                                                        this
                                                                            .state
                                                                            .getSommeUSD[0]
                                                                            .sommeDeCreditUSD
                                                                    )
                                                                )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "2px solid #fff",
                                                                fontSize:
                                                                    "16px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        ></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
