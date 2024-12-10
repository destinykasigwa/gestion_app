import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AddSignatureOnAccount(props) {
    // let videoRef = useRef(null);

    // let photoRef = useRef(null);

    const [uploadFile, setUploadFile] = useState("");

    const addFile = async (event) => {
        try {
            event.preventDefault();

            const formData = new FormData();
            formData.append("idMembre", props.idCompteMembre);
            formData.append("uploaded_file", uploadFile);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
            };

            const url = "membre/add-signature/data";
            axios
                .post(url, formData, config)
                .then((response) => {
                    if (response.data.success == "1") {
                        Swal.fire({
                            title: "Succès",
                            text: response.data.msg,
                            icon: "success",
                            button: "OK!",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    };

    //   useEffect(() => {
    //     getVideo();
    //   }, [videoRef]);

    return (
        <div className="row">
            <div className="col-md-4">
                <h1>Mises à jours de la signature</h1>

                <form>
                    <div className="mb-3">
                        <table>
                            <tr>
                                <td>
                                    {/* <label
                                        for="formFileMultiple"
                                        class="form-label"
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Signature
                                    </label> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="formFileMultiple"
                                        // multiple
                                        onChange={(e) =>
                                            setUploadFile(e.target.files[0])
                                        }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button
                                        className="btn btn-primary mt-1"
                                        onClick={addFile}
                                    >
                                        Mettre à jour
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSignatureOnAccount;
