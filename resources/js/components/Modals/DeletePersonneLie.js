import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class DeletePersonneLie extends React.Component {
    constructor(props) {
        super(props);
        
        this.deletePersonneLie=this.deletePersonneLie.bind(this);
        
          }  
          
           //delete function PERSONNE LIEE
           deletePersonneLie=(idPersonneLie)=>{
             
             axios.delete('delete/personnelie/data/'+idPersonneLie).then((response)=>{
                 if(response.data.success==1){
                    Swal.fire({
                        title:"Success",
                        text:response.data.msg,
                        icon:"success",
                        button:"OK!"
                    })
                 }else{
                    Swal.fire({
                        title:"Error",
                        text:"Ooooops some thing went rwong",
                        icon:"success",
                        button:"OK!"
                    })
                 }
             })  
        }

    render() {

        return (
            <>
                <div className="modal fade" id="modal-delete-personnelie">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 style={{color:"#000"}} className="modal-title">Suppression d'un mendataire</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
             <div className="col-md-12">
                     <form method="POST">
                  <div className="row">
                      <div className="col-md-12">
                        <h4 style={{color:"#000"}}> Etes vous sûr de pouvoir supprimé cette personne liée ?</h4>
                      </div>                   
                  </div>
              </form>
             
              </div>
              </div>

            
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={()=>{ this.deletePersonneLie(this.props.personneLieId) }}>Suppimer</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
             
            </div>
          </div>
        </div>
 
      </div>
            </>
        );
    }
}
