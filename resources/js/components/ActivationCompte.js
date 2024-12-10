import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import ActivateCompteM from "./Modals/ActivateCompteM";

export default class ActivationCompte extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            devise: "",
            fetchActivatedCompte: [],
        };
        this.getActivatedCompte = this.getActivatedCompte.bind(this);
    }
    componentDidMount() {
        this.getActivatedCompte();
    }

    getActivatedCompte = async (e) => {
        e.preventDefault();
        const getData = await axios.get(
            "membre/compteactive/" + this.props.refCompte
        );
        if (getData.data.success == 1) {
            this.setState({ fetchActivatedCompte: getData.data.data });
        }
        //console.log(this.state.fetchActivatedCompte);
    };

    render() {
        var labelColor = {
            fontWeight: "bold",
            color: "steelblue",
            padding: "3px",
            fontSize: "14px",
        };
        var inputColor = {
            height: "25px",
            border: "1px solid steelblue",
            padding: "3px",
            borderRadius: "0px",
        };
        // var inputColor2 = {
        //     height: "25px",
        //     border: "1px solid white",
        //     padding: "3px",
        //     width: "60px",
        // };
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "13px",
        };
        let compteur = 1;
        return (
            <div className="col-lg-6">
                <div className="card card-default">
                    <div
                        className="card-header"
                        style={{
                            background: "#DCDCDC",
                            textAlign: "center",
                            color: "#fff",
                        }}
                    >
                        {/* <h3 className="card-title">
            <b>Personnes liés</b>
            </h3> */}
                    </div>

                    <div
                        className="card-body h-200"
                        style={{
                            background: "#dcdcdc",
                        }}
                    >
                        <form method="POST">
                            <table>
                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="compteE"
                                            style={labelColor}
                                        >
                                            Compte d'Epargne
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            id="compteE"
                                            style={inputColor}
                                            name="activationCompte"
                                            value={this.state.activationCompte}
                                            disabled={
                                                this.state.disabled
                                                    ? "disabled"
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    devise: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>

                                            <option value="CDF">
                                                Compte en CDF
                                            </option>
                                            <option value="USD">
                                                Compte en USD
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            style={{
                                                borderRadius: "0px",
                                                width: "100%",
                                                height: "25px",
                                                fontSize: "12px",
                                            }}
                                            className="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#modal-activation-compte"
                                        >
                                            Créer{" "}
                                            <i className="fas fa-check"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            style={{
                                                borderRadius: "0px",
                                                width: "100%",
                                                height: "25px",
                                                fontSize: "12px",
                                            }}
                                            className="btn btn-success"
                                            onClick={this.getActivatedCompte}
                                        >
                                            {" "}
                                            <i className="fas fa-refresh"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                        <div className="col-md-12">
                            <table
                                className="table table-dark"
                                style={tableBorder}
                            >
                                <thead>
                                    <tr>
                                        <th style={tableBorder}>#</th>
                                        <th style={tableBorder}>Num compte</th>
                                        <th style={tableBorder}>Nom compte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.fetchActivatedCompte.length !=
                                        0 &&
                                        this.state.fetchActivatedCompte.map(
                                            (result, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={tableBorder}>
                                                            {compteur++}
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {result.NumCompte}
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {result.NomCompte}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                </tbody>
                            </table>
                            <ActivateCompteM
                                refCompt={this.props.refCompte}
                                devise={this.state.devise}
                                idComptM={this.props.idCompteMembre}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
