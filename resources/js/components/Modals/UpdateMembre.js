import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class UpdateMembre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            intituleCompte: "",
            lieuNaiss: "",
            dateNaiss: "",
            etatCivile: "",
            conjoitName: "",
            fatherName: "",
            motherName: "",
            profession: "",
            workingPlace: "",
            cilivilty: "",
            sexe: "",
            phone1: "",
            phone2: "",
            email: "",
            typepiece: "",
            numpiece: "",
            delivrancePlace: "",
            delivranceDate: "",
            gestionnaire: "",
            provinceOrigine: "",
            territoireOrigine: "",
            collectiviteOrigine: "",
            territoireOrigine: "",
            provinceActuelle: "",
            villeActuelle: "",
            CommuneActuelle: "",
            QuartierActuelle: "",
            parainAccount: "",
            parainName: "",
            typeGestion: "",
            critere1: "",
            otherMention: "",
            error_list: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.UpdateMembreData = this.UpdateMembreData.bind(this);
    }
    // get data in input
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    static getDerivedStateFromProps(props, current_state) {
        let membreUpdate = {
            idMembre: "",
            intituleCompte: "",
            lieuNaiss: "",
            dateNaiss: "",
            etatCivile: "",
            conjoitName: "",
            fatherName: "",
            motherName: "",
            profession: "",
            workingPlace: "",
            cilivilty: "",
            sexe: "",
            phone1: "",
            phone2: "",
            email: "",
            typepiece: "",
            numpiece: "",
            delivrancePlace: "",
            delivranceDate: "",
            gestionnaire: "",
            provinceOrigine: "",
            territoireOrigine: "",
            collectiviteOrigine: "",
            provinceActuelle: "",
            villeActuelle: "",
            CommuneActuelle: "",
            QuartierActuelle: "",
            parainAccount: "",
            parainName: "",
            typeGestion: "",
            critere1: "",
            otherMention: "",
        };
        //updating data from input
        if (
            current_state.intituleCompte &&
            current_state.intituleCompte !== props.dataMembre.intituleCompte
        ) {
            return null;
        }
        if (
            current_state.lieuNaiss &&
            current_state.lieuNaiss !== props.dataMembre.lieuNaiss
        ) {
            return null;
        }
        if (
            current_state.dateNaiss &&
            current_state.dateNaiss !== props.dataMembre.dateNaiss
        ) {
            return null;
        }
        if (
            current_state.etatCivile &&
            current_state.etatCivile !== props.dataMembre.etatCivile
        ) {
            return null;
        }

        if (
            current_state.conjoitName &&
            current_state.conjoitName !== props.dataMembre.conjoitName
        ) {
            return null;
        }
        if (
            current_state.fatherName &&
            current_state.fatherName !== props.dataMembre.fatherName
        ) {
            return null;
        }
        if (
            current_state.motherName &&
            current_state.motherName !== props.dataMembre.motherName
        ) {
            return null;
        }

        if (
            current_state.profession &&
            current_state.profession !== props.dataMembre.profession
        ) {
            return null;
        }
        if (
            current_state.workingPlace &&
            current_state.workingPlace !== props.dataMembre.workingPlace
        ) {
            return null;
        }

        if (
            current_state.cilivilty &&
            current_state.cilivilty !== props.dataMembre.cilivilty
        ) {
            return null;
        }
        if (
            current_state.sexe &&
            current_state.sexe !== props.dataMembre.sexe
        ) {
            return null;
        }
        if (
            current_state.phone1 &&
            current_state.phone1 !== props.dataMembre.phone1
        ) {
            return null;
        }
        if (
            current_state.phone2 &&
            current_state.phone2 !== props.dataMembre.phone2
        ) {
            return null;
        }
        if (
            current_state.email &&
            current_state.email !== props.dataMembre.email
        ) {
            return null;
        }

        if (
            current_state.typepiece &&
            current_state.typepiece !== props.dataMembre.typepiece
        ) {
            return null;
        }

        if (
            current_state.numpiece &&
            current_state.numpiece !== props.dataMembre.numpiece
        ) {
            return null;
        }

        if (
            current_state.delivrancePlace &&
            current_state.delivrancePlace !== props.dataMembre.delivrancePlace
        ) {
            return null;
        }

        if (
            current_state.delivranceDate &&
            current_state.delivranceDate !== props.dataMembre.delivranceDate
        ) {
            return null;
        }

        if (
            current_state.gestionnaire &&
            current_state.gestionnaire !== props.dataMembre.gestionnaire
        ) {
            return null;
        }

        if (
            current_state.provinceOrigine &&
            current_state.provinceOrigine !== props.dataMembre.provinceOrigine
        ) {
            return null;
        }

        if (
            current_state.territoireOrigine &&
            current_state.territoireOrigine !==
                props.dataMembre.territoireOrigine
        ) {
            return null;
        }

        if (
            current_state.collectiviteOrigine &&
            current_state.collectiviteOrigine !==
                props.dataMembre.collectiviteOrigine
        ) {
            return null;
        }

        if (
            current_state.provinceActuelle &&
            current_state.provinceActuelle !== props.dataMembre.provinceActuelle
        ) {
            return null;
        }

        if (
            current_state.villeActuelle &&
            current_state.villeActuelle !== props.dataMembre.villeActuelle
        ) {
            return null;
        }

        if (
            current_state.CommuneActuelle &&
            current_state.CommuneActuelle !== props.dataMembre.CommuneActuelle
        ) {
            return null;
        }

        if (
            current_state.QuartierActuelle &&
            current_state.QuartierActuelle !== props.dataMembre.QuartierActuelle
        ) {
            return null;
        }
        if (
            current_state.parainAccount &&
            current_state.parainAccount !== props.dataMembre.parainAccount
        ) {
            return null;
        }

        if (
            current_state.parainName &&
            current_state.parainName !== props.dataMembre.parainName
        ) {
            return null;
        }

        if (
            current_state.typeGestion &&
            current_state.typeGestion !== props.dataMembre.typeGestion
        ) {
            return null;
        }

        if (
            current_state.critere1 &&
            current_state.critere1 !== props.dataMembre.critere1
        ) {
            return null;
        }

        if (
            current_state.otherMention &&
            current_state.otherMention !== props.dataMembre.otherMention
        ) {
            return null;
        }

        //updating data from props below
        if (
            current_state.intituleCompte !== props.dataMembre.intituleCompte ||
            current_state.intituleCompte === props.dataMembre.intituleCompte
        ) {
            membreUpdate.intituleCompte = props.dataMembre.intituleCompte;
        }

        if (
            current_state.lieuNaiss !== props.dataMembre.lieuNaiss ||
            current_state.lieuNaiss === props.dataMembre.lieuNaiss
        ) {
            membreUpdate.lieuNaiss = props.dataMembre.lieuNaiss;
        }

        if (
            current_state.dateNaiss !== props.dataMembre.dateNaiss ||
            current_state.dateNaiss === props.dataMembre.dateNaiss
        ) {
            membreUpdate.dateNaiss = props.dataMembre.dateNaiss;
        }

        if (
            current_state.etatCivile !== props.dataMembre.etatCivile ||
            current_state.etatCivile === props.dataMembre.etatCivile
        ) {
            membreUpdate.etatCivile = props.dataMembre.etatCivile;
        }
        if (
            current_state.conjoitName !== props.dataMembre.conjoitName ||
            current_state.conjoitName === props.dataMembre.conjoitName
        ) {
            membreUpdate.conjoitName = props.dataMembre.conjoitName;
        }

        if (
            current_state.fatherName !== props.dataMembre.fatherName ||
            current_state.fatherName === props.dataMembre.fatherName
        ) {
            membreUpdate.fatherName = props.dataMembre.fatherName;
        }

        if (
            current_state.motherName !== props.dataMembre.motherName ||
            current_state.motherName === props.dataMembre.motherName
        ) {
            membreUpdate.motherName = props.dataMembre.motherName;
        }

        if (
            current_state.profession !== props.dataMembre.profession ||
            current_state.profession === props.dataMembre.profession
        ) {
            membreUpdate.profession = props.dataMembre.profession;
        }

        if (
            current_state.workingPlace !== props.dataMembre.workingPlace ||
            current_state.workingPlace === props.dataMembre.workingPlace
        ) {
            membreUpdate.workingPlace = props.dataMembre.workingPlace;
        }
        if (
            current_state.cilivilty !== props.dataMembre.cilivilty ||
            current_state.cilivilty === props.dataMembre.cilivilty
        ) {
            membreUpdate.cilivilty = props.dataMembre.cilivilty;
        }
        if (
            current_state.sexe !== props.dataMembre.sexe ||
            current_state.sexe === props.dataMembre.sexe
        ) {
            membreUpdate.sexe = props.dataMembre.sexe;
        }
        if (
            current_state.phone1 !== props.dataMembre.phone1 ||
            current_state.phone1 === props.dataMembre.phone1
        ) {
            membreUpdate.phone1 = props.dataMembre.phone1;
        }

        if (
            current_state.phone2 !== props.dataMembre.phone2 ||
            current_state.phone2 === props.dataMembre.phone2
        ) {
            membreUpdate.phone2 = props.dataMembre.phone2;
        }

        if (
            current_state.email !== props.dataMembre.email ||
            current_state.email === props.dataMembre.email
        ) {
            membreUpdate.email = props.dataMembre.email;
        }

        if (
            current_state.typepiece !== props.dataMembre.typepiece ||
            current_state.typepiece === props.dataMembre.typepiece
        ) {
            membreUpdate.typepiece = props.dataMembre.typepiece;
        }

        if (
            current_state.numpiece !== props.dataMembre.numpiece ||
            current_state.numpiece === props.dataMembre.numpiece
        ) {
            membreUpdate.numpiece = props.dataMembre.numpiece;
        }

        if (
            current_state.delivrancePlace !==
                props.dataMembre.delivrancePlace ||
            current_state.delivrancePlace === props.dataMembre.delivrancePlace
        ) {
            membreUpdate.delivrancePlace = props.dataMembre.delivrancePlace;
        }

        if (
            current_state.delivranceDate !== props.dataMembre.delivranceDate ||
            current_state.delivranceDate === props.dataMembre.delivranceDate
        ) {
            membreUpdate.delivranceDate = props.dataMembre.delivranceDate;
        }

        if (
            current_state.gestionnaire !== props.dataMembre.gestionnaire ||
            current_state.gestionnaire === props.dataMembre.gestionnaire
        ) {
            membreUpdate.gestionnaire = props.dataMembre.gestionnaire;
        }

        if (
            current_state.provinceOrigine !==
                props.dataMembre.provinceOrigine ||
            current_state.provinceOrigine === props.dataMembre.provinceOrigine
        ) {
            membreUpdate.provinceOrigine = props.dataMembre.provinceOrigine;
        }

        if (
            current_state.territoireOrigine !==
                props.dataMembre.territoireOrigine ||
            current_state.territoireOrigine ===
                props.dataMembre.territoireOrigine
        ) {
            membreUpdate.territoireOrigine = props.dataMembre.territoireOrigine;
        }

        if (
            current_state.collectiviteOrigine !==
                props.dataMembre.collectiviteOrigine ||
            current_state.collectiviteOrigine ===
                props.dataMembre.collectiviteOrigine
        ) {
            membreUpdate.collectiviteOrigine =
                props.dataMembre.collectiviteOrigine;
        }

        if (
            current_state.provinceActuelle !==
                props.dataMembre.provinceActuelle ||
            current_state.provinceActuelle === props.dataMembre.provinceActuelle
        ) {
            membreUpdate.provinceActuelle = props.dataMembre.provinceActuelle;
        }

        if (
            current_state.villeActuelle !== props.dataMembre.villeActuelle ||
            current_state.villeActuelle === props.dataMembre.villeActuelle
        ) {
            membreUpdate.villeActuelle = props.dataMembre.villeActuelle;
        }

        if (
            current_state.CommuneActuelle !==
                props.dataMembre.CommuneActuelle ||
            current_state.CommuneActuelle === props.dataMembre.CommuneActuelle
        ) {
            membreUpdate.CommuneActuelle = props.dataMembre.CommuneActuelle;
        }

        if (
            current_state.QuartierActuelle !==
                props.dataMembre.QuartierActuelle ||
            current_state.QuartierActuelle === props.dataMembre.QuartierActuelle
        ) {
            membreUpdate.QuartierActuelle = props.dataMembre.QuartierActuelle;
        }

        if (
            current_state.parainAccount !== props.dataMembre.parainAccount ||
            current_state.parainAccount === props.dataMembre.parainAccount
        ) {
            membreUpdate.parainAccount = props.dataMembre.parainAccount;
        }

        if (
            current_state.parainName !== props.dataMembre.parainName ||
            current_state.parainName === props.dataMembre.parainName
        ) {
            membreUpdate.parainName = props.dataMembre.parainName;
        }

        if (
            current_state.typeGestion !== props.dataMembre.typeGestion ||
            current_state.typeGestion === props.dataMembre.typeGestion
        ) {
            membreUpdate.typeGestion = props.dataMembre.typeGestion;
        }

        if (
            current_state.critere1 !== props.dataMembre.critere1 ||
            current_state.critere1 === props.dataMembre.critere1
        ) {
            membreUpdate.critere1 = props.dataMembre.critere1;
        }

        if (
            current_state.otherMention !== props.dataMembre.otherMention ||
            current_state.otherMention === props.dataMembre.otherMention
        ) {
            membreUpdate.otherMention = props.dataMembre.otherMention;
        }

        return membreUpdate;
    }

    //updating membre

    UpdateMembreData = (e) => {
        e.preventDefault();

        axios
            .post("update/membre/data", {
                idMembre: this.props.dataMembre.refCompte,
                intituleCompte: this.state.intituleCompte,
                lieuNaiss: this.state.lieuNaiss,
                dateNaiss: this.state.dateNaiss,
                etatCivile: this.state.etatCivile,
                conjoitName: this.state.conjoitName,
                fatherName: this.state.fatherName,
                motherName: this.state.motherName,
                profession: this.state.profession,
                workingPlace: this.state.workingPlace,
                cilivilty: this.state.cilivilty,
                sexe: this.state.sexe,
                phone1: this.state.phone1,
                phone2: this.state.phone2,
                email: this.state.email,
                typepiece: this.state.typepiece,
                numpiece: this.state.numpiece,
                delivrancePlace: this.state.delivrancePlace,
                delivranceDate: this.state.delivranceDate,
                gestionnaire: this.state.gestionnaire,
                provinceOrigine: this.state.provinceOrigine,
                territoireOrigine: this.state.territoireOrigine,
                collectiviteOrigine: this.state.collectiviteOrigine,
                provinceActuelle: this.state.provinceActuelle,
                villeActuelle: this.state.villeActuelle,
                CommuneActuelle: this.state.CommuneActuelle,
                QuartierActuelle: this.state.QuartierActuelle,
                parainAccount: this.state.parainAccount,
                parainName: this.state.parainName,
                typeGestion: this.state.typeGestion,
                critere1: this.state.critere1,
                otherMention: this.state.otherMention,
            })
            .then((response) => {
                if (response.data.success == 1) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.msg,
                        icon: "success",
                        button: "OK!",
                    });

                    this.setState({ disabled: !this.state.disabled });
                } else {
                    console.log(this.state);
                    this.setState({
                        error_list: response.data.validate_error,
                    });
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
        return (
            <>
                <div className="modal fade" id="modal-update-membre">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    style={{ color: "#000" }}
                                    className="modal-title"
                                >
                                    Modification du membre{" "}
                                    <strong>
                                        {" "}
                                        {
                                            this.props.dataMembre.intituleCompte
                                        }{" "}
                                    </strong>
                                </h4>
                                <button
                                    type="button"
                                    className="close"
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
                                            <form
                                                method="POST"
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Intitulé
                                                                        c.
                                                                    </label>{" "}
                                                                </td>
                                                                <div className="input-group input-group-sm ">
                                                                    <input
                                                                        type="text"
                                                                        style={{
                                                                            borderRadius:
                                                                                "0px",
                                                                        }}
                                                                        className={`form-control ${
                                                                            this
                                                                                .state
                                                                                .error_list
                                                                                .intituleCompte &&
                                                                            "is-invalid"
                                                                        }`}
                                                                        name="intituleCompte"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .intituleCompte
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </div>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        htmlFor="lieuNaiss"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Né à
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="lieuNaiss"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="lieuNaiss"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .lieuNaiss
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="dateNaissance"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Date
                                                                        Naissance
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="dateNaissance"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="dateNaiss"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .dateNaiss
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="etatCivile"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Etat
                                                                        civile
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        className={`form-control ${
                                                                            this
                                                                                .state
                                                                                .error_list
                                                                                .etatCivile &&
                                                                            "is-invalid"
                                                                        }`}
                                                                        id="etatCivile"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="etatCivile"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .etatCivile
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="Marié(e)">
                                                                            Marié(e)
                                                                        </option>
                                                                        <option value="Célibataire">
                                                                            Célibataire
                                                                        </option>
                                                                        <option value="veuf(ve)">
                                                                            veuf(ve)
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="condjoint"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Marié(e)
                                                                        à
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="condjoint"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="conjoitName"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .conjoitName
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="nomPere"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Nom du
                                                                        père
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="nomPere"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="fatherName"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .fatherName
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="nomMere"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Nom de
                                                                        la mère
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="nomMere"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="motherName"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .motherName
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="profession"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Profession
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="profession"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="profession"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .profession
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="lieuTravail"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Lieu de
                                                                        travail
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="lieuTravail"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="workingPlace"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .workingPlace
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        htmlFor="civilite"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Civilité
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        id="civilite"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="cilivilty"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .cilivilty
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="Monsieur">
                                                                            Monsieur
                                                                        </option>
                                                                        <option value="Madame">
                                                                            Madame
                                                                        </option>
                                                                        <option value="Ma demoiselle">
                                                                            Ma
                                                                            demoiselle
                                                                        </option>
                                                                        <option value="Groupe solidaire">
                                                                            Groupe
                                                                            solidaire
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="sexe"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Sexe
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        id="sexe"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="sexe"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .sexe
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="M">
                                                                            M
                                                                        </option>
                                                                        <option value="F">
                                                                            F
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="tel1"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Téléphone
                                                                        1
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        className={`form-control ${
                                                                            this
                                                                                .state
                                                                                .error_list
                                                                                .phone1 &&
                                                                            "is-invalid"
                                                                        }`}
                                                                        id="tel1"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="phone1"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .phone1
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="tel2"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Téléphone
                                                                        2
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        className={`form-control ${
                                                                            this
                                                                                .state
                                                                                .error_list
                                                                                .phone1 &&
                                                                            "is-invalid"
                                                                        }`}
                                                                        id="tel2"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="phone2"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .phone2
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="email"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Email
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="email"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="email"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .email
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="typepiece"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Type
                                                                        pièce
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        id="typepiece"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="typepiece"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .typepiece
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="Carte d'électeur">
                                                                            Carte
                                                                            d'électeur
                                                                        </option>
                                                                        <option value="Carte d'éleve/Etudiant">
                                                                            Carte
                                                                            d'éleve/Etudiant
                                                                        </option>
                                                                        <option value="pass port">
                                                                            Pass
                                                                            port
                                                                        </option>
                                                                        <option value="Permis de conduire">
                                                                            Permis
                                                                            de
                                                                            conduire
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="numpiece"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Num
                                                                        pièce
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="numpiece"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="numpiece"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .numpiece
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        htmlFor="delivranceplace"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Délivré
                                                                        à
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="delivranceplace"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="delivrancePlace"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .delivrancePlace
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label
                                                                        htmlFor="delivrancePiece"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Date de
                                                                        délivrance
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="delivrancePiece"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="delivranceDate"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .delivranceDate
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="gestionnaire"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Gestionnaire
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <select
                                                                        id="gestionnaire"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="gestionnaire"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .gestionnaire
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <option value="Sélectionnez">
                                                                            Sélectionnez
                                                                        </option>
                                                                        <option value="DESTIN KASIGWA">
                                                                            DESTIN
                                                                            KASIGWA
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="provinceOrigine"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Province
                                                                        d'origine
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="provinceOrigine"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="provinceOrigine"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .provinceOrigine
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="territoireOrigine"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Térritoire
                                                                        d'origine
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="territoireOrigine"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="territoireOrigine"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .territoireOrigine
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="collectivite"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Collectivité
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="collectivite"
                                                                        style={
                                                                            inputColor
                                                                        }
                                                                        name="collectiviteOrigine"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .collectiviteOrigine
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <label
                                                                        htmlFor="autremention"
                                                                        style={
                                                                            labelColor
                                                                        }
                                                                    >
                                                                        Autres
                                                                        mentions
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    <input
                                                                        id="autremention"
                                                                        style={{
                                                                            height: "40px",
                                                                            border: "1px solid steelblue",
                                                                            padding:
                                                                                "3px",
                                                                        }}
                                                                        name="otherMention"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .otherMention
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChange
                                                                        }
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .disabled
                                                                                ? "disabled"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td>
                                                                    {" "}
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
                                                                        className="btn btn-primary mt-2"
                                                                        id="addMbtn"
                                                                        onClick={
                                                                            this
                                                                                .UpdateMembreData
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
