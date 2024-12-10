import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class ModalSignature extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="modal fade" id="modal-vieuw-signature">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Affichage signature
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
                                        {/* <img
                                            src={`uploads/membres/signatures/${
                                                this.props.signatureData
                                                    ? this.props.signatureData
                                                    : "default.jpg"
                                            }`}
                                            alt="Aucune signature"
                                            width="500"
                                            height="500"
                                        /> */}

                                        <table>
                                            <tr>
                                                <td>
                                                    <img
                                                        src={`uploads/membres/signatures/${
                                                            this.props
                                                                .signatureData
                                                                ? this.props
                                                                      .signatureData
                                                                : "default.jpg"
                                                        }`}
                                                        alt="Aucune signature"
                                                        className="img-thumbnail"
                                                        width="500"
                                                        height="500"
                                                    />
                                                </td>
                                                <td>
                                                    <img
                                                        src={`uploads/membres/${
                                                            this.props.imageData
                                                                ? this.props
                                                                      .imageData
                                                                : "default.jpg"
                                                        }`}
                                                        alt="Aucune signature"
                                                        className="img-thumbnail"
                                                        width="500"
                                                        height="500"
                                                    />
                                                </td>
                                            </tr>
                                        </table>
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
