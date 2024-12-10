import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateMendataire from "./Modals/UpdateMendataire";
import DeleteMendataire from "./Modals/DeleteMendataire";

// import EditMembre from './EditMembre';

export default class MendataireTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            fetchData: [],
            refCompte: "",
            error_list: [],
        };
        this.textInput = React.createRef();
        this.getData = this.getData.bind(this);
        //    this.deleteMendatair=this.deleteMendatair.bind();
    }

    componentDidMount() {
        setTimeout(() => {
            document
                .getElementById("validerMbtn")
                .setAttribute("disabled", "disabled");
            // document.getElementById("addMbtn").setAttribute("disabled","disabled");
        }, 1000);
    }
    //put focus on given input
    focusTextInput() {
        this.textInput.current.focus();
    }

    //   componentDidUpdate(){
    //     this.getData();
    //   }

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
                    "/mendataire/getmendataire/data/" + this.props.num
                );
                if (data.data) {
                    this.setState({ fetchData: data.data.data });
                    // console.log(this.state.fetchData.data[0].name)
                    setTimeout(() => {
                        document
                            .getElementById("addMbtn")
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
                <table>
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
                                Actualiser <i class="fas fa-sync"></i>
                            </button>
                        </td>
                    </tr>
                </table>
                <table className="table table-dark" style={tableBorder}>
                    <thead>
                        <tr>
                            <td style={tableBorder}>#</td>
                            <td style={tableBorder}>Nom</td>

                            <td style={tableBorder}>Téléphone</td>
                            <td style={tableBorder}>Adresse</td>
                            <td style={tableBorder}>Signature</td>
                            <td style={tableBorder}>Photo</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.fetchData.length != 0 &&
                            this.state.fetchData.map((res, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={tableBorder}>
                                            {" "}
                                            {compteur++}{" "}
                                        </td>
                                        <td style={tableBorder}>
                                            {res.intituleCompte}
                                        </td>

                                        <td style={tableBorder}>
                                            {res.telephoneM}
                                        </td>
                                        <td style={tableBorder}>
                                            {res.adresseM}
                                        </td>
                                        <td style={tableBorder}>
                                            {res.SignatureM}
                                        </td>
                                        <td style={tableBorder}>
                                            {res.photoM}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </>
        );
    }
}
