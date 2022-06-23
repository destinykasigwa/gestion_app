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
            fetchData: null,
            MoisAPayer: "",

            // Montant: [],
            // Compte: [],
        };

        this.actualiser = this.actualiser.bind(this);
        this.getAgent = this.getAgent.bind(this);
        // this.saveOperation = this.saveOperation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDate = this.handleSubmitDate.bind(this);
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
                                                <table className="tableDepot-payement-agent">
                                                    <thead>
                                                        <tr>
                                                            <th className="col-md-4">
                                                                Compte CDF
                                                            </th>
                                                            <th className="col-md-4">
                                                                Compte USD
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
                                                        {this.state.fetchData
                                                            .length != 0 &&
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
