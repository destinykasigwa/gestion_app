import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class UpdateMembre extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            lieuNaiss:"",
            dateNaiss:"",
            etatCivile:"",
            conjoitName:"",
            fatherName:"",
            motherName:"",
            profession:"",
            workingPlace:"",
            cilivilty:"",
            sexe:"",
            phone1:"243",
            phone2:"243",
            email:"",
            typepiece:"",
            numpiece:"",
            delivrancePlace:"",
            delivranceDate:"",
            gestionnaire:"",
            provinceOrigine:"",
            territoireOrigine:"",
            collectiviteOrigine:"",
            territoireOrigine:"",
            provinceActuelle:"",
            villeActuelle:"",
            CommuneActuelle:"",
            QuartierActuelle:"",
            parainAccount:"",
            parainName:"",
            typeGestion:"",
            critere1:"",
            otherMention:"",
        }
        // this.handleChange=this.handleChange.bind(this);
        // this.UpdateMendataireData=this.UpdateMendataireData.bind(this);
          }
        //get data in input
        // handleChange(event){
        //   this.setState({      
        //   [event.target.name] : event.target.value
        //   })
        //     }
          

        //    static getDerivedStateFromProps(props,current_state){
        //      let mendataireUpdate={
        //         idMendataire:"",
        //         mendataireName:"",
        //         lieuNaissM:"",
        //         dateNaissM:"",
        //         etatCivileM:"",
        //         sexeM:"",
        //         typePieceM:"",
        //         professionM:"",
        //         telephoneM:"",
        //         adresseM:"",
        //         observationM:"",
        //      }
        //      //updating data from input
        //      if(current_state.mendataireName && (current_state.mendataireName !== props.mendatData.mendataireName)){
        //         return null;
        //     }
        //      if(current_state.mendataireName && (current_state.mendataireName !== props.mendatData.mendataireName)){
        //          return null;
        //      }
        //      if(current_state.lieuNaissM && (current_state.lieuNaissM !== props.mendatData.lieuNaissM)){
        //         return null;
        //     }
        //     if(current_state.dateNaissM && (current_state.dateNaissM !== props.mendatData.dateNaissM)){
        //         return null;
        //     }

        //     if(current_state.etatCivileM && (current_state.etatCivileM !== props.mendatData.etatCivileM)){
        //         return null;
        //     }
        //     if(current_state.sexeM && (current_state.sexeM !== props.mendatData.sexeM)){
        //         return null;
        //     }
        //     if(current_state.typePieceM && (current_state.typePieceM !== props.mendatData.typePieceM)){
        //         return null;
        //     }

        //     if(current_state.professionM && (current_state.professionM !== props.mendatData.professionM)){
        //         return null;
        //     }
        //     if(current_state.telephoneM && (current_state.adresseM !== props.mendatData.adresseM)){
        //         return null;
        //     }

        //     if(current_state.adresseM && (current_state.adresseM !== props.mendatData.adresseM)){
        //         return null;
        //     }
        //     if(current_state.observationM && (current_state.observationM !== props.mendatData.observationM)){
        //         return null;
        //     }
        //      //updating data from props below
        //      if(current_state.mendataireName !== props.mendatData.mendataireName || 
        //         current_state.mendataireName === props.mendatData.mendataireName){
        //        mendataireUpdate.mendataireName=props.mendatData.mendataireName; 
        //      }

        //      if(current_state.lieuNaissM !== props.mendatData.lieuNaissM || 
        //         current_state.lieuNaissM === props.mendatData.lieuNaissM){
        //         mendataireUpdate.lieuNaissM=props.mendatData.lieuNaissM; 
        //       }

        //       if(current_state.dateNaissM !== props.mendatData.dateNaissM || 
        //         current_state.dateNaissM === props.mendatData.dateNaissM){
        //         mendataireUpdate.dateNaissM=props.mendatData.dateNaissM; 
        //       }

        //       if(current_state.etatCivileM !== props.mendatData.etatCivileM || 
        //         current_state.etatCivileM === props.mendatData.etatCivileM){
        //         mendataireUpdate.etatCivileM=props.mendatData.etatCivileM; 
        //       }

        //       if(current_state.sexeM !== props.mendatData.sexeM || 
        //         current_state.sexeM === props.mendatData.sexeM){
        //         mendataireUpdate.sexeM=props.mendatData.sexeM; 
        //       }

        //       if(current_state.typePieceM !== props.mendatData.typePieceM || 
        //         current_state.typePieceM === props.mendatData.typePieceM){
        //         mendataireUpdate.typePieceM=props.mendatData.typePieceM; 
        //       }

        //       if(current_state.professionM !== props.mendatData.professionM || 
        //         current_state.professionM === props.mendatData.professionM){
        //         mendataireUpdate.professionM=props.mendatData.professionM; 
        //       }

        //       if(current_state.telephoneM !== props.mendatData.telephoneM || 
        //         current_state.telephoneM === props.mendatData.telephoneM){
        //         mendataireUpdate.telephoneM=props.mendatData.telephoneM; 
        //       }
        //       if(current_state.telephoneM !== props.mendatData.telephoneM || 
        //         current_state.telephoneM === props.mendatData.telephoneM){
        //         mendataireUpdate.telephoneM=props.mendatData.telephoneM; 
        //       }
        //       if(current_state.adresseM !== props.mendatData.adresseM || 
        //         current_state.adresseM === props.mendatData.adresseM){
        //         mendataireUpdate.adresseM=props.mendatData.adresseM; 
        //       }

        //      return mendataireUpdate;
        //    }


              //updating mendataire

        //    UpdateMendataireData=(e)=>{
        //        e.preventDefault();
               
        //      axios.post('update/mendataire/data',{
        //         mendataireId:this.props.modalId,
        //         mendataireName: this.state.mendataireName ,
        //         lieuNaissM:this.state.lieuNaissM,
        //         dateNaissM:this.state.dateNaissM,
        //         etatCivileM:this.state.etatCivileM,
        //         sexeM:this.state.sexeM,
        //         typePieceM:this.state.typePieceM,
        //         professionM:this.state.professionM,
        //         telephoneM:this.state.telephoneM,
        //         adresseM:this.state.adresseM,
        //         observationM:this.state.observationM,
        //      }).then((response)=>{
        //          if(response.data.success==1){
        //             Swal.fire({
        //                 title:"Success",
        //                 text:response.data.msg,
        //                 icon:"success",
        //                 button:"OK!"
        //             })
        //             console.log(this.props.modalId);
        //          }else{
        //              console.log(this.state);
        //          }
        //      })  
        // }

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
        borderRadius:"0px",
        
        
        };
        return (
            <>
                <div className="modal fade" id="modal-update-membre">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 style={{color:"#000"}} className="modal-title">Modification d'un membre <strong> Name here  </strong></h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
             <div className="col-md-12">
             <div
            className="card-body h-200"
            style={{
                background:
                    "#dcdcdc",
            }}
        >
            <form
                method="POST"
                style={{
                    padding:
                        "10px",
                    border: "2px solid #fff",
                }}
            >
                <div className="row">
                    <div className="col-md-4">
                        <table>
                            <tr>
                                <td>
                                    <label
                                        htmlFor="lieuNaiss"
                                        style={
                                            labelColor
                                        }
                                    >
                                        Né
                                        à
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
                                        value={this.state.lieuNaiss ? this.state.lieuNaiss : this.state.fetchData && this.state.fetchData.lieuNaiss}

                                        
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.dateNaiss ? this.state.dateNaiss : this.state.fetchData && this.state.fetchData.dateNaiss}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                          className={`form-control ${this.state.error_list.etatCivile && "is-invalid"}`}
                                        id="etatCivile"
                                        style={
                                            inputColor
                                        }
                                        name="etatCivile"
                                        value={this.state.etatCivile ? this.state.etatCivile : this.state.fetchData && this.state.fetchData.dateNaiss}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                          >
                                        <option value="" >
                                         Sélectionnez
                                        </option>
                                        <option value="Marié(e)" >
                                        Marié(e)
                                        </option>
                                        <option value="Célibataire">Célibataire</option>
                                        <option value="veuf(ve)">veuf(ve)</option>
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
                                        value={this.state.conjoitName ? this.state.conjoitName : this.state.fetchData && this.state.fetchData.conjoitName}
                                       
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        Nom
                                        du
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
                                        value={this.state.fatherName ? this.state.fatherName : this.state.fetchData && this.state.fetchData.fatherName}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        Nom
                                        de
                                        la
                                        mère
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
                                        value={this.state.motherName ? this.state.motherName : this.state.fetchData && this.state.fetchData.motherName}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.profession ? this.state.profession : this.state.fetchData && this.state.fetchData.profession}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {" "}
                                    <label
                                        htmlFor="lieuTravail"
                                        style={
                                            labelColor
                                        }
                                    >
                                        Lieu
                                        de
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
                                        value={this.state.workingPlace ? this.state.workingPlace : this.state.fetchData && this.state.fetchData.workingPlace}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.cilivilty ? this.state.cilivilty : this.state.fetchData && this.state.fetchData.cilivilty}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="Monsieur">Monsieur</option>
                                        <option value="Madame">Madame</option>
                                        <option value="Ma demoiselle">Ma demoiselle</option>
                                        <option value="Groupe solidaire">Groupe solidaire</option>
                                        
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
                                        value={this.state.sexe ? this.state.sexe : this.state.fetchData && this.state.fetchData.sexe}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                      className={`form-control ${this.state.error_list.phone1 && "is-invalid"}`}
                                        id="tel1"
                                        style={
                                            inputColor
                                        }
                                        name="phone1"
                                        value={this.state.phone1 ? this.state.phone1 : this.state.fetchData && this.state.fetchData.phone1}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                      className={`form-control ${this.state.error_list.phone1 && "is-invalid"}`}
                                        id="tel2"
                                        style={
                                            inputColor
                                        }
                                        name="phone2"
                                        value={this.state.phone2 ? this.state.phone2 : this.state.fetchData && this.state.fetchData.phone2}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.email ? this.state.email : this.state.fetchData && this.state.fetchData.email}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.typepiece ? this.state.typepiece : this.state.fetchData && this.state.fetchData.typepiece}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="Carte d'électeur">Carte d'électeur</option>
                                        <option value="Carte d'éleve/Etudiant">Carte d'éleve/Etudiant</option>
                                        <option value="pass port">Pass port</option>
                                        <option value="Permis de conduire">Permis de conduire</option>
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
                                        value={this.state.numpiece ? this.state.numpiece : this.state.fetchData && this.state.fetchData.numpiece}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                    />
                                </td>
                            </tr>
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
                                        value={this.state.delivrancePlace ? this.state.delivrancePlace : this.state.fetchData && this.state.fetchData.delivrancePlace}

                               
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        htmlFor="delivrancePiece"
                                        style={
                                            labelColor
                                        }
                                    >
                                        Date
                                        de
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
                                       
                                        value={this.state.delivranceDate ? this.state.delivranceDate : this.state.fetchData && this.state.fetchData.delivranceDate}
                                         
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.gestionnaire ? this.state.gestionnaire : this.state.fetchData && this.state.fetchData.gestionnaire}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                        >
                                         <option value="Sélectionnez">Sélectionnez</option>
                                        <option value="DESTIN KASIGWA">
                                        DESTIN KASIGWA
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
                                        value={this.state.provinceOrigine ? this.state.provinceOrigine : this.state.fetchData && this.state.fetchData.provinceOrigine}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.territoireOrigine ? this.state.territoireOrigine : this.state.fetchData && this.state.fetchData.territoireOrigine}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.collectiviteOrigine ? this.state.collectiviteOrigine : this.state.fetchData && this.state.fetchData.collectiviteOrigine}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
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
                                        value={this.state.otherMention ? this.state.otherMention : this.state.fetchData && this.state.fetchData.otherMention}

                                        onChange={this.handleChange}
                                        disabled={this.state.disabled ? "disabled" : ""}
                                    />
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
