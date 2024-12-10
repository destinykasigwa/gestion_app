import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Crediteur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            fetchData: null,
            solde: "0,00",
            NomCompte: "",
            NumCompte: "",
            montantCredit: "",
            compteToSearch: "",
            CodeMonnaie: "",
            refCompte: "",
            Operant: "",
            Libelle: "",
        };
        this.textInput = React.createRef();
        this.handleAccount = this.handleAccount.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveOperation = this.saveOperation.bind(this);
        this.addNewBtn = this.addNewBtn.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
    }
    //put focus on given input
    focusTextInput() {
        this.textInput.current.focus();
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
    //GET A SEACHED NUMBER
    handleAccount = async (e) => {
        e.preventDefault();
        const getData = await axios.get(
            "/compte/credit/search/" + this.state.compteToSearch
        );
        if (getData.data.success == 1) {
            this.setState({
                fetchData: getData.data.data,
                solde: getData.data.solde,
            });
            this.setState({
                disabled: !this.state.disabled,
                NumCompte: this.state.fetchData.NumCompte,
                Operant: this.state.fetchData.NomCompte,
                NomCompte: this.state.fetchData.NomCompte,
                refCompte: this.state.fetchData.NumAdherant,
                CodeMonnaie: this.state.fetchData.CodeMonnaie,
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
        // console.log(this.state.fetchData);
    };
    saveOperation = async (e) => {
        e.preventDefault();
        const res = await axios.post("/crediteur/save/data", this.state);
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
            solde: "0,00",
            NomCompte: "",
            montantCredit: "",
            compteToSearch: "",
            CodeMonnaie: "",
            refCompte: "",
            Operant: "",
            Libelle: "",
            NumCompte: "",
        });

        setTimeout(() => {
            this.textInput.current.focus();
        }, 10);
        document
            .getElementById("savebtn")
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
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
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
                                            <div className="col-md-7">
                                                <div
                                                    className="row"
                                                    style={{
                                                        padding: "10px",
                                                        border: "2px solid #fff",
                                                    }}
                                                >
                                                    <div className="col-md-4">
                                                        <form>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                    }}
                                                                    className="form-control font-weight-bold"
                                                                    placeholder="Compte à créditer"
                                                                    name="compteToSearch"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .compteToSearch
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    ref={
                                                                        this
                                                                            .textInput
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
                                                                                .handleAccount
                                                                        }
                                                                    >
                                                                        <i className="fas fa-search"></i>
                                                                    </button>
                                                                </td>
                                                            </div>
                                                            {/* <table>
                                                                <tr> */}
                                                            {/* <td>
                                                                        {" "}
                                                                        <label
                                                                            style={
                                                                                labelColor
                                                                            }
                                                                        >
                                                                            Montant
                                                                        </label>{" "}
                                                                    </td> */}
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                    }}
                                                                    placeholder="Montant"
                                                                    name="montantCredit"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .montantCredit
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                    }}
                                                                    placeholder="Description"
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
                                                            {/* </tr>
                                                            </table> */}

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

                                                    <div className="col-md-4">
                                                        <form>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    style={{
                                                                        height: "35px",
                                                                        background:
                                                                            "#dcdcdc",
                                                                        border: "4px solid #fff",
                                                                    }}
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    name="NomCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .NomCompte
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="input-group input-group-sm ">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    style={{
                                                                        height: "35px",
                                                                        background:
                                                                            "#dcdcdc",
                                                                        border: "4px solid #fff",
                                                                    }}
                                                                    className="form-control mt-1 font-weight-bold"
                                                                    name="NumCompte"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .NumCompte
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div
                                                            className="card-body"
                                                            style={{
                                                                background:
                                                                    "#dcdcdc",
                                                            }}
                                                        >
                                                            <form
                                                                style={{
                                                                    padding:
                                                                        "10px",
                                                                    border: "2px solid #fff",
                                                                    marginTop:
                                                                        "-15px",
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
                                                                                Solde
                                                                            </label>{" "}
                                                                        </td>
                                                                        <div className="input-group input-group-sm ">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control mt-1 font-weight-bold"
                                                                                style={{
                                                                                    borderRadius:
                                                                                        "0px",
                                                                                }}
                                                                                name="solde"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .solde &&
                                                                                    numberFormat(
                                                                                        parseInt(
                                                                                            this
                                                                                                .state
                                                                                                .solde
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
                                            </div>

                                            {/* separate */}

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
