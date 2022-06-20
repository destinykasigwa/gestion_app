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
        };

        this.handleAccount = this.handleAccount.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
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
                soldeCDF: getData.data.soldeMembreCDF[0].soldeMembreCDF,
                soldeUSD: getData.data.soldeMembreUSD[0].soldeMembreUSD,
            });
            this.setState({
                disabled: !this.state.disabled,
                refCompte: this.state.fetchData.refCompte,
                numCompte: this.state.fetchData.numCompte,
                operant: this.state.fetchData.intituleCompte,
            });
            console.log(this.state.getMembreSolde);
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
        // console.log(this.state.fetchData);
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
                                            <div className="col-md-4">
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
                                                            }}
                                                            className="form-control mt-1 font-weight-bold"
                                                            value={
                                                                this.state
                                                                    .fetchData &&
                                                                this.state
                                                                    .fetchData
                                                                    .numCompte
                                                            }
                                                        />
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
                                                            }}
                                                            className="form-control mt-1 font-weight-bold"
                                                            value={
                                                                this.state
                                                                    .fetchData &&
                                                                this.state
                                                                    .fetchData
                                                                    .numCompte
                                                            }
                                                        />
                                                    </div>
                                                </form>
                                            </div>

                                            {/* separate */}

                                            <div className="col-md-3">
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
                                                                        Intitulé
                                                                        c.
                                                                    </label>
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        name="intituleCompte"
                                                                        className="form-control mt-1 font-weight-bold"
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
                                                                        className="form-control mt-1 font-weight-bold"
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
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
                                                                        className="form-control mt-1 font-weight-bold"
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
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

                                            <div className="col-md-2">
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
