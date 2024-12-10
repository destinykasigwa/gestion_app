import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

export default class DeleteMendataire extends React.Component {
    constructor(props) {
        super(props);
        
        this.deleteMendataire=this.deleteMendataire.bind(this);
        
          }  
          
           //delete function mendataire
           deleteMendataire=(idMendataire)=>{
             
             axios.delete('delete/mendataire/data/'+idMendataire).then((response)=>{
                 if(response.data.success==1){
                    Swal.fire({
                        title:"Success",
                        text:response.data.msg,
                        icon:"success",
                        button:"OK!"
                    })
                    console.log(this.props.mendatName)
                 }else{
                    console.log(this.props.mendatName)
                 }
                 console.log(this.props.mendatName)
             })  
        }

    render() {

        return (
            <>
                <div className="modal fade" id="modal-delete-mendataire">
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
                        <h4 style={{color:"#000"}}> Etes vous sûr de pouvoir supprimé ce mendataire ?</h4>
                      </div>                   
                  </div>
              </form>
             
              </div>
              </div>

            
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={()=>{ this.deleteMendataire(this.props.modalId) }}>Suppimer</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
             
            </div>
          </div>
        </div>
 
      </div>
            </>
        );
    }
}
