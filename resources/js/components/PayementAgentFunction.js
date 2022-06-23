import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PayementAgentFunction(props) {
    const [inputFields, setInputFields] = useState([
        { NumCompte: "", Montant: "" },
        { NumCompte: "", Montant: "" },
    ]);
    // const [data, setData] = [];

    const handleChang = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);
        setData(inputFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // inputFields.forEach((element) => {
        //     console.log("inputfiels", element.Montant);
        //     console.log("inputfiels", element.NumCompte);
        // });
        const res = await axios.post("/payement/agent/data", inputFields);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Payement des agents",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.success == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
            console.log("inputfiels", inputFields);
        }
        // console.log("inputfiels", inputFields[0].Montant);
    };

    const handleAddFields = () => {
        setInputFields([...inputFields, { NumCompte: "", Montant: "" }]);
    };

    const handleRemoveFields = (index) => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    return (
        <div className="col-md-5">
            <form onSubmit={handleSubmit}>
                {inputFields.map((inputField, index) => {
                    return (
                        <div key={index}>
                            <input
                                style={{
                                    border: "2px solid #fff",
                                    marginTop: "1px",
                                }}
                                type="text"
                                name="NumCompte"
                                placeholder="Numéro de compte..."
                                // onChange={this.handleChange}
                                value={inputField.NumCompte}
                                onChange={(event) => handleChang(index, event)}
                            />{" "}
                            <input
                                style={{
                                    border: "2px solid #fff",
                                    marginTop: "1px",
                                }}
                                type="text"
                                name="Montant"
                                placeholder="Entrez le montant..."
                                // onChange={this.handleChange}
                                value={inputField.Montant}
                                onChange={(event) => handleChang(index, event)}
                            />
                            <i
                                class="fas fa-plus"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleAddFields()}
                            ></i>{" "}
                            <i
                                class="fas fa-minus"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRemoveFields(index)}
                            ></i>
                        </div>
                    );
                })}
                <table>
                    <tr>
                        <td></td>
                        <td>
                            <button
                                type="button"
                                style={{
                                    borderRadius: "0px",
                                    width: "100%",
                                    height: "30px",
                                    fontSize: "12px",
                                }}
                                id="savebtn"
                                className="btn btn-primary mt-1"
                                onClick={handleSubmit}
                            >
                                Enregistrer <i className="fas fa-save"></i>
                            </button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    );
}

export default PayementAgentFunction;
