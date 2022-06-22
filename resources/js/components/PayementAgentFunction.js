import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PayementAgentFunction(props) {
    const [inputFields, setInputFields] = useState([
        { NumCompte: "", Montant: "" },
        { NumCompte: "", Montant: "" },
    ]);

    const handleChang = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("inputfiels", inputFields);
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
        <div className="col-md-6">
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
