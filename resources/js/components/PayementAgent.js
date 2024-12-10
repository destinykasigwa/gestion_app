import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PayementAgentFunction from "./PayementAgentFunction";

export default class PayementAgent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            fetchData: "",
            MoisAPayer: "",
            MoisAAfficher: "Janvier",
            DeviseAAfficher: "CDF",
            AnneeAAfficher: "2022",
            getPayementAgentData: "",
            NomNewAgent: "",
            NumCompteNewAgent: "",

            // Montant: [],
            // Compte: [],
        };

        this.actualiser = this.actualiser.bind(this);
        this.getAgent = this.getAgent.bind(this);
        // this.saveOperation = this.saveOperation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDate = this.handleSubmitDate.bind(this);
        this.handleGetPayement = this.handleGetPayement.bind(this);
        this.handleNewAgent = this.handleNewAgent.bind(this);
    }
    //STEND FOR REFRESHING PAGE
    actualiser() {
        location.reload();
    }

    //get data in input
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
        }, 1000);
        this.getAgent();
    }

    getAgent = async () => {
        const res = await axios.get("/agent/data/all");
        if (res.data.success == 1) {
            this.setState({
                fetchData: res.data.data,
                Compte: res.data.data.NumCompte,
            });
        }
    };

    handleSubmitDate = async (e) => {
        e.preventDefault();

        const res = await axios.post(
            "/payement/agent/moispayement/save",
            this.state
        );
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

    handleGetPayement = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("/payement/agent/getpayement", this.state);
        if (res.data.success == 1) {
            this.setState({
                getPayementAgentData: res.data.dataPayement,
                loading: false,
            });
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

    handleNewAgent = async (e) => {
        e.preventDefault();
        const res = await axios.post("/payement/agent/addnewAgent", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "succès",
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
            height: "31px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
            boxShadow: "inset 0 0 5px 5px #888",
            fontSize: "15px",
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
                                        <div className="row">
                                            <div className="col-md-7">
                                                <table
                                                    style={{ border: "0px" }}
                                                >
                                                    <tr>
                                                        <td
                                                            style={{
                                                                border: "0px",
                                                            }}
                                                        >
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Mois à payer
                                                            </label>{" "}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "0px",
                                                            }}
                                                        >
                                                            <div className="input-group input-group-sm ">
                                                                <select
                                                                    name="MoisAPayer"
                                                                    className="form-control"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .MoisAPayer
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Veuillez
                                                                        sélectionnez
                                                                        le mois
                                                                    </option>
                                                                    <option value="Janvier">
                                                                        Janvier
                                                                    </option>
                                                                    <option value="Février">
                                                                        Février
                                                                    </option>
                                                                    <option value="Mars">
                                                                        Mars
                                                                    </option>
                                                                    <option value="Avril">
                                                                        Avril
                                                                    </option>
                                                                    <option value="Mai">
                                                                        Mai
                                                                    </option>
                                                                    <option value="Juin">
                                                                        Juin
                                                                    </option>
                                                                    <option value="Juillet">
                                                                        Juillet
                                                                    </option>
                                                                    <option value="Août">
                                                                        Août
                                                                    </option>
                                                                    <option value="Séptembre">
                                                                        Séptembre
                                                                    </option>
                                                                    <option value="Octobre">
                                                                        Octobre
                                                                    </option>
                                                                    <option value="Novembre">
                                                                        Novembre
                                                                    </option>
                                                                    <option value="Décembre">
                                                                        Décembre
                                                                    </option>
                                                                </select>{" "}
                                                            </div>
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "0px",
                                                            }}
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
                                                                id="savebtn"
                                                                className="btn btn-primary mt-1"
                                                                onClick={
                                                                    this
                                                                        .handleSubmitDate
                                                                }
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <div
                                                    style={{
                                                        overflowY: "scroll",
                                                        height: "250px",
                                                        overflowX: "hidden",
                                                        margin: "5px",
                                                    }}
                                                >
                                                    <table className="tableDepot-payement-agent">
                                                        <thead>
                                                            <tr>
                                                                <th className="col-md-4">
                                                                    Compte USD
                                                                </th>
                                                                <th className="col-md-4">
                                                                    Compte CDF
                                                                </th>
                                                                <th className="col-md-4">
                                                                    Nom agent
                                                                </th>
                                                                {/* <th className="col-md-4">
                                                                Montant
                                                            </th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state
                                                                .fetchData &&
                                                                this.state.fetchData.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    index
                                                                                }
                                                                                ng-repeat="name in getdrugnameNewArray"
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        res.NumCompte
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.NumcompteUSD
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.NomAgent
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                        </tbody>
                                                        {/* <tfoot>
                                                        <tr>
                                                            <th>Total</th>
                                                            <th></th>
                                                            <th>500</th>
                                                        </tr>
                                                    </tfoot> */}
                                                    </table>
                                                </div>
                                                {/* <table>
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
                                                                Enregistrer{" "}
                                                                <i className="fas fa-save"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table> */}
                                            </div>
                                            <PayementAgentFunction
                                                MoisAPayer={
                                                    this.state.MoisAPayer
                                                }
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3>
                                                            Paiements effectués
                                                        </h3>
                                                    </div>
                                                    <div
                                                        style={{
                                                            margin: "5px",
                                                        }}
                                                    >
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        style={{
                                                                            color: "steelblue",
                                                                            fontweight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        Dévise
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        style={{
                                                                            width: "100px",
                                                                            height: "auto",
                                                                            border: "1px solid steelblue",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "18px",
                                                                        }}
                                                                        name="DeviseAAfficher"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .DeviseAAfficher
                                                                        }
                                                                    >
                                                                        <option value="CDF">
                                                                            CDF
                                                                        </option>
                                                                        <option value="USD">
                                                                            USD
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        style={{
                                                                            color: "steelblue",
                                                                            fontweight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        Mois
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <select
                                                                        name="MoisAAfficher"
                                                                        className="form-control"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .MoisAAfficher
                                                                        }
                                                                    >
                                                                        {/* <option value="">
                                                                            Veuillez
                                                                            sélectionnez
                                                                            le
                                                                            mois
                                                                        </option> */}
                                                                        <option value="Janvier">
                                                                            Janvier
                                                                        </option>
                                                                        <option value="Février">
                                                                            Février
                                                                        </option>
                                                                        <option value="Mars">
                                                                            Mars
                                                                        </option>
                                                                        <option value="Avril">
                                                                            Avril
                                                                        </option>
                                                                        <option value="Mai">
                                                                            Mai
                                                                        </option>
                                                                        <option value="Juin">
                                                                            Juin
                                                                        </option>
                                                                        <option value="Juillet">
                                                                            Juillet
                                                                        </option>
                                                                        <option value="Août">
                                                                            Août
                                                                        </option>
                                                                        <option value="Séptembre">
                                                                            Séptembre
                                                                        </option>
                                                                        <option value="Octobre">
                                                                            Octobre
                                                                        </option>
                                                                        <option value="Novembre">
                                                                            Novembre
                                                                        </option>
                                                                        <option value="Décembre">
                                                                            Décembre
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        style={{
                                                                            color: "steelblue",
                                                                            fontweight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        Année
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        style={{
                                                                            width: "80px",
                                                                            height: "auto",
                                                                            border: "1px solid steelblue",
                                                                            boxShadow:
                                                                                "inset 0 0 5px 5px #888",
                                                                            fontSize:
                                                                                "18px",
                                                                        }}
                                                                        name="AnneeAAfficher"
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .AnneeAAfficher
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td>
                                                                    {!this.state
                                                                        .loading ? (
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            onClick={
                                                                                this
                                                                                    .handleGetPayement
                                                                            }
                                                                        >
                                                                            Afficher
                                                                        </button>
                                                                    ) : (
                                                                        <button class="btn btn-primary">
                                                                            <span class="spinner-border spinner-border-sm"></span>
                                                                            Chargement
                                                                            ...
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div
                                                            style={{
                                                                overflowY:
                                                                    "scroll",
                                                                height: "250px",
                                                            }}
                                                        >
                                                            {this.state
                                                                .getPayementAgentData && (
                                                                <table class="table">
                                                                    <thead className="thead-dark">
                                                                        <tr>
                                                                            <th>
                                                                                #
                                                                            </th>
                                                                            <th>
                                                                                Compte
                                                                            </th>
                                                                            <th>
                                                                                Intitulé
                                                                            </th>
                                                                            <th>
                                                                                Montant
                                                                            </th>
                                                                            <th>
                                                                                Mois
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {this.state.getPayementAgentData.map(
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
                                                                                        <th>
                                                                                            {
                                                                                                compteur++
                                                                                            }
                                                                                        </th>
                                                                                        <th>
                                                                                            {
                                                                                                res.NumCompte
                                                                                            }
                                                                                        </th>
                                                                                        <th>
                                                                                            {
                                                                                                res.NomAgent
                                                                                            }
                                                                                        </th>
                                                                                        <th>
                                                                                            {
                                                                                                res.Montant
                                                                                            }
                                                                                        </th>
                                                                                        <th>
                                                                                            {
                                                                                                res.MoisPay
                                                                                            }
                                                                                        </th>
                                                                                    </tr>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3>Nouveau agent</h3>
                                                    </div>
                                                    <div
                                                        style={{
                                                            margin: "5px",
                                                        }}
                                                    >
                                                        <form>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <label
                                                                            htmlFor="compteNum"
                                                                            style={{
                                                                                color: "steelblue",
                                                                                fontweight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            Numéro
                                                                            de
                                                                            compte
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            style={{
                                                                                width: "150px",
                                                                                height: "30",
                                                                                border: "1px solid steelblue",
                                                                                margin: "2px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "18px",
                                                                            }}
                                                                            id="compteNum"
                                                                            name="NumCompteNewAgent"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NumCompteNewAgent
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label
                                                                            htmlFor="nomCompte"
                                                                            style={{
                                                                                color: "steelblue",
                                                                                fontweight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            Nom
                                                                            Agent
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            style={{
                                                                                width: "200px",
                                                                                height: "30",
                                                                                border: "1px solid steelblue",
                                                                                margin: "2px",
                                                                                boxShadow:
                                                                                    "inset 0 0 5px 5px #888",
                                                                                fontSize:
                                                                                    "18px",
                                                                                textTransform:
                                                                                    "uppercase",
                                                                            }}
                                                                            id="nomCompte"
                                                                            name="NomNewAgent"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .NomNewAgent
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            style={{
                                                                                borderRadius:
                                                                                    "0px",
                                                                            }}
                                                                            onClick={
                                                                                this
                                                                                    .handleNewAgent
                                                                            }
                                                                        >
                                                                            Enregistrer
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
                )}
            </React.Fragment>
        );
    }
}
