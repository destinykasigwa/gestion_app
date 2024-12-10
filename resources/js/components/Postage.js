import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Postage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            isloading: true,
            loading: false,
            showDateContainer: false,
            dateWork: null,
            Taux: "",
            usd: 1,
            todayDate: new Date(),
            isClosing: false,
        };
        this.clotureBtn = this.clotureBtn.bind(this);
        this.definirDate = this.definirDate.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.OpenDayBtn = this.OpenDayBtn.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
    }

    //PERMET DE POSTER
    clotureBtn = async (e) => {
        this.setState({ isClosing: true });
        e.preventDefault();
        const res = await axios.get("/cloture/journee");
        if (res.data.success == 1) {
            this.setState({
                disabled: true,
                isClosing: false,
                showDateContainer: true,
            });
            Swal.fire({
                title: "Clôture de la journée",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        }
    };

    OpenDayBtn = async (e) => {
        e.preventDefault();
        const res = await axios.post("/postage/openday/data", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("OpendayBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };
    //DEFINI LA DATE DU SYSTEME
    definirDate = async (e) => {
        e.preventDefault();
        const res = await axios.post("/datesystem/definir", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    //STEND FOR REFRESHING PAGE
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
        const dateParser = (num) => {
            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            };

            let timestamp = Date.parse(num);

            let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

            return date.toString();
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
                                        <div className="col-lg-6">
                                            <div className="card card-default">
                                                <div
                                                    className="card-header"
                                                    style={{
                                                        background: "#dcdcdc",
                                                        textAlign: "center",
                                                        color: "#000",
                                                    }}
                                                >
                                                    <h3 className="card-title">
                                                        <b>
                                                            CLOTURE DE LA
                                                            JOURNEE
                                                        </b>
                                                    </h3>
                                                    <button
                                                        style={{
                                                            height: "30px",
                                                            float: "right",
                                                            marginLeft: "20px",
                                                            background: "green",
                                                            border: "0px",
                                                            padding: "3px",
                                                        }}
                                                        onClick={() =>
                                                            this.setState({
                                                                showDateContainer: true,
                                                            })
                                                        }
                                                    >
                                                        Date{" "}
                                                        <i class="fas fa-calendar"></i>{" "}
                                                    </button>
                                                    <button
                                                        style={{
                                                            height: "30px",
                                                            float: "right",
                                                            marginLeft: "20px",
                                                            background: "green",
                                                            border: "0px",
                                                            padding: "3px",
                                                        }}
                                                        onClick={
                                                            this.actualiser
                                                        }
                                                    >
                                                        <i class="fas fa-sync"></i>{" "}
                                                        Actualiser{" "}
                                                    </button>
                                                </div>

                                                <div
                                                    className="card-body h-200"
                                                    style={{
                                                        background: "#dcdcdc",
                                                    }}
                                                >
                                                    <form>
                                                        {/* <div class="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        25%
                      </div>
                    </div> */}
                                                        {this.state
                                                            .isClosing && (
                                                            <div
                                                                id="clotureLoading"
                                                                style={{
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                    padding:
                                                                        "2px",
                                                                    margin: "0px auto",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div>
                                                                    <h5>
                                                                        Veuillez
                                                                        patienter
                                                                        pendant
                                                                        que
                                                                        ECONOMISONS
                                                                        passe
                                                                        les
                                                                        écritures
                                                                        de
                                                                        remboursement...
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    {this.state
                                                                        .disabled ? (
                                                                        <button
                                                                            style={{
                                                                                padding:
                                                                                    "6px",
                                                                                color: "#fff",
                                                                                fontWeight:
                                                                                    "bold",
                                                                                background:
                                                                                    "steelblue",
                                                                                border: "0px",
                                                                                height: "40px",
                                                                            }}
                                                                            type="text"
                                                                            id="btnClose"
                                                                            className="btn disabled"
                                                                        >
                                                                            <i className="fas fa-check"></i>{" "}
                                                                            Clôturer
                                                                            la
                                                                            journée
                                                                            {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            style={{
                                                                                padding:
                                                                                    "6px",
                                                                                color: "#fff",
                                                                                fontWeight:
                                                                                    "bold",
                                                                                background:
                                                                                    "steelblue",
                                                                                border: "0px",
                                                                                height: "40px",
                                                                            }}
                                                                            type="text"
                                                                            id="btnClose"
                                                                            className="btn "
                                                                            onClick={
                                                                                this
                                                                                    .clotureBtn
                                                                            }
                                                                        >
                                                                            <i className="fas fa-check"></i>{" "}
                                                                            Clôturer
                                                                            la
                                                                            journée
                                                                            {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <button
                                                                        style={{
                                                                            padding:
                                                                                "6px",
                                                                            color: "#fff",
                                                                            fontWeight:
                                                                                "bold",

                                                                            border: "0px",
                                                                            height: "40px",
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                        type="text"
                                                                        id="OpendayBtn"
                                                                        className="btn btn-success"
                                                                        onClick={
                                                                            this
                                                                                .OpenDayBtn
                                                                        }
                                                                    >
                                                                        <i className="fas fa-check"></i>{" "}
                                                                        Ouvrir
                                                                        la
                                                                        journée
                                                                        {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.showDateContainer && (
                                            <div className="col-lg-6">
                                                <div className="card card-default">
                                                    <div
                                                        className="card-header"
                                                        style={{
                                                            background:
                                                                "#dcdcdc",
                                                            textAlign: "center",
                                                            color: "#000",
                                                        }}
                                                    >
                                                        <h3 className="card-title">
                                                            <b>
                                                                OUVETURE JOURNEE
                                                                PROCHAINE DATE N
                                                                + 1
                                                            </b>
                                                        </h3>
                                                    </div>

                                                    <div
                                                        className="card-body h-200"
                                                        style={{
                                                            background:
                                                                "#dcdcdc",
                                                        }}
                                                    >
                                                        <form>
                                                            <table>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                            color: "steelblue",
                                                                        }}
                                                                    >
                                                                        Taux
                                                                        (Facultatif)
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <input
                                                                            style={{
                                                                                height: "33px",
                                                                                border: "1px solid steelblue",
                                                                            }}
                                                                            type="text"
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                this.setState(
                                                                                    {
                                                                                        Taux: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                            color: "steelblue",
                                                                        }}
                                                                    >
                                                                        Définir
                                                                        la date
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>
                                                                        <input
                                                                            style={{
                                                                                height: "33px",
                                                                                border: "1px solid steelblue",
                                                                            }}
                                                                            type="date"
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                this.setState(
                                                                                    {
                                                                                        dateWork:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>
                                                                        <button
                                                                            style={{
                                                                                height: "33px",
                                                                                border: "1px solid steelblue",
                                                                            }}
                                                                            type="text"
                                                                            id="btnsaveDate"
                                                                            className="btn mt-1"
                                                                            onClick={
                                                                                this
                                                                                    .definirDate
                                                                            }
                                                                        >
                                                                            <i className="fas fa-check"></i>{" "}
                                                                            Valider
                                                                            {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {this.state.showDateContainer && (
                                            <div
                                                className="row col-md-6"
                                                // style={{ margin: "0px auto" }}
                                            >
                                                <table
                                                    className="tableStyle"
                                                    style={{
                                                        background: "#444",
                                                        padding: "5px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                #
                                                            </th>
                                                            <th scope="col">
                                                                Date clôturée
                                                            </th>
                                                            <th scope="col">
                                                                Date Jour
                                                            </th>
                                                            <th scope="col">
                                                                Monnaie
                                                            </th>
                                                            <th scope="col">
                                                                Taux jour
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">
                                                                1
                                                            </th>
                                                            <td>
                                                                {dateParser(
                                                                    this.state
                                                                        .todayDate
                                                                )}
                                                            </td>
                                                            <td>
                                                                {
                                                                    this.state
                                                                        .dateWork
                                                                }
                                                            </td>
                                                            <td>{"USD"}</td>
                                                            <td>
                                                                {this.state.usd}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                2
                                                            </th>
                                                            <td>
                                                                {dateParser(
                                                                    this.state
                                                                        .todayDate
                                                                )}
                                                            </td>
                                                            <td>
                                                                {
                                                                    this.state
                                                                        .dateWork
                                                                }
                                                            </td>
                                                            <td>{"CDF"}</td>
                                                            <td>
                                                                {
                                                                    this.state
                                                                        .Taux
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
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
