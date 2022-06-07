import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default class RepertoireCaisse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            isloading: true,
            loading: false,
            dateToSearch1: "",
            dateToSearch2: "",
            fetchData: null,
            fetchDataUSD: null,
            fetTotUSD: null,
            fetchTot: null,
            userName: "",
            AgenceName: "",
        };
        this.actualiser = this.actualiser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showReport = this.showReport.bind(this);
        this.PrintFunction = this.PrintFunction.bind(this);
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

    showReport = async (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        const res = await axios.post("rapport/repertoire/caisse", this.state);
        if (res.data.success == 1) {
            this.setState({
                fetchData: res.data.data,
                fetchDataUSD: res.data.dataUSD,
                fetchTot: res.data.totCDF,
                fetTotUSD: res.data.totUSD,
                loading: false,
            });
            console.log(this.state.fetchData);
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Info",
                text: res.data.msg,
                icon: "info",
                button: "OK!",
            });
            this.setState({ loading: false });
        } else {
            Swal.fire({
                title: "erreur",
                text: "Quelque chose s'est mal passée",
                icon: "error",
                button: "OK!",
            });
        }

        console.log(this.state);
    };

    //STEND FOR REFRESHING PAGE
    actualiser() {
        location.reload();
    }

    //PRINT REPERTOIRE FUNCTION
    PrintFunction(e) {
        e.preventDefault();
        const printableElements = document.getElementById("printme").innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
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
            color: "#fff",
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
        let compteur = 1;

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
        const agence = ["allAgence"];
        const users = ["allUsers"];
        const repertoire = [
            "billetage",
            "Opérations_en_suspens",
            "Repertoire_de_caisse",
        ];

        //PERMET DE FORMATER LES DATES
        const dateParser = (num) => {
            const options = {
                // weekday: "long",
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
                                    {/* HEADER REPERTOIRE */}
                                    <div
                                        className="row"
                                        style={{
                                            padding: "10px",
                                            border: "2px solid #fff",
                                        }}
                                    >
                                        <div className="col-sm-3">
                                            <div
                                                className="position-relative p-3 bg-gray"
                                                style={{ height: "135" }}
                                            >
                                                <div className="ribbon-wrapper">
                                                    <div className="ribbon bg-primary">
                                                        PERIODE
                                                    </div>
                                                </div>
                                                Période <br />
                                                {/* <small>
                                                    .ribbon-wrapper.ribbon-lg
                                                    .ribbon
                                                </small> */}
                                                <form>
                                                    <table>
                                                        <tr style={tableBorder}>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Date Début
                                                                </label>
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <input
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    type="date"
                                                                    name="dateToSearch1"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .dateToSearch1
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr style={tableBorder}>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <label
                                                                    style={
                                                                        labelColor
                                                                    }
                                                                >
                                                                    Date Fin
                                                                </label>
                                                            </td>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <input
                                                                    style={
                                                                        inputColor
                                                                    }
                                                                    type="date"
                                                                    name="dateToSearch2"
                                                                    onChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .dateToSearch2
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="col-sm-2">
                                            <div
                                                className="position-relative p-3 bg-gray"
                                                style={{ height: "135" }}
                                            >
                                                <div className="ribbon-wrapper">
                                                    <div className="ribbon bg-primary">
                                                        AGENCE
                                                    </div>
                                                </div>
                                                Agence <br />
                                                {/* <small>
                                                    .ribbon-wrapper.ribbon-lg
                                                    .ribbon
                                                </small> */}
                                                <form>
                                                    <table
                                                        style={{
                                                            border: "0px",
                                                        }}
                                                    >
                                                        {agence.map(
                                                            (item, index) => (
                                                                <div
                                                                    class="form-check"
                                                                    key={index}
                                                                >
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="allAgence"
                                                                        id={`allAgence${item}`}
                                                                        value={
                                                                            item
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`allAgence${item}`}
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Toutes
                                                                        les
                                                                        Agences
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}

                                                        <div class="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="agence"
                                                                id="agencefromRadio"
                                                                value="option1"
                                                                checked
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="agencefromRadio"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Agence de
                                                            </label>
                                                            <select
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="AgenceName"
                                                                value={
                                                                    this.state
                                                                        .agenceName
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="GOMA">
                                                                    GOMA
                                                                </option>
                                                                <option value="BUKAVU">
                                                                    BUKAVU
                                                                </option>
                                                                <option value="KINDU">
                                                                    KINDU
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="col-sm-2">
                                            <div
                                                className="position-relative p-3 bg-gray"
                                                style={{ height: "135" }}
                                            >
                                                <div className="ribbon-wrapper">
                                                    <div className="ribbon bg-primary">
                                                        Utilisateur
                                                    </div>
                                                </div>
                                                Utilisateur <br />
                                                {/* <small>
                                                    .ribbon-wrapper.ribbon-lg
                                                    .ribbon
                                                </small> */}
                                                <form>
                                                    <table
                                                        style={{
                                                            border: "0px",
                                                        }}
                                                    >
                                                        {users.map(
                                                            (item, index) => (
                                                                <div
                                                                    class="form-check"
                                                                    key={index}
                                                                >
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="allUsers"
                                                                        id={`UtilisateurRadio${item}`}
                                                                        value={
                                                                            item
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`UtilisateurRadio${item}`}
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Toutes
                                                                        les
                                                                        utlisateurs
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                        <div class="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="utilisateurs"
                                                                id={`userRadio`}
                                                                value="option1"
                                                                checked
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="userRadio"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Utilisateur
                                                            </label>
                                                            <select
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="userName"
                                                                value={
                                                                    this.state
                                                                        .userName
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="DESTIN">
                                                                    DESTIN
                                                                </option>
                                                                <option value="AUTRE">
                                                                    AUTRE
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div
                                                className="position-relative p-3 bg-gray"
                                                style={{ height: "135" }}
                                            >
                                                <div className="ribbon-wrapper">
                                                    <div className="ribbon bg-primary">
                                                        TYPE REPERTOIRE
                                                    </div>
                                                </div>
                                                Type de repertoire <br />
                                                {/* <small>
                                                    .ribbon-wrapper.ribbon-lg
                                                    .ribbon
                                                </small> */}
                                                <form>
                                                    <table
                                                        style={{
                                                            border: "0px",
                                                        }}
                                                    >
                                                        {repertoire.map(
                                                            (item, index) => (
                                                                <div
                                                                    class="form-check"
                                                                    key={index}
                                                                >
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="repertoire"
                                                                        id={`repertoireCaisseRadio${item}`}
                                                                        value={
                                                                            item
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        checked
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`repertoireCaisseRadio${item}`}
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="col-sm-2">
                                            <div
                                                className="position-relative p-3 bg-gray"
                                                style={{ height: "135" }}
                                            >
                                                <div className="ribbon-wrapper">
                                                    <div className="ribbon bg-primary">
                                                        ACTION
                                                    </div>
                                                </div>
                                                Action <br />
                                                <form>
                                                    <table
                                                        style={{
                                                            border: "0px",
                                                        }}
                                                    >
                                                        <tr style={tableBorder}>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <button
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        width: "100%",
                                                                        height: "30px",
                                                                        fontSize:
                                                                            "10px",
                                                                        marginTop:
                                                                            "12px",
                                                                    }}
                                                                    className="btn btn-primary"
                                                                    id="validerbtn"
                                                                    onClick={
                                                                        this
                                                                            .showReport
                                                                    }
                                                                >
                                                                    <i
                                                                        className={`${
                                                                            this
                                                                                .state
                                                                                .loading
                                                                                ? "spinner-border spinner-border-sm"
                                                                                : "fas fa-desktop"
                                                                        }`}
                                                                    ></i>
                                                                    Afficher
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr style={tableBorder}>
                                                            <td
                                                                style={
                                                                    tableBorder
                                                                }
                                                            >
                                                                <button
                                                                    style={{
                                                                        borderRadius:
                                                                            "0px",
                                                                        width: "100%",
                                                                        height: "30px",
                                                                        fontSize:
                                                                            "10px",
                                                                        marginTop:
                                                                            "12px",
                                                                    }}
                                                                    className="btn btn-primary"
                                                                    id="validerbtn"
                                                                    onClick={
                                                                        this
                                                                            .PrintFunction
                                                                    }
                                                                >
                                                                    <i className="fas fa-print"></i>
                                                                    Imprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    {/* END HEADER REPERTOIRE */}
                                    {/* BODY REPERTOIRE DISPLAYING REPORT container */}
                                    {this.state.fetchData && (
                                        <div
                                            className="row"
                                            style={{
                                                padding: "10px",
                                                border: "2px solid #fff",
                                            }}
                                            id="printme"
                                        >
                                            <div
                                                style={{
                                                    margin: "0 auto",
                                                    width: "77%",
                                                    background: "#fff",
                                                    padding: "10px",
                                                }}
                                            >
                                                {" "}
                                                <br />
                                                <br />
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <h4>
                                                        <b>
                                                            ACTION POUR LA PAIX
                                                            L'EDUCATION ET LE
                                                            DEFENSE DES DROITS
                                                            HUMAINS
                                                        </b>
                                                    </h4>
                                                </div>
                                                <table
                                                    id="table"
                                                    class="table"
                                                    align="center"
                                                >
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <img
                                                                style={{
                                                                    width: "30%",
                                                                    height: "90px",
                                                                }}
                                                                src="uploads/membres/default.jpg"
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "0px",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                <h3>
                                                                    «A.P.E.D.H»
                                                                </h3>
                                                                <p>
                                                                    Goma RDC{" "}
                                                                    <br />
                                                                    Téléphone:
                                                                    +243971926713{" "}
                                                                    <br />
                                                                    Courriel:
                                                                    info@apedh-assoc.org{" "}
                                                                    <br />
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td align="right">
                                                            <div
                                                                style={{
                                                                    marginLeft:
                                                                        "0px",
                                                                }}
                                                            >
                                                                <h4>
                                                                    <b>
                                                                        <img
                                                                            style={{
                                                                                width: "30%",
                                                                                height: " 90px",
                                                                            }}
                                                                            src="uploads/membres/default.jpg"
                                                                        />
                                                                    </b>
                                                                </h4>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <div
                                                    style={{
                                                        textAlign: "center ",
                                                    }}
                                                >
                                                    <h4
                                                        className="font-weight-bold"
                                                        style={{
                                                            borderBottom:
                                                                "4px solid green",
                                                        }}
                                                    >
                                                        <b>
                                                            REPERTOIRE CAISSE DU{" "}
                                                            {dateParser(
                                                                this.state
                                                                    .dateToSearch1
                                                            )}{" "}
                                                            AU{" "}
                                                            {dateParser(
                                                                this.state
                                                                    .dateToSearch2
                                                            )}
                                                        </b>
                                                    </h4>
                                                </div>
                                                <h3 className="text-left font-weight-bold">
                                                    CAISSIER(E) DESTINY
                                                </h3>
                                                <h5 className="text-left font-weight-bold ">
                                                    Operation en CDF
                                                </h5>
                                                <table
                                                    className="tableStyle"
                                                    style={{
                                                        background: "#444",
                                                        padding: "5px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <thead
                                                        style={{
                                                            background:
                                                                "rgb(20,40,100)",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        <tr>
                                                            <td scope="col">
                                                                refOP
                                                            </td>
                                                            <td scope="col">
                                                                NCompte
                                                            </td>
                                                            <td scope="col">
                                                                NomCompte
                                                            </td>
                                                            <td scope="col">
                                                                Initiateur
                                                            </td>
                                                            <td scope="col">
                                                                Libellé
                                                            </td>
                                                            <td scope="col">
                                                                Entrée
                                                            </td>
                                                            <td scope="col">
                                                                Sortie
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.fetchData.map(
                                                            (res, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {
                                                                                res.NumTrans
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumCompt
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NomCompt
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.Initiateur
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.Description
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.CreditFC
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.debitFC
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>

                                                    <tfoot>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "25px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                Total CDF
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "23px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                {this.state
                                                                    .fetchTot &&
                                                                    numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchTot
                                                                                .totCredit
                                                                        )
                                                                    )}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "23px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                {this.state
                                                                    .fetchTot &&
                                                                    numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetchTot
                                                                                .totDebit
                                                                        )
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                                <h5 className="text-left font-weight-bold ">
                                                    Operation en USD
                                                </h5>
                                                <table
                                                    className="tableStyle"
                                                    style={{
                                                        background: "#444",
                                                        padding: "5px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <tbody>
                                                        {this.state.fetchDataUSD.map(
                                                            (res, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {
                                                                                res.NumTrans
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumCompt
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NomCompt
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.Initiateur
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.Description
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.CreditUSD
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {numberFormat(
                                                                                parseInt(
                                                                                    res.debitUSD
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>

                                                    <tfoot>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "25px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                Total USD
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "23px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                {this.state
                                                                    .fetTotUSD &&
                                                                    numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetTotUSD
                                                                                .totCreditUSD
                                                                        )
                                                                    )}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    fontSize:
                                                                        "23px",
                                                                    background:
                                                                        "green",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                {this.state
                                                                    .fetTotUSD &&
                                                                    numberFormat(
                                                                        parseInt(
                                                                            this
                                                                                .state
                                                                                .fetTotUSD
                                                                                .totDebitUSD
                                                                        )
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    {/*END BODY REPERTOIRE DISPLAYING REPORT container */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
