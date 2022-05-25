import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class UpdatePersonneLie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personneLieName: "",
            lieuNaissLie: "",
            dateNaissLie: "",
            degreParante: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.UpdatePersonneLieData = this.UpdatePersonneLieData.bind(this);
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
        let personneLieUpdate = {
            personneLieName: "",
            dateNaissLie: "",
            degreParante: "",
        };
        //updating data from input
        if (
            current_state.personneLieName &&
            current_state.personneLieName !==
                props.personneLieData.personneLieName
        ) {
            return null;
        }
        if (
            current_state.lieuNaissLie &&
            current_state.lieuNaissLie !== props.personneLieData.lieuNaissLie
        ) {
            return null;
        }
        if (
            current_state.dateNaissLie &&
            current_state.dateNaissLie !== props.personneLieData.dateNaissLie
        ) {
            return null;
        }
        if (
            current_state.degreParante &&
            current_state.degreParante !== props.personneLieData.degreParante
        ) {
            return null;
        }

        //updating data from props below
        if (
            current_state.personneLieName !==
                props.personneLieData.personneLieName ||
            current_state.personneLieName ===
                props.personneLieData.personneLieName
        ) {
            personneLieUpdate.personneLieName =
                props.personneLieData.personneLieName;
        }

        if (
            current_state.lieuNaissLie !== props.personneLieData.lieuNaissLie ||
            current_state.lieuNaissLie === props.personneLieData.lieuNaissLie
        ) {
            personneLieUpdate.lieuNaissLie = props.personneLieData.lieuNaissLie;
        }
        if (
            current_state.dateNaissLie !== props.personneLieData.dateNaissLie ||
            current_state.dateNaissLie === props.personneLieData.dateNaissLie
        ) {
            personneLieUpdate.dateNaissLie = props.personneLieData.dateNaissLie;
        }

        if (
            current_state.degreParante !== props.personneLieData.degreParante ||
            current_state.degreParante === props.personneLieData.degreParante
        ) {
            personneLieUpdate.degreParante = props.personneLieData.degreParante;
        }

        return personneLieUpdate;
    }

    //updating mendataire

    UpdatePersonneLieData = (e) => {
        e.preventDefault();

        axios
            .post("update/personnelie/data", {
                personneLieId: this.props.modalId,
                personneLieName: this.state.personneLieName,
                lieuNaissLie: this.state.lieuNaissLie,
                dateNaissLie: this.state.dateNaissLie,
                degreParante: this.state.degreParante,
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
                <div className="modal fade" id="modal-personnelie">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Modification d'une personne liée{" "}
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
                                                                        htmlFor="personneLieName"
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
                                                                        id="personneLieName"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="personneLieName"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .personneLieName ??
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
                                                                        htmlFor="lieuNaissLie"
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
                                                                        id="lieuNaissLie"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="lieuNaissLie"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .lieuNaissLie ??
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
                                                                        htmlFor="dateNaissLie"
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
                                                                        id="dateNaissLie"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="dateNaissLie"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .dateNaissLie ??
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
                                                                        htmlFor="degreParante"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Degré de
                                                                        parenté
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="degreParante"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="degreParante"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .degreParante ??
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
                                                                                .UpdatePersonneLieData
                                                                        }
                                                                    >
                                                                        Valider{" "}
                                                                        <i className="fas fa-database"></i>
                                                                    </button>
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
