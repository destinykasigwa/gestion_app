import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class ActivateCompteM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateOuverture: "",
        };

        this.activationCompte = this.activationCompte.bind(this);
    }

    componentDidMount() {
        let current_datetime = new Date();
        let formatted_date =
            //year
            current_datetime.getFullYear() +
            "-" +
            //month
            (current_datetime.getMonth() + 1) +
            "-" +
            //day
            current_datetime.getDate();
        this.setState({ dateOuverture: formatted_date });
    }
    //ACTIVATE CREATED NUMBER
    activationCompte = (e) => {
        axios
            .post("activationcompte/membre/data", {
                refCompte: this.props.refCompt,
                // compteEnFranc: "330100" + this.props.refCompt + "202",
                // numCompteDollars: "330000" + this.props.refCompt + "201",
                // dateOuverture: this.state.dateOuverture,
                devise: this.props.devise,
                idComptMembre: this.props.idComptM,
            })
            .then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });
                } else if (response.data.success == 0) {
                    Swal.fire({
                        title: "Erreur",
                        text: response.data.msg,
                        icon: "error",
                        button: "OK!",
                    });
                }
            });
        // console.log(this.props.refCompt);
    };

    render() {
        return (
            <>
                <div className="modal fade" id="modal-activation-compte">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Activation de compte
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
                                        <form method="POST">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h4
                                                        style={{
                                                            color: "#000",
                                                        }}
                                                    >
                                                        {" "}
                                                        Etes vous sûr de pouvoir
                                                        activé ce compte ?{" "}
                                                        {/* <strong>
                                                            {
                                                                this.props
                                                                    .refCompt
                                                            }
                                                        </strong>{" "}
                                                        ?{" "} */}
                                                    </h4>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={this.activationCompte}
                                >
                                    Activer
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
