import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UpdatePersonneLie from "./Modals/UpdatePersonneLie";
import DeletePersonneLie from "./Modals/DeletePersonneLie";

export default class PersonneLie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personneLieName: "",
            lieuNaissLie: "",
            dateNaissLie: "",
            degreParante: "",
            fetchData: [],
            refCompte: "",
            error_list: [],
            idToDelete: "",
        };
        this.textInput = React.createRef();
        this.getData = this.getData.bind(this);
        this.addNewPersonneLie = this.addNewPersonneLie.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveNewPersonneLie = this.saveNewPersonneLie.bind(this);
        this.getPersonneLieDetails = this.getPersonneLieDetails.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            document
                .getElementById("validerP")
                .setAttribute("disabled", "disabled");
            // document.getElementById("addMbtnP").setAttribute("disabled","disabled");
        }, 1000);
    }

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
                    "/personnelie/getpersonnelie/data/" + this.props.num
                );
                if (data.data) {
                    this.setState({ fetchData: data.data.data });
                    // console.log(this.state.fetchData.data[0].name)
                    setTimeout(() => {
                        document
                            .getElementById("addMbtnP")
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

    addNewPersonneLie = async (event) => {
        event.preventDefault();
        //initialise les champs
        this.setState({ refCompte: this.props.refCompt });
        // this.setState({ disabled: !this.state.disabled });
        setTimeout(() => {
            this.textInput.current.focus();
            document.getElementById("validerP").removeAttribute("disabled");
            document.getElementById("addMbtnP").setAttribute("disabled");
        }, 10);

        this.setState({
            personneLieName: "",
            lieuNaissLie: "",
            dateNaissLie: "",
            degreParante: "",
        });
    };

    //insert a new personne liee
    saveNewPersonneLie = async (event) => {
        event.preventDefault();

        const res = await axios.post("newpersonnelie/addnew/", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            setTimeout(() => {
                document.getElementById("addMbtnP").removeAttribute("disabled");
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

    //getting individual personneliee details

    getPersonneLieDetails = (id) => {
        axios
            .post("/get/getindividual/personnelie/details", {
                pesonneLieId: id,
            })
            .then((response) => {
                this.setState({
                    idPersonneLie: response.data.id,
                    personneLieName: response.data.personneLieName,
                    lieuNaissLie: response.data.lieuNaissLie,
                    dateNaissLie: response.data.dateNaissLie,
                    degreParante: response.data.degreParante,
                });
                console.log(this.state);
            });
    };

    //RECUPERE L'ID DE LA PERSONNE LIEE A SUPRIME
    deletePersonneLie = (id) => {
        this.setState({ idToDelete: id });
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
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "10px",
        };
        let compteur = 1;
        return (
            <>
                <form method="POST">
                    <div className="row">
                        <div className="col-md-4">
                            <table>
                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="nomheritier"
                                            style={labelColor}
                                        >
                                            Nom
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className={`form-control ${
                                                this.state.error_list
                                                    .personneLieName &&
                                                "is-invalid"
                                            }`}
                                            id="nomheritier"
                                            style={inputColor}
                                            name="personneLieName"
                                            value={this.state.personneLieName}
                                            onChange={this.handleChange}
                                            disabled={
                                                this.state.disabled
                                                    ? "disabled"
                                                    : ""
                                            }
                                            ref={this.textInput}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="lieuNaiss"
                                            style={labelColor}
                                        >
                                            Lieu naissance
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            id="lieuNaiss"
                                            style={inputColor}
                                            name="lieuNaissLie"
                                            value={this.state.lieuNaissLie}
                                            onChange={this.handleChange}
                                            disabled={
                                                this.state.disabled
                                                    ? "disabled"
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="dateNaiss"
                                            style={labelColor}
                                        >
                                            Date naissance
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            id="dateNaiss"
                                            style={inputColor}
                                            name="dateNaissLie"
                                            value={this.state.dateNaissLie}
                                            onChange={this.handleChange}
                                            disabled={
                                                this.state.disabled
                                                    ? "disabled"
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="degreParante"
                                            style={labelColor}
                                        >
                                            Degré parenté
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            id="degreParante"
                                            style={inputColor}
                                            name="degreParante"
                                            value={this.state.degreParante}
                                            onChange={this.handleChange}
                                            disabled={
                                                this.state.disabled
                                                    ? "disabled"
                                                    : ""
                                            }
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            <option value="Parent">
                                                Parent
                                            </option>
                                            <option value="Enfant">
                                                Enfant
                                            </option>
                                            <option value="Cousin">
                                                Cousin
                                            </option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <table
                                className="table table-dark"
                                style={tableBorder}
                            >
                                <thead>
                                    <tr>
                                        <td style={tableBorder}>#</td>
                                        <td style={tableBorder}>Nom</td>
                                        <td style={tableBorder}>Lieu Nsce.</td>
                                        <td style={tableBorder}>Date Nsce</td>
                                        <td style={tableBorder}>Degré p.</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.fetchData.length != 0 &&
                                        this.state.fetchData.map(
                                            (res, index) => {
                                                return (
                                                    <tr index={index}>
                                                        <td style={tableBorder}>
                                                            {" "}
                                                            {compteur++}{" "}
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {
                                                                res.personneLieName
                                                            }
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {res.lieuNaissLie}
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {res.dateNaissLie}
                                                        </td>
                                                        <td style={tableBorder}>
                                                            {res.degreParante}
                                                        </td>

                                                        <td style={tableBorder}>
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
                                                                    data-target="#modal-personnelie"
                                                                    onClick={() => {
                                                                        this.getPersonneLieDetails(
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
                                                                    data-target="#modal-delete-personnelie"
                                                                    onClick={() => {
                                                                        this.deletePersonneLie(
                                                                            res.id
                                                                        );
                                                                    }}
                                                                >
                                                                    Supprimer{" "}
                                                                    <i className="fas fa-trash"></i>{" "}
                                                                </button>
                                                                {/* <button type="button" class="btn btn-primary">Right</button> */}
                                                            </div>
                                                        </td>
                                                        <UpdatePersonneLie
                                                            modalId={
                                                                this.state
                                                                    .idPersonneLie
                                                            }
                                                            personneLieData={
                                                                this.state
                                                            }
                                                        />

                                                        <DeletePersonneLie
                                                            personneLieId={
                                                                this.state
                                                                    .idToDelete
                                                            }
                                                        />
                                                    </tr>
                                                );
                                            }
                                        )}
                                </tbody>
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
                                                borderRadius: "0px",
                                                width: "100%",
                                                height: "30px",
                                                fontSize: "12px",
                                            }}
                                            className="btn btn-success"
                                            onClick={this.getData}
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
                                                borderRadius: "0px",
                                                width: "100%",
                                                height: "30px",
                                                fontSize: "12px",
                                            }}
                                            className="btn btn-primary mt-1"
                                            id="addMbtnP"
                                            onClick={this.addNewPersonneLie}
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
                                                borderRadius: "0px",
                                                width: "100%",
                                                height: "30px",
                                                fontSize: "12px",
                                            }}
                                            className="btn btn-primary mt-1"
                                            id="validerP"
                                            onClick={this.saveNewPersonneLie}
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
            </>
        );
    }
}
