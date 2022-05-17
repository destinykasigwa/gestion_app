import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function WebCame(props) {
    let videoRef = useRef(null);

    let photoRef = useRef(null);

    const [uploadImage, setUploadImage] = useState("");

    const getVideo = (e) => {
        e.preventDefault();
        navigator.mediaDevices
            .getUserMedia({
                video: true,
            })
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const stopVideo = (e, stream) => {
        e.preventDefault();
        let video = videoRef.current;
        video.srcObject = stream;
        video.stop();
    };
    const takePicture = (e) => {
        e.preventDefault();
        const width = 400;
        const height = width / (16 / 9);

        let video = videoRef.current;

        let photo = photoRef.current;

        photo.width = width;

        photo.height = height;

        let ctx = photo.getContext("2d");

        ctx.drawImage(video, 0, 0, width, height);
    };

    const clearImage = (e) => {
        e.preventDefault();
        let photo = photoRef.current;

        let ctx = photo.getContext("2d");

        ctx.clearRect(0, 0, photo.width, photo.height);
    };

    const addImage = async (event) => {
        try {
            event.preventDefault();

            const formData = new FormData();
            formData.append("idMembre", props.idCompteMembre);
            formData.append("uploaded_image", uploadImage);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
            };

            const url = "membre/addphoto";
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
                <h1 className="text-center">
                    Webcam{" "}
                    <form>
                        <button className="btn btn-success" onClick={getVideo}>
                            Démmarrer
                        </button>{" "}
                        <button className="btn btn-danger" onClick={stopVideo}>
                            Stopper
                        </button>
                    </form>{" "}
                </h1>
                <form>
                    <video ref={videoRef} className="container mt-1"></video>

                    <button
                        onClick={takePicture}
                        className="btn btn-primary container-fluid"
                    >
                        Take Picture
                    </button>

                    <canvas className="container" ref={photoRef}></canvas>

                    <button
                        onClick={clearImage}
                        className="btn btn-danger container-fluid"
                    >
                        Clear Image
                    </button>
                </form>

                <br />
                <br />
            </div>

            <div className="col-md-4">
                <h1>Mises à jours</h1>

                <form>
                    <div className="mb-3">
                        <table>
                            <tr>
                                <td>
                                    <label
                                        for="formFileMultiple"
                                        class="form-label"
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Image de l'en tête
                                    </label>
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
                                            setUploadImage(e.target.files[0])
                                        }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button
                                        className="btn btn-primary mt-1"
                                        onClick={addImage}
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

export default WebCame;
