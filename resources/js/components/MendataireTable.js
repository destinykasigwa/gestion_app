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
            photoM: "",
            fetchData: null,
            refCompte: "",
            error_list: [],
            itemToDropId: "",
            itemToDropName: "",
        };
        this.textInput = React.createRef();
        this.getData = this.getData.bind(this);
        this.addNewMendataire = this.addNewMendataire.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveNewMendataire = this.saveNewMendataire.bind(this);
        this.getMendataireDetails = this.getMendataireDetails.bind(this);
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
                    "/mendataire/getmendataire/" + this.props.num
                );
                if (data.data) {
                    this.setState({ fetchData: data.data });
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
    addNewMendataire = async (event) => {
        event.preventDefault();
        //initialise les champs

        this.setState({
            disabled: !this.state.disabled,
            refCompte: this.props.refCompt,
        });
        this.setState({ disabled: !this.state.disabled });
        setTimeout(() => {
            this.textInput.current.focus();
            document.getElementById("validerMbtn").removeAttribute("disabled");
            document.getElementById("addMbtn").setAttribute("disabled");
        }, 10);

        this.setState({
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
        });
    };

    saveNewMendataire = async (event) => {
        event.preventDefault();
        //Insert le nouveau membre
        const res = await axios.post("/mendataire/", this.state);
        if (res.data.success == 1) {
            Swal.fire({
                title: "Success",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            setTimeout(() => {
                document.getElementById("addMbtn").removeAttribute("disabled");
            }, 10);
            console.log(this.state);
            this.setState({ disabled: !this.state.disabled });
        } else {
            this.setState({
                error_list: res.data.validate_error,
            });
        }
        console.log(this.state);
    };

    //getting individual mendataire details

    getMendataireDetails = (id) => {
        axios
            .post("/get/getindividual/mendataire/details", {
                mendataireId: id,
            })
            .then((response) => {
                this.setState({
                    idMendataire: response.data.id,
                    mendataireName: response.data.mendataireName,
                    lieuNaissM: response.data.lieuNaissM,
                    dateNaissM: response.data.dateNaissM,
                    etatCivileM: response.data.etatCivileM,
                    sexeM: response.data.sexeM,
                    typePieceM: response.data.typePieceM,
                    professionM: response.data.professionM,
                    telephoneM: response.data.telephoneM,
                    adresseM: response.data.adresseM,
                    observationM: response.data.observationM,
                });
                console.log(this.state);
            });
    };

    deleteMendatair(num) {
        this.setState({ itemToDropId: num });
        console.log(this.state.itemToDropId);
    }

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
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.fetchData &&
                            this.state.fetchData.data.map((res, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={tableBorder}>
                                            {" "}
                                            {compteur++}{" "}
                                        </td>
                                        <td style={tableBorder}>{res.name}</td>

                                        <td style={tableBorder}>
                                            {res.telephone}
                                        </td>
                                        <td style={tableBorder}>
                                            {res.adresse}
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
