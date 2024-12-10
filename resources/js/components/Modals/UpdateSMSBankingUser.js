import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class UpdateSMSBankingUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            Telephone: "",
            Civilite: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.UpdateSMSBankingUserData =
            this.UpdateSMSBankingUserData.bind(this);
        this.clearData = this.clearData.bind(this);
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
        let SMSBankingInfoUpdate = {
            Email: "",
            Telephone: "",
            Civilite: "",
        };
        //console.log(props.data.Telephone + "hhhhhhhhhhhhhhhhh");
        //updating data from input
        if (props.data) {
            if (
                current_state.Email &&
                current_state.Email !== props.data.Email
            ) {
                return null;
            }
            if (
                current_state.Telephone &&
                current_state.Telephone !== props.data.Telephone
            ) {
                return null;
            }
            if (
                current_state.Civilite &&
                current_state.Civilite !== props.data.Civilite
            ) {
                return null;
            }

            //updating data from props below
            if (
                current_state.Email !== props.data.Email ||
                current_state.Email === props.data.Email
            ) {
                SMSBankingInfoUpdate.Email = props.data.Email;
            }

            if (
                current_state.Telephone !== props.data.Telephone ||
                current_state.Telephone === props.data.Telephone
            ) {
                SMSBankingInfoUpdate.Telephone = props.data.Telephone;
            }

            if (
                current_state.Civilite !== props.data.Civilite ||
                current_state.Email === props.data.Civilite
            ) {
                SMSBankingInfoUpdate.Civilite = props.data.Civilite;
            }

            return SMSBankingInfoUpdate;
        }
    }

    //updating mendataire

    UpdateSMSBankingUserData = (e) => {
        e.preventDefault();

        axios
            .post("sms-banking/update/user/data", {
                userId: this.props.data.id,
                Email: this.state.Email,
                Telephone: this.state.Telephone,
                Civilite: this.state.Civilite,
            })
            .then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                    // console.log(this.props.modalId);
                } else {
                    console.log(this.state);
                }
            });
    };

    clearData = () => {
        this.props.data = [];
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
                <div className="modal fade" id="modal-sms-banking">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Modification du membre{" "}
                                    {this.props.data &&
                                        this.props.data.NomCompte}{" "}
                                    {/* {console.log(this.props.data)} */}
                                </h4>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={this.clearData}
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
                                                                        htmlFor="Telephone"
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
                                                                        id="Telephone"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="Telephone"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Telephone ??
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
                                                                        htmlFor="Email"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Email
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="Email"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="Email"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Email ??
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
                                                                        htmlFor="Civilite"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Civilité
                                                                    </label>
                                                                </td>
                                                                <td
                                                                    style={
                                                                        tableBorder
                                                                    }
                                                                >
                                                                    <input
                                                                        id="Civilite"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="Civilite"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .Civilite ??
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
                                                                                .UpdateSMSBankingUserData
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
