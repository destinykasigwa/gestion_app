import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class RetraitEspece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            DateTransaction: "",
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montantRetrait: 0,
            devise: "",
            numCompte: "",
            commission: 0,
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
            commission: 0,
            deposantName: "",
            codeAgence: "20",
            libelle: "RETRAIT D'ESPECE",
            error_list: [],
            taux: "2000",
            fetchData: null,
            compteToSearch: "",
            refCompte: "",
            typeDocument: "",
            getAllBilletage: null,
            getBilletageUSD: null,
            getLastestOperationCDF: null,
            getLastestOperationUSD: null,
            getSommeCDF: null,
            getSommeUSD: null,
            getMembreSoldeCDF: null,
            getMembreSoldeUSD: null,
            getPositionnementData: "",
            numDocument: "",
        };
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.getBilletage = this.getBilletage.bind(this);
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
    }

    saveOperation = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("/retrait/espece", this.state);
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
                title: "Débit sur compte",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({ loading: false });

            this.setState({ disabled: !this.state.disabled, loading: false });
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("printBtn")
                .removeAttribute("disabled", "disabled");
        }

        //   else {
        //       this.setState({
        //           error_list: res.data.validate_error,
        //       });
        //   }
        console.log(res.data.success);
    };

    //GET A SEACHED NUMBER
    handleAccount = async (e) => {
        e.preventDefault();
        const getData = await axios.get(
            "compte/search/numdossier/" + this.state.compteToSearch
        );

        if (getData.data.success == 1) {
            this.setState({
                fetchData: getData.data.data,
                getMembreSoldeCDF: getData.data.soldeMembreCDF,
                getMembreSoldeUSD: getData.data.soldeMembreUSD,
                getPositionnementData: getData.data.datapositionnement,
            });
            this.setState({
                disabled: !this.state.disabled,
                refCompte: this.state.fetchData.NumAdherant,
                numCompte: this.state.fetchData.NumCompte,
                operant: this.state.fetchData.NomCompte,
                montantRetrait: this.state.getPositionnementData.Montant,
                devise: this.state.getPositionnementData.CodeMonnaie,
                numDocument: this.state.getPositionnementData.NumDocument,
            });
            // console.log(this.state.fetchData);
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
        } else {
            console.log(this.state.getMembreSoldeUSD);
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

    printRecu = () => {
        window.location = "recu-retrait";
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
        var tableBorder = {
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
                                                            fontSize: "16px",
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Num document ..."
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
                                                            fontSize: "16px",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state.numCompte
                                                                ? this.state
                                                                      .numCompte
                                                                : this.state
                                                                      .fetchData &&
                                                                  this.state
                                                                      .fetchData
                                                                      .NumCompte
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
                                                                            "16px",
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
                                                                                  .NomCompte
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
                                                                            "16px",
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
                                                                            "16px",
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
                                                                                  .NumCompte
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
                                                                            "16px",
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
                                                                            "16px",
                                                                    }}
                                                                    name="intituleCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .getMembreSoldeUSD &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .getMembreSoldeUSD
                                                                                    .soldeMembreUSD
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
                                                                            "16px",
                                                                    }}
                                                                    name="intituleCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .getMembreSoldeCDF &&
                                                                        numberFormat(
                                                                            parseInt(
                                                                                this
                                                                                    .state
                                                                                    .getMembreSoldeCDF
                                                                                    .soldeMembreCDF
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
                                            <form style={{ marginTop: "12px" }}>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Document
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                name="typeDocument"
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .getPositionnementData &&
                                                                    this.state
                                                                        .getPositionnementData
                                                                        .NumDocument
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
                                                                Devise
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <select
                                                                type="text"
                                                                name="devise"
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .devise
                                                                        ? this
                                                                              .state
                                                                              .devise
                                                                        : this
                                                                              .state
                                                                              .getPositionnementData &&
                                                                          this
                                                                              .state
                                                                              .getPositionnementData
                                                                              .CodeMonnaie
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
                                                                Libellé
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                name="libelle"
                                                                //   className={`form-control ${
                                                                //     this.state
                                                                //         .error_list
                                                                //         .libelle &&
                                                                //     "is-invalid"
                                                                // }`}
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .libelle
                                                                        ? this
                                                                              .state
                                                                              .libelle
                                                                        : this
                                                                              .state
                                                                              .getPositionnementData &&
                                                                          this
                                                                              .state
                                                                              .getPositionnementData
                                                                              .Concerne
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
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Bénéficiaire
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="deposantName"
                                                                value={
                                                                    this.state
                                                                        .getPositionnementData &&
                                                                    this.state
                                                                        .getPositionnementData
                                                                        .Retirant
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
                                                                Tél Bén.
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="telDeposant"
                                                                value={
                                                                    this.state
                                                                        .getPositionnementData &&
                                                                    this.state
                                                                        .getPositionnementData
                                                                        .NumTel
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
                                                                Commission
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                name="commission"
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .commission
                                                                }
                                                                // disabled={
                                                                //     this.state
                                                                //         .disabled
                                                                //         ? "disabled"
                                                                //         : ""
                                                                // }
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
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                name="montantRetrait"
                                                                className={`form-control`}
                                                                type="text"
                                                                style={
                                                                    inputColor
                                                                }
                                                                value={
                                                                    this.state
                                                                        .montantRetrait
                                                                        ? this
                                                                              .state
                                                                              .montantRetrait
                                                                        : this
                                                                              .state
                                                                              .getPositionnementData &&
                                                                          this
                                                                              .state
                                                                              .getPositionnementData
                                                                              .Montant
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
                                        <div className="col-md-6">
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
                                            className="col-md-2 "
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                            }}
                                        >
                                            <tr>
                                                <td style={{ padding: "2px" }}>
                                                    {this.state.hundred * 100 +
                                                        this.state.fitfty * 50 +
                                                        this.state.twenty * 20 +
                                                        this.state.ten * 10 +
                                                        this.state.five * 5 +
                                                        this.state.oneDollar *
                                                            1 ===
                                                        parseInt(
                                                            this.state
                                                                .montantRetrait
                                                        ) ||
                                                    this.state.vightMille *
                                                        20000 +
                                                        this.state.dixMille *
                                                            10000 +
                                                        this.state.cinqMille *
                                                            5000 +
                                                        this.state.milleFranc *
                                                            1000 +
                                                        this.state.cinqCentFr *
                                                            500 +
                                                        this.state
                                                            .deuxCentFranc *
                                                            200 +
                                                        this.state.centFranc *
                                                            100 +
                                                        this.state
                                                            .cinquanteFanc *
                                                            50 ===
                                                        parseInt(
                                                            this.state
                                                                .montantRetrait
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
                                                                    this.state
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
                                                <td style={{ padding: "2px" }}>
                                                    <button
                                                        style={{
                                                            borderRadius: "0px",
                                                            width: "100%",
                                                            height: "30px",
                                                            fontSize: "12px",
                                                        }}
                                                        onClick={this.printRecu}
                                                        className="btn btn-primary"
                                                        id="printBtn"
                                                    >
                                                        <i className="fas fa-print"></i>{" "}
                                                        Imprimer {""}
                                                    </button>
                                                </td>
                                            </tr>
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
