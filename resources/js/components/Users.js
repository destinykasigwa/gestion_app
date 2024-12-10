import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            loading2: "",
            loading3: "",
            searchedItem: "",
            getSearchedItems: null,
            getSearchedItems2: null,
            // lockUser: false,
            // makeAdmin: false,
            linkUser: false,
            userId: "",
            NumAdherant: "",
            // makeAgentCredit: false,
            // makeCaissier: false,
        };
        this.handleSeach = this.handleSeach.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.Lockuser = this.Lockuser.bind(this);
        this.MakeAdmin = this.MakeAdmin.bind(this);
        this.LinkUser = this.LinkUser.bind(this);
        this.handleSeach2 = this.handleSeach2.bind(this);
        this.MakeAgentCredit = this.MakeAgentCredit.bind(this);
        this.MakeCaissier = this.MakeCaissier.bind(this);
        // this.caissierAccount = this.caissierAccount(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
    }

    //GET DATA FROM INPUT
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
        });
    }

    handleSeach = async (item) => {
        this.setState({ loading2: true });
        const res = await axios.get("users/getUser/" + item);
        if (res.data.success == 1) {
            this.setState({
                getSearchedItems: res.data.data,
            });
            // console.log(this.state.getSearchedItems2);
            this.setState({ loading2: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading2: false });
        }
    };

    handleSeach2 = async (item) => {
        this.setState({ loading3: true });
        const res = await axios.get("users/getmembreinfo/" + item);
        if (res.data.success == 1) {
            this.setState({
                getSearchedItems2: res.data.data2,
            });
            // console.log(this.state.getSearchedItems2);
            this.setState({ loading3: false });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({ loading3: false });
        }
    };

    Lockuser = async (item) => {
        const res = await axios.get("users/lockuser/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({
                lockUser: false,
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

    MakeAdmin = async (item) => {
        const res = await axios.get("users/make-user-admin/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
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

    LinkUser = async (item) => {
        this.setState({ NumAdherant: this.state.compteAbrege });
        const res = await axios.post("users/linkuser", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({
                linkUser: true,
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({
                linkUser: false,
            });
        }
    };

    MakeAgentCredit = async (item) => {
        const res = await axios.get("users/make-agent-credit/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({
                makeAgentCredit: true,
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({
                makeAgentCredit: false,
            });
        }
    };

    MakeCaissier = async (item) => {
        const res = await axios.get("users/make-caissier/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({
                makeCaissier: true,
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({
                makeCaissier: false,
            });
        }
    };

    caissierAccount = async (item) => {
        const res = await axios.get("users/creat-caissier-account/" + item);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            this.setState({
                makeCaissier: true,
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            this.setState({
                makeCaissier: false,
            });
        }
    };
    //to refresh
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
                                    <div className="row">
                                        <div className="col-md-6">
                                            <table className="mt-2">
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            ref={this.textInput}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Rechercher..."
                                                            name="searchedItem"
                                                            value={
                                                                this.state
                                                                    .searchedItem
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => {
                                                                this.handleSeach(
                                                                    this.state
                                                                        .searchedItem
                                                                );
                                                            }}
                                                        >
                                                            <i
                                                                className={`${
                                                                    this.state
                                                                        .loading2
                                                                        ? "spinner-border spinner-border-sm"
                                                                        : "fas fa-search"
                                                                }`}
                                                            ></i>
                                                            Rechercher
                                                        </button>
                                                    </td>{" "}
                                                </tr>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <table className="mt-2">
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                borderRadius:
                                                                    "0px",
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            ref={this.textInput}
                                                            className="form-control font-weight-bold"
                                                            placeholder="Compte Abregé"
                                                            name="NumAdherant"
                                                            value={
                                                                this.state
                                                                    .NumAdherant
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => {
                                                                this.handleSeach2(
                                                                    this.state
                                                                        .NumAdherant
                                                                );
                                                            }}
                                                        >
                                                            <i
                                                                className={`${
                                                                    this.state
                                                                        .loading3
                                                                        ? "spinner-border spinner-border-sm"
                                                                        : "fas fa-search"
                                                                }`}
                                                            ></i>
                                                            Rechercher
                                                        </button>
                                                    </td>{" "}
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    {this.state.searchedItem && (
                                        <>
                                            <div
                                                className="row"
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <div className="col-md-8">
                                                    {this.state
                                                        .getSearchedItems && (
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-md-1">
                                                                        refId
                                                                    </th>
                                                                    <th className="col-md-2">
                                                                        UserName
                                                                    </th>

                                                                    <th>
                                                                        Action
                                                                    </th>
                                                                    <th>
                                                                        Action
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.getSearchedItems.map(
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
                                                                                <td>
                                                                                    {
                                                                                        res.id
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.name
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    <div
                                                                                        class="btn-group"
                                                                                        role="group"
                                                                                        aria-label="Exemple"
                                                                                    >
                                                                                        <button
                                                                                            class="btn btn-danger"
                                                                                            onClick={() => {
                                                                                                this.Lockuser(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {res.locked ==
                                                                                            1
                                                                                                ? "Débloqué"
                                                                                                : "Bloquer"}
                                                                                        </button>

                                                                                        <button
                                                                                            class="btn btn-success"
                                                                                            onClick={() => {
                                                                                                this.MakeAdmin(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {res.Role ==
                                                                                            1
                                                                                                ? "Admin"
                                                                                                : "Rendre  Admin"}
                                                                                        </button>

                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.MakeCaissier(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-primary"
                                                                                        >
                                                                                            {res.caissier ==
                                                                                            1
                                                                                                ? "Caissier"
                                                                                                : "rendre caissier"}
                                                                                        </button>

                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.MakeAgentCredit(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-info"
                                                                                        >
                                                                                            {res.agentCredit ==
                                                                                            1
                                                                                                ? "Agent crédit "
                                                                                                : "Rendre A.C"}
                                                                                        </button>
                                                                                    </div>
                                                                                </td>

                                                                                <td>
                                                                                    {res.compteCaissier ==
                                                                                    1 ? (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.caissierAccount(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-success"
                                                                                        >
                                                                                            <i className="fas fa-check"></i>{" "}
                                                                                            Compte
                                                                                            caissier
                                                                                            crée
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                this.caissierAccount(
                                                                                                    res.id
                                                                                                );
                                                                                            }}
                                                                                            class="btn btn-info"
                                                                                        >
                                                                                            Créer
                                                                                            compte
                                                                                            caisse
                                                                                        </button>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>

                                                <div
                                                    className="col-md-4"
                                                    style={{
                                                        overflowY: "scroll",
                                                        height: "200px",
                                                    }}
                                                >
                                                    {this.state
                                                        .getSearchedItems2 && (
                                                        <table
                                                            className="table table-light"
                                                            style={{
                                                                border: "1px solid",
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    <th
                                                                        className="col-md-3"
                                                                        style={{
                                                                            border: "1px solid",
                                                                        }}
                                                                    >
                                                                        Compte
                                                                        Abregé
                                                                    </th>
                                                                    <th
                                                                        className="col-md-3"
                                                                        style={{
                                                                            border: "1px solid",
                                                                        }}
                                                                    >
                                                                        Intitulé
                                                                        de
                                                                        compte
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            border: "1px solid",
                                                                        }}
                                                                    ></th>
                                                                    <th
                                                                        style={{
                                                                            border: "1px solid",
                                                                        }}
                                                                    >
                                                                        Action
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.getSearchedItems2.map(
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
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        res.compteAbrege
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        res.intituleCompte
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid",
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        style={{
                                                                                            borderRadius:
                                                                                                "0px",
                                                                                            boxShadow:
                                                                                                "inset 0 0 5px 5px #888",
                                                                                            fontSize:
                                                                                                "18px",
                                                                                            marginTop:
                                                                                                "5px",
                                                                                        }}
                                                                                        type="text"
                                                                                        name="userId"
                                                                                        value={
                                                                                            this
                                                                                                .state
                                                                                                .userId
                                                                                        }
                                                                                        onChange={
                                                                                            this
                                                                                                .handleChange
                                                                                        }
                                                                                    />
                                                                                </td>
                                                                                <div>
                                                                                    <div
                                                                                        class="btn-group"
                                                                                        role="group"
                                                                                        aria-label="Exemple"
                                                                                    >
                                                                                        {!this
                                                                                            .state
                                                                                            .linkUser ? (
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    this.LinkUser(
                                                                                                        res.id
                                                                                                    );
                                                                                                }}
                                                                                                class="btn btn-primary"
                                                                                            >
                                                                                                Link
                                                                                            </button>
                                                                                        ) : (
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    this.LinkUser(
                                                                                                        res.id
                                                                                                    );
                                                                                                }}
                                                                                                class="btn btn-primary"
                                                                                            >
                                                                                                Linked
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
