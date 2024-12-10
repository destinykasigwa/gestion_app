import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateMendataire from "./Modals/UpdateMendataire";
import DeleteMendataire from "./Modals/DeleteMendataire";

// import EditMembre from './EditMembre';

export default class Mendataire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            idMendataire: "",
            mendataireName: "",
            lieuNaissM: "",
            dateNaissM: "",
            etatCivileM: "",
            sexeM: "",
            typePieceM: "",
            professionM: "",
            telephoneM: "",
            adresseM: "",
            observationM: "",
            photoM: "",
            fetchData: [],
            refCompte: "",
            error_list: [],
            itemToDropId: "",
            itemToDropName: "",
        };
        this.textInput = React.createRef();
        this.getData = this.getData.bind(this);
        this.addNewMendataire = this.addNewMendataire.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveNewMendataire = this.saveNewMendataire.bind(this);
        this.getMendataireDetails = this.getMendataireDetails.bind(this);
        //    this.deleteMendatair=this.deleteMendatair.bind();
    }

    componentDidMount() {
        setTimeout(() => {
            document
                .getElementById("validerMbtn")
                .setAttribute("disabled", "disabled");
            // document.getElementById("addMbtn").setAttribute("disabled","disabled");
        }, 1000);
    }
    //put focus on given input
    focusTextInput() {
        this.textInput.current.focus();
    }

    //   componentDidUpdate(){
    //     this.getData();
    //   }

    //get data in input
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically

            [event.target.name]: event.target.value,
        });
    }

    getData = async () => {
        if (this.props.num) {
            try {
                const data = await axios.get(
                    "/mendataire/getmendataire/data/" + this.props.num
                );
                if (data.data) {
                    this.setState({ fetchData: data.data.data });
                    // console.log(this.state.fetchData.data[0].name)
                    setTimeout(() => {
                        document
                            .getElementById("addMbtn")
                            .removeAttribute("disabled");
                    }, 10);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            Swal.fire({
                title: "Erreur",
                text: "Ooops Aucun numéro de compte recherché!",
                icon: "error",
                button: "OK!",
            });
        }
    };
    addNewMendataire = async (event) => {
        event.preventDefault();
        //initialise les champs

        this.setState({
            disabled: !this.state.disabled,
            refCompte: this.props.refCompt,
        });
        this.setState({ disabled: !this.state.disabled });
        setTimeout(() => {
            this.textInput.current.focus();
            document.getElementById("validerMbtn").removeAttribute("disabled");
            document.getElementById("addMbtn").setAttribute("disabled");
        }, 10);

        this.setState({
            mendataireName: "",
            lieuNaissM: "",
            dateNaissM: "",
            etatCivileM: "",
            sexeM: "",
            typePieceM: "",
            professionM: "",
            telephoneM: "",
            adresseM: "",
            observationM: "",
        });
    };

    saveNewMendataire = async (event) => {
        event.preventDefault();
        //Insert le nouveau membre
        const res = await axios.post("/mendataire/save/data", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            setTimeout(() => {
                document.getElementById("addMbtn").removeAttribute("disabled");
            }, 10);
            console.log(this.state);
            this.setState({ disabled: !this.state.disabled });
        } else {
            this.setState({
                error_list: res.data.validate_error,
            });
        }
        console.log(this.state);
    };

    //getting individual mendataire details

    getMendataireDetails = (id) => {
        axios
            .post("/get/getindividual/mendataire/details", {
                mendataireId: id,
            })
            .then((response) => {
                this.setState({
                    idMendataire: response.data.id,
                    mendataireName: response.data.mendataireName,
                    lieuNaissM: response.data.lieuNaissM,
                    dateNaissM: response.data.dateNaissM,
                    etatCivileM: response.data.etatCivileM,
                    sexeM: response.data.sexeM,
                    typePieceM: response.data.typePieceM,
                    professionM: response.data.professionM,
                    telephoneM: response.data.telephoneM,
                    adresseM: response.data.adresseM,
                    observationM: response.data.observationM,
                });
                console.log(response.data);
            });
    };

    deleteMendatair(num) {
        this.setState({ itemToDropId: num });
        console.log(this.state.itemToDropId);
    }

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
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "10px",
        };
        let compteur = 1;
        return (
            <>
                <div
                    className="row"
                    style={{
                        padding: "10px",
                        border: "2px solid #fff",
                    }}
                >
                    <div className="col-lg-12">
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
                                <b>Mendataire</b>
                                 </h3> */}
                            </div>

                            <div
                                className="card-body h-200"
                                style={{
                                    background: "#dcdcdc",
                                }}
                            >
                                <div className="col-md-12">
                                    <form method="POST">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                htmlFor="nommendataire"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Nom mdtr
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className={`form-control ${
                                                                    this.state
                                                                        .error_list
                                                                        .mendataireName &&
                                                                    "is-invalid"
                                                                }`}
                                                                id="nommendataire"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="mendataireName"
                                                                value={
                                                                    this.state
                                                                        .mendataireName
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                ref={
                                                                    this
                                                                        .textInput
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieuNaiss"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Né(e) à
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className={`form-control ${
                                                                    this.state
                                                                        .error_list
                                                                        .lieuNaissM &&
                                                                    "is-invalid"
                                                                }`}
                                                                id="lieuNaiss"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="lieuNaissM"
                                                                value={
                                                                    this.state
                                                                        .lieuNaissM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="dateNaiss"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Date Naissance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className={`form-control ${
                                                                    this.state
                                                                        .error_list
                                                                        .dateNaissM &&
                                                                    "is-invalid"
                                                                }`}
                                                                id="dateNaiss"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="dateNaissM"
                                                                value={
                                                                    this.state
                                                                        .dateNaissM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="etatCivile"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Etat civile
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="etatCivile"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="etatCivileM"
                                                                value={
                                                                    this.state
                                                                        .etatCivileM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Marié(e)">
                                                                    Marié(e)
                                                                </option>
                                                                <option value="Célibétaire">
                                                                    Célibétaire
                                                                </option>
                                                                <option value="Veuf(ve)">
                                                                    Veuf(ve)
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="sexe"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Sexe
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="sexe"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="sexeM"
                                                                value={
                                                                    this.state
                                                                        .sexeM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="M">
                                                                    M
                                                                </option>
                                                                <option value="F">
                                                                    F
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="typePiece"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                {" "}
                                                                Type pièce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="typePiece"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="typePieceM"
                                                                value={
                                                                    this.state
                                                                        .typePieceM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Carte d'électeur">
                                                                    Carte
                                                                    d'électeur
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="profession"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Profession
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="profession"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="professionM"
                                                                value={
                                                                    this.state
                                                                        .professionM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Commerçant">
                                                                    Commerçant
                                                                </option>
                                                                <option value="Enseignant">
                                                                    Enseignant
                                                                </option>
                                                                <option value="Humanitaire">
                                                                    Humanitaire
                                                                </option>
                                                                <option value="Eleve ou Etudiant">
                                                                    Eleve ou
                                                                    Etudiant
                                                                </option>
                                                                <option value="Autre">
                                                                    Autre
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="telephone"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Téléphone
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="telephone"
                                                                style={
                                                                    inputColor
                                                                }
                                                                name="telephoneM"
                                                                value={
                                                                    this.state
                                                                        .telephoneM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="adressemend"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Adresse
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="adressemend"
                                                                style={{
                                                                    height: "40px",
                                                                    border: "1px solid steelblue",
                                                                    padding:
                                                                        "3px",
                                                                }}
                                                                name="adresseM"
                                                                value={
                                                                    this.state
                                                                        .adresseM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="observation"
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Observation
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="mt-1"
                                                                id="observation"
                                                                style={{
                                                                    height: "40px",
                                                                    border: "1px solid steelblue",
                                                                    padding:
                                                                        "3px",
                                                                }}
                                                                name="observationM"
                                                                value={
                                                                    this.state
                                                                        .observationM
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>

                                            <div className="col-md-2">
                                                <table
                                                    style={{
                                                        border: "3px solid #fff",
                                                        padding: "5px",
                                                    }}
                                                    className="table-img"
                                                >
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <img
                                                                src={`uploads/membres/${
                                                                    this.props
                                                                        .membreImage
                                                                        ? this
                                                                              .props
                                                                              .membreImage
                                                                        : "default.jpg"
                                                                }`}
                                                                alt="image-du-membre"
                                                                className="img-thumbnail"
                                                            />
                                                        </td>
                                                    </tr>
                                                </table>
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
                                                                className="btn btn-success"
                                                                onClick={
                                                                    this.getData
                                                                }
                                                            >
                                                                Actualiser{" "}
                                                                <i class="fas fa-sync"></i>
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
                                                                className="btn btn-primary mt-1"
                                                                id="addMbtn"
                                                                onClick={
                                                                    this
                                                                        .addNewMendataire
                                                                }
                                                            >
                                                                Ajouter{" "}
                                                                <i className="fas fa-database"></i>
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
                                                                className="btn btn-primary mt-1"
                                                                id="validerMbtn"
                                                                onClick={
                                                                    this
                                                                        .saveNewMendataire
                                                                }
                                                            >
                                                                Valider{" "}
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="container-fluid">
                                    <div className="col-md-12">
                                        {this.state.fetchData.length != 0 && (
                                            <table
                                                className="table table-dark"
                                                style={tableBorder}
                                            >
                                                <thead>
                                                    <tr>
                                                        <td style={tableBorder}>
                                                            #
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Nom
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Lieu Naissance
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Date Naissance
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Etat c.
                                                        </td>
                                                        <td style={tableBorder}>
                                                            sexe
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Type p.
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Profession
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Téléphone
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Adresse
                                                        </td>
                                                        <td style={tableBorder}>
                                                            Action
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.fetchData.map(
                                                        (res, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        {
                                                                            compteur++
                                                                        }{" "}
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.intituleCompte
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.lieuNaissM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.dateNaissM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.etatCivileM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.sexeM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.typePieceM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.professionM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.telephoneM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        {
                                                                            res.adresseM
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={
                                                                            tableBorder
                                                                        }
                                                                    >
                                                                        <div
                                                                            class="btn-group"
                                                                            role="group"
                                                                            aria-label="Basic example"
                                                                        >
                                                                            <button
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                }}
                                                                                type="button"
                                                                                className="btn btn-primary"
                                                                                data-toggle="modal"
                                                                                data-target="#modal-mendataire"
                                                                                onClick={() => {
                                                                                    this.getMendataireDetails(
                                                                                        res.id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Modifier{" "}
                                                                                <i className="fas fa-edit"></i>{" "}
                                                                            </button>
                                                                            <button
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                }}
                                                                                type="button"
                                                                                className="btn btn-danger"
                                                                                data-toggle="modal"
                                                                                data-target="#modal-delete-mendataire"
                                                                                onClick={() => {
                                                                                    this.deleteMendatair(
                                                                                        res.id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Supprimer{" "}
                                                                                <i className="fas fa-trash"></i>{" "}
                                                                            </button>
                                                                            {/* <button type="button" class="btn btn-success" onClick={this.getData} data-toggle="modal" data-target="#modal-delete-mendataire" > <i class="fas fa-sync"></i></button> */}
                                                                        </div>
                                                                    </td>
                                                                    <UpdateMendataire
                                                                        modalId={
                                                                            this
                                                                                .state
                                                                                .idMendataire
                                                                        }
                                                                        mendatData={
                                                                            this
                                                                                .state
                                                                        }
                                                                    />

                                                                    <DeleteMendataire
                                                                        modalId={
                                                                            this
                                                                                .state
                                                                                .itemToDropId
                                                                        }
                                                                    />
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
                    </div>
                </div>
            </>
        );
    }
}
