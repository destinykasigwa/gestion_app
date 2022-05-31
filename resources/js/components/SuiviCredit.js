import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class SuiviCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            Decision: "Accepté",
            Motivation: "Client crédible",
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
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
        let inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
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
                                                                    .handleAccount
                                                            }
                                                        >
                                                            <i className="fas fa-search"></i>
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
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Numéro compte Epargne..."
                                                        name="NumCompteEpargne"
                                                        value={
                                                            this.state
                                                                .fetchData &&
                                                            this.state.fetchData
                                                                .NumCompteEpargne
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                    />
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="Num Cpte Crédit"
                                                        name="NumCompteCredit"
                                                        readOnly
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .fetchData &&
                                                            this.state.fetchData
                                                                .NumCompteCredit
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
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="N° Dossier..."
                                                        name="NumDossier"
                                                        value={
                                                            this.state
                                                                .NumDossier
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                    />
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        placeholder="N° Demande"
                                                        name="NumDemande"
                                                        readOnly
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
                                                        value={
                                                            this.state
                                                                .fetchData &&
                                                            this.state.fetchData
                                                                .NumDemande
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
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckDefault"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        for="flexSwitchCheckDefault"
                                                    >
                                                        Accordé
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckChecked"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexSwitchCheckChecked"
                                                    >
                                                        Octroyé
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckDisabled"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        for="flexSwitchCheckDisabled"
                                                    >
                                                        Réechelonner
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckCheckedDisabled"
                                                    />
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
                                                                id="saveMainBtn"
                                                                className="btn btn-primary "
                                                                onClick={
                                                                    this
                                                                        .handleMainSave
                                                                }
                                                            >
                                                                Valider
                                                                <i className="fas fa-check"></i>
                                                            </button>
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
                                                                id="updateMainBtn"
                                                                className="btn btn-success"
                                                                onClick={
                                                                    this
                                                                        .handleMainUpdate
                                                                }
                                                            >
                                                                Modifier
                                                                <i className="fas fa-check"></i>
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
                                                                    Produit de
                                                                    crédit
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
                                                                    Type Crédit
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
                                                                    Recouvreur
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
                                                                    Objet
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
                                                                    Gestionnaire
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
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="montantDemande"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .montantDemande
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
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        className="form-control font-weight-bold"
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
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="CapitalDu"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .CapitalDu
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
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="InteretRestant"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .InteretRestant
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
                                                                        }}
                                                                        className="form-control font-weight-bold"
                                                                        name="TotCumule"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .TotCumule
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
                                                                        <input
                                                                            type="text"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="FrequenceRembours"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .FrequenceRembours
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Interval"
                                                                            value={
                                                                                this
                                                                                    .state
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Grace"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Grace
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Duree"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .TauxInteretRetard
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="PeriodiciteDecalage"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .PeriodiciteDecalage
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="NomUtilisateur"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NomUtilisateur
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
                                                                        Code
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
                                                    </ul>
                                                    <div
                                                        className="tab-content"
                                                        id="myTabContent"
                                                    >
                                                        <div
                                                            className="tab-pane fade show active mt-2 col-md-12 "
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
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
                                                                                                    garantie
                                                                                                </label>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="input-group input-group-sm ">
                                                                                                    <select
                                                                                                        style={{
                                                                                                            borderRadius:
                                                                                                                "0px",
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="DescriptionGarantie"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
                                                                                                                .DescriptionGarantie
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
                                                                                                        id="saveGarantieBtn"
                                                                                                        className="btn btn-primary"
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleSaveGarantie
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-check"></i>
                                                                                                    </button>
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
                                                                                                        id="updateGarantieBtn"
                                                                                                        className="btn btn-success mt-1"
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleEditGarantie
                                                                                                        }
                                                                                                    >
                                                                                                        Modifier
                                                                                                        <i className="fas fa-pen"></i>
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
                                                                                                                }}
                                                                                                                className="form-control font-weight-bold"
                                                                                                                name="Decision"
                                                                                                                value={
                                                                                                                    this
                                                                                                                        .state
                                                                                                                        .Decision
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    this
                                                                                                                        .handleChange
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="Accepeté">
                                                                                                                    Accepeté
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
                                                                                                                }}
                                                                                                                className="form-control font-weight-bold"
                                                                                                                name="Motivation"
                                                                                                                value={
                                                                                                                    this
                                                                                                                        .state
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
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateOctroi"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
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
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateEcheance"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
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
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="DateTombeEcheance"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
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
                                                                                                                    }}
                                                                                                                    className="form-control font-weight-bold"
                                                                                                                    name="Interval"
                                                                                                                    value={
                                                                                                                        this
                                                                                                                            .state
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
                                                                                                </table>
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
                                                                                                                id="saveGarantieBtn"
                                                                                                                className="btn btn-primary"
                                                                                                                onClick={
                                                                                                                    this
                                                                                                                        .handleSaveGarantie
                                                                                                                }
                                                                                                            >
                                                                                                                Valider
                                                                                                                <i className="fas fa-check"></i>
                                                                                                            </button>
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
                                                                                                                id="updateGarantieBtn"
                                                                                                                className="btn btn-success"
                                                                                                                onClick={
                                                                                                                    this
                                                                                                                        .handleEditGarantie
                                                                                                                }
                                                                                                            >
                                                                                                                Modifier
                                                                                                                <i className="fas fa-pen"></i>
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
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
                                                                                                        id="saveGarantieBtn"
                                                                                                        className="btn btn-primary "
                                                                                                        onClick={
                                                                                                            this
                                                                                                                .handleSaveCapitalRembourser
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-check"></i>
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
                                                                                                        name="NumCompteCredit"
                                                                                                        value={
                                                                                                            this
                                                                                                                .state
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
                                                                                                        }}
                                                                                                        className="form-control font-weight-bold"
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
                                                                                                                .handleSaveCapitalRembourser
                                                                                                        }
                                                                                                    >
                                                                                                        Valider
                                                                                                        <i className="fas fa-check"></i>
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
                                                                                                    <input
                                                                                                        className="form-check-input"
                                                                                                        type="checkbox"
                                                                                                        id="cloturer"
                                                                                                    />
                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        for="cloturer"
                                                                                                    >
                                                                                                        Cloturer
                                                                                                    </label>
                                                                                                </div>
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
                    </div>
                )}
            </React.Fragment>
        );
    }
}
