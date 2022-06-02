import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class UpdateEcheancier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            Decision: "",
            Motivation: "",
            DateOctroi: "",
            DateEcheance: "",
            DateTombeEcheance: "",
            Interval: "",
            MontantAccorde: "",
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
        let UpDateEcheancier = {
            Decision: "",
            Motivation: "",
            DateOctroi: "",
            DateEcheance: "",
            DateTombeEcheance: "",
            Interval: "",
            MontantAccorde: "",
        };
        //updating data from input
        if (
            current_state.Decision &&
            current_state.Decision !== props.creditData.Decision
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
            current_state.DateOctroi &&
            current_state.DateOctroi !== props.creditData.DateOctroi
        ) {
            return null;
        }

        if (
            current_state.DateEcheance &&
            current_state.DateEcheance !== props.creditData.DateEcheance
        ) {
            return null;
        }

        if (
            current_state.Interval &&
            current_state.Interval !== props.creditData.Interval
        ) {
            return null;
        }
        if (
            current_state.DateTombeEcheance &&
            current_state.DateTombeEcheance !==
                props.creditData.DateTombeEcheance
        ) {
            return null;
        }
        if (
            current_state.MontantAccorde &&
            current_state.MontantAccorde !== props.creditData.MontantAccorde
        ) {
            return null;
        }

        //updating data from props below
        if (
            current_state.Decision !== props.creditData.Decision ||
            current_state.Decision === props.creditData.Decision
        ) {
            UpDateEcheancier.Decision = props.creditData.Decision;
        }

        if (
            current_state.Motivation !== props.creditData.Motivation ||
            current_state.Motivation === props.creditData.Motivation
        ) {
            UpDateEcheancier.Motivation = props.creditData.Motivation;
        }
        if (
            current_state.DateOctroi !== props.creditData.DateOctroi ||
            current_state.DateOctroi === props.creditData.DateOctroi
        ) {
            UpDateEcheancier.DateOctroi = props.creditData.DateOctroi;
        }
        if (
            current_state.DateEcheance !== props.creditData.DateEcheance ||
            current_state.DateEcheance === props.creditData.DateEcheance
        ) {
            UpDateEcheancier.DateEcheance = props.creditData.DateEcheance;
        }

        if (
            current_state.DateTombeEcheance !==
                props.creditData.DateTombeEcheance ||
            current_state.DateTombeEcheance ===
                props.creditData.DateTombeEcheance
        ) {
            UpDateEcheancier.DateTombeEcheance =
                props.creditData.DateTombeEcheance;
        }

        if (
            current_state.Interval !== props.creditData.Interval ||
            current_state.Interval === props.creditData.Interval
        ) {
            UpDateEcheancier.Interval = props.creditData.Interval;
        }

        if (
            current_state.MontantAccorde !== props.creditData.MontantAccorde ||
            current_state.MontantAccorde === props.creditData.MontantAccorde
        ) {
            UpDateEcheancier.MontantAccorde = props.creditData.MontantAccorde;
        }

        return UpDateEcheancier;
    }

    handleMainUpdate = async (e) => {
        e.preventDefault();
        this.setState({ numDossier: this.props.numDossier });
        const res = await axios.post(
            "/montage/credit/update/echeancier",
            this.state
        );
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
                <div className="modal fade" id="modal-update-echeancier">
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
                                                                                    .Decision ??
                                                                                ""
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="Motivation"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .Motivation ??
                                                                                ""
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
                                                                                    .DateOctroi ??
                                                                                ""
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
                                                                                    .DateEcheance ??
                                                                                ""
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
                                                                        Tombé
                                                                        d'Echce
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
                                                                                    .DateTombeEcheance ??
                                                                                ""
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
                                                                                    .Interval ??
                                                                                ""
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
                                                                            }}
                                                                            className="form-control font-weight-bold"
                                                                            name="MontantAccorde"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .MontantAccorde ??
                                                                                ""
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
                                                                        id="saveGarantieBtn"
                                                                        className="btn btn-primary mt-1"
                                                                        onClick={
                                                                            this
                                                                                .handleSaveEcheancier
                                                                        }
                                                                    >
                                                                        Degressif
                                                                        <i className="fas fa-database"></i>
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
