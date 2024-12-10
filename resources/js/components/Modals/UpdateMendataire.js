import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class UpdateMendataire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
        this.handleChange = this.handleChange.bind(this);
        this.UpdateMendataireData = this.UpdateMendataireData.bind(this);
    }
    //get data in input
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically

            [event.target.name]: event.target.value,
        });
    }

    static getDerivedStateFromProps(props, current_state) {
        let mendataireUpdate = {
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
        };
        //updating data from input
        if (
            current_state.mendataireName &&
            current_state.mendataireName !== props.mendatData.mendataireName
        ) {
            return null;
        }

        if (
            current_state.lieuNaissM &&
            current_state.lieuNaissM !== props.mendatData.lieuNaissM
        ) {
            return null;
        }
        if (
            current_state.dateNaissM &&
            current_state.dateNaissM !== props.mendatData.dateNaissM
        ) {
            return null;
        }

        if (
            current_state.etatCivileM &&
            current_state.etatCivileM !== props.mendatData.etatCivileM
        ) {
            return null;
        }
        if (
            current_state.sexeM &&
            current_state.sexeM !== props.mendatData.sexeM
        ) {
            return null;
        }
        if (
            current_state.typePieceM &&
            current_state.typePieceM !== props.mendatData.typePieceM
        ) {
            return null;
        }

        if (
            current_state.professionM &&
            current_state.professionM !== props.mendatData.professionM
        ) {
            return null;
        }
        if (
            current_state.telephoneM &&
            current_state.adresseM !== props.mendatData.adresseM
        ) {
            return null;
        }

        if (
            current_state.adresseM &&
            current_state.adresseM !== props.mendatData.adresseM
        ) {
            return null;
        }
        if (
            current_state.observationM &&
            current_state.observationM !== props.mendatData.observationM
        ) {
            return null;
        }
        //updating data from props below
        if (
            current_state.mendataireName !== props.mendatData.mendataireName ||
            current_state.mendataireName === props.mendatData.mendataireName
        ) {
            mendataireUpdate.mendataireName = props.mendatData.mendataireName;
        }

        if (
            current_state.lieuNaissM !== props.mendatData.lieuNaissM ||
            current_state.lieuNaissM === props.mendatData.lieuNaissM
        ) {
            mendataireUpdate.lieuNaissM = props.mendatData.lieuNaissM;
        }

        if (
            current_state.dateNaissM !== props.mendatData.dateNaissM ||
            current_state.dateNaissM === props.mendatData.dateNaissM
        ) {
            mendataireUpdate.dateNaissM = props.mendatData.dateNaissM;
        }

        if (
            current_state.etatCivileM !== props.mendatData.etatCivileM ||
            current_state.etatCivileM === props.mendatData.etatCivileM
        ) {
            mendataireUpdate.etatCivileM = props.mendatData.etatCivileM;
        }

        if (
            current_state.sexeM !== props.mendatData.sexeM ||
            current_state.sexeM === props.mendatData.sexeM
        ) {
            mendataireUpdate.sexeM = props.mendatData.sexeM;
        }

        if (
            current_state.typePieceM !== props.mendatData.typePieceM ||
            current_state.typePieceM === props.mendatData.typePieceM
        ) {
            mendataireUpdate.typePieceM = props.mendatData.typePieceM;
        }

        if (
            current_state.professionM !== props.mendatData.professionM ||
            current_state.professionM === props.mendatData.professionM
        ) {
            mendataireUpdate.professionM = props.mendatData.professionM;
        }

        if (
            current_state.telephoneM !== props.mendatData.telephoneM ||
            current_state.telephoneM === props.mendatData.telephoneM
        ) {
            mendataireUpdate.telephoneM = props.mendatData.telephoneM;
        }
        if (
            current_state.telephoneM !== props.mendatData.telephoneM ||
            current_state.telephoneM === props.mendatData.telephoneM
        ) {
            mendataireUpdate.telephoneM = props.mendatData.telephoneM;
        }
        if (
            current_state.adresseM !== props.mendatData.adresseM ||
            current_state.adresseM === props.mendatData.adresseM
        ) {
            mendataireUpdate.adresseM = props.mendatData.adresseM;
        }

        return mendataireUpdate;
    }

    //updating mendataire

    UpdateMendataireData = (e) => {
        e.preventDefault();

        axios
            .post("update/mendataire/data", {
                mendataireId: this.props.modalId,
                mendataireName: this.state.mendataireName,
                lieuNaissM: this.state.lieuNaissM,
                dateNaissM: this.state.dateNaissM,
                etatCivileM: this.state.etatCivileM,
                sexeM: this.state.sexeM,
                typePieceM: this.state.typePieceM,
                professionM: this.state.professionM,
                telephoneM: this.state.telephoneM,
                adresseM: this.state.adresseM,
                observationM: this.state.observationM,
            })
            .then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                    console.log(this.props.modalId);
                } else {
                    console.log(this.state);
                }
            });
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
            border: "0px",
        };
        return (
            <>
                <div className="modal fade" id="modal-mendataire">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Modification du mendataire{" "}
                                    <strong>
                                        {" "}
                                        {
                                            this.props.mendatData.mendataireName
                                        }{" "}
                                    </strong>
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
                                            <form method="POST">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <table>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
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
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="nommendataire"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="mendataireName"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .mendataireName ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="lieuNaiss"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Né(e) à
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="lieuNaiss"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="lieuNaissM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .lieuNaissM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="dateNaiss"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Date
                                                                        Naissance
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="dateNaiss"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="dateNaissM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .dateNaissM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="etatCivile"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Etat
                                                                        civile
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <select
                                                                        id="etatCivile"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="etatCivileM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .etatCivileM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
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
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="sexe"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Sexe
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <select
                                                                        id="sexe"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="sexeM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .sexeM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
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

                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
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
                                                                        className="btn btn-primary"
                                                                        id="addMbtn"
                                                                        onClick={
                                                                            this
                                                                                .UpdateMendataireData
                                                                        }
                                                                    >
                                                                        Valider{" "}
                                                                        <i className="fas fa-database"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <table>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="profession"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Profession
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <select
                                                                        id="profession"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="professionM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .professionM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
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
                                                                            Eleve
                                                                            ou
                                                                            Etudiant
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="telephone"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Téléphone
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="telephone"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="telephoneM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .telephoneM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="adressemend"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Adresse
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
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
                                                                            this
                                                                                .state
                                                                                .adresseM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="observation"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Observation
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="observation"
                                                                        style={{
                                                                            height: "40px",
                                                                            border: "1px solid steelblue",
                                                                            padding:
                                                                                "3px",
                                                                        }}
                                                                        name="observationM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .observationM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor="typePiece"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        Type
                                                                        pièce
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <select
                                                                        id="typePiece"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="typePieceM"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .typePieceM ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
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
                                                        </table>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="modal-footer justify-content-between">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Sav changes</button>
            </div> */}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
