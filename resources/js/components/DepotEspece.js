import React from "react";
import '../../css/app.css';
import axios from "axios";
import Swal from "sweetalert2";

export default class DepotEspece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled:true,
            isloading: true,
            loading:false,
            DateTransaction:"",
            hundred: 0,
            fitfty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            oneDollar: 0,
            montantDepot: 0,
            devise: "",
            numcompte: "",
            commission: 0,
            intitule: "",
            vightMille: 0,
            dixMille: 0,
            cinqMille: 0,
            milleFranc: 0,
            cinqCentFr: 0,
            deuxCentFranc: 0,
            centFranc: 0,
            cinquanteFanc: 0,
            telDeposant:"",
            deposantName:"",
            codeAgence:"20",
            libelle:"",
            error_list: [],
            taux:"2000",
            fetchData: null,
            compteToSearch:"",
            refCompte:""
            
        };
        this.actualiser = this.actualiser.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleAccount=this.handleAccount.bind(this);
    }
      //to refresh
      actualiser() {
        location.reload();
    }


     //GET DATA FROM INPUT
     handleChange(event) {
      this.setState({
          // Computed property names
          // keys of the objects are computed dynamically
          [event.target.name]: event.target.value,
      });
  }




    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
                document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
        }, 1000);
        let current_datetime = new Date();
        let formatted_date =
             //year
            current_datetime.getFullYear()  +
            "-" +
            //month
            (current_datetime.getMonth() + 1) +
            "-" +
            //day
            current_datetime.getDate()  ;
        this.setState({ DateTransaction: formatted_date });
    }

    saveOperation=async(e)=>{
      e.preventDefault();
      const res = await axios.post("/depot/espece", this.state);
       this.setState({loading:true})
      if (res.data.success == 1) {
          Swal.fire({
              title: "Success",
              text:
                  res.data.msg,
              icon: "success",
              button: "OK!",
          });
          this.setState({ disabled: !this.state.disabled,loading:false});
      } else {
          this.setState({
              error_list: res.data.validate_error,
          });
      }
      console.log(res.data.success);
    }

    //GET A SEACHED NUMBER 
    handleAccount = async (e) => {
      e.preventDefault();
      const getData = await axios.get(
          "compte/search/" + this.state.compteToSearch
      );
      if (getData.data.success == 1) {
          this.setState({ fetchData: getData.data.data });
          this.setState({ disabled: !this.state.disabled,refCompte:this.state.fetchData.refCompte });
          //  console.log(this.state.fetchData);
          //disabled valider button
          document
              .getElementById("validerbtn")
              .removeAttribute("disabled", "disabled");
      } else {
          Swal.fire({
              title: "Erreur",
              text: getData.data.msg,
              icon: "error",
              button: "OK!",
          });
      }
      console.log(this.state.fetchData);
  };
 
    render() {
        var myspinner = {
            margin: "5px auto",
            width: "3rem",
            height: "3rem",
            marginTop: "180px",
            border: "0px",
            height: "200px",
        };
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
        // var inputColor2 = {
        //     height: "25px",
        //     border: "1px solid white",
        //     padding: "3px",
        //     width: "60px",
        // };
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "16px",
        };
        let compteur=1;
        return (
            <React.Fragment>
                {this.state.isloading ? (
                    <div className="row" id="rowspinner">
                        <div className="myspinner" style={myspinner}>
                            <span
                                className="spinner-border"
                                role="status"
                            ></span>
                            <span style={{ marginLeft: "-20px" }}>
                                Chargement...
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-12 card">
                            <div className="card card-default">
                                <div
                                    className="card-header"
                                    style={{
                                        background: "#DCDCDC",
                                        textAlign: "center",
                                        color: "#fff",
                                        marginTop: "5px",
                                    }}
                                >
                                    <button
                                        style={{
                                            height: "30px",
                                            float: "right",
                                            background: "green",
                                            border: "0px",
                                            padding: "3px",
                                            marginLeft: "5px",
                                        }}
                                        onClick={this.actualiser}
                                    >
                                        <i className="fas fa-sync"></i>{" "}
                                        Actualiser{" "}
                                    </button>
                                </div>

                                <div
                                    className="card-body"
                                    style={{ background: "#dcdcdc" }}
                                   >
                                   <div
                                        className="row"
                                        style={{
                                            padding: "10px",
                                            border: "2px solid #fff",
                                        }}
                                    >
                                        <div className="col-md-2">
                                            <form
                                                style={{
                                                    padding: "10px",
                                                    border: "2px solid #fff",
                                                }}
                                            >
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Numéro compte..."
                                                        name="compteToSearch"
                                                        value={
                                                          this.state
                                                              .compteToSearch
                                                      }
                                                      onChange={
                                                          this.handleChange
                                                      }
                                                    />
                                                    <td>
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
                                                            className="btn btn-primary"
                                                            onClick={this.handleAccount}
                                                            >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </td>
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        style={{
                                                            height: "40px",
                                                            background:
                                                                "#dcdcdc",
                                                            border: "4px solid #fff",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"

                                                        value={
                                                          this.state
                                                              .fetchData &&
                                                          this.state.fetchData
                                                              .numCompte
                                                      }
                                                    />
                                                </div>
                                            </form>
                                        </div>


                                        {/* separate */}

                                        <div className="col-md-4">
                                        <div className="card-body" style={{ background: "#dcdcdc" }}>
                                            <form>
                                                <table >
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Intitulé c.
                                                            </label>
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                            
                                                                name="intituleCompte"
                                                                value={
                                                                  this
                                                                      .state
                                                                      .otherMention
                                                                      ? this
                                                                            .state
                                                                            .intituleCompte
                                                                      : this
                                                                            .state
                                                                            .fetchData &&
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            .intituleCompte
                                                              }
                                                                
                                                                disabled
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                              
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Code A.
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                        <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                                name="codeAgence"
                                                                value={this.state.codeAgence}
                                                               
                                                                disabled
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                            />
                                                        </div>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                                Compte
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius:
                                                                        "0px",
                                                                }}
                                                                name="numCompte"
                                                               
                                                                    value={
                                                                  this
                                                                      .state
                                                                      .numcompte
                                                                      ? this
                                                                            .state
                                                                            .numcompte
                                                                      : this
                                                                            .state
                                                                            .fetchData &&
                                                                        this
                                                                            .state
                                                                            .fetchData
                                                                            .numCompte
                                                              }
                                                                disabled
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                            />
                                                        </div>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        </div>
                                       
                                    </div>

                                    <div
                                        className="row"
                                        style={{
                                            padding: "10px",
                                            border: "2px solid #fff",
                                        }}
                                        >
                                       
                                        <div className="col-md-4" style={{ background: "#fff",padding:"5px" }}>
                                          <form>
                                            <table>
                                                      <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                              Devise
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <select
                                                            name="devise"
                                                             className={`form-control ${
                                                              this.state
                                                                  .error_list
                                                                  .devise &&
                                                              "is-invalid"
                                                          }`}
                                                                 onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                                readOnly
                                                                style={inputColor}
                                                                value={this.state.devise}
                                                                >
                                                                 <option value="">
                                                                   Sélectionnez
                                                                </option>
                                                                <option value="CDF">
                                                                    CDF
                                                                </option>
                                                                <option value="USD">
                                                                    USD
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </tr>
                                                      <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                              Libellé
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                            name="libelle"
                                                            className={`form-control ${
                                                              this.state
                                                                  .error_list
                                                                  .libelle &&
                                                              "is-invalid"
                                                          }`}
                                                                type="text"
                                                                style={inputColor}
                                                                
                                                                value={this.state.libelle}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                              Nom du déposant
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={inputColor}
                                                                name="deposantName"
                                                                value={this.state.deposantName}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                 onChange={
                                                                    this
                                                                        .handleChange
                                                                }
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                              Tél déposant
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                                type="text"
                                                                style={inputColor}
                                                                name="telDeposant"
                                                                value={this.state.telDeposant}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                             
                                                            />
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                style={
                                                                    labelColor
                                                                }
                                                            >
                                                             Montant
                                                            </label>{" "}
                                                        </td>
                                                        <div className="input-group input-group-sm ">
                                                            <input
                                                              name="montantDepot"
                                                            className={`form-control ${
                                                              this.state
                                                                  .error_list
                                                                  .montantDepot &&
                                                              "is-invalid"
                                                          }`}
                                                                type="text"
                                                                style={inputColor}
                                                              
                                                                value={this.state.montantDepot}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                onChange={
                                                                  this
                                                                      .handleChange
                                                              }
                                                            />
                                                        </div>
                                                    </tr>
                                                    </table>
                                                    </form>
                                                    </div>                                            
                                        <div className="col-md-6">                                 

                <div className="card-body" style={{ background: "#fff" }}>
                  {this.state.devise === "USD" ? (
                    <form method="POST" style={{ height: "auto" }}>
                      <table className="tableDepotEspece">
                        <thead>
                          <tr>
                            <th class="col-md-4">Coupures</th>
                            <th class="col-md-4">Nbr Billets</th>
                            <th class="col-md-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>100</td>
                            <td>
                              <input
                                type="text"
                                name="hundred"
                                value={this.state.hundred}
                                onChange={
                                  this
                                      .handleChange
                                 }
                              />
                            </td>
                            <td>{this.state.hundred * 100}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>50</td>
                            <td>
                              <input
                                type="text"
                                name="fitfty"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.fitfty}
                              />
                            </td>
                            <td>{this.state.fitfty * 50}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>20</td>
                            <td>
                              <input
                                type="text"
                                name="twenty"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.twenty}
                              />
                            </td>
                            <td>{this.state.twenty * 20}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>10</td>
                            <td>
                              <input
                                type="text"
                                name="ten"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.ten}
                              />
                            </td>
                            <td>{this.state.ten * 10}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>5</td>
                            <td>
                              <input
                                type="text"
                                name="five"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.five}
                              />
                            </td>
                            <td>{this.state.five * 5}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>1</td>
                            <td>
                              <input
                                type="text"
                                name="oneDollar"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.oneDollar}
                              />
                            </td>
                            <td>{this.state.oneDollar * 1}</td>
                          </tr>
                          <tr style={{ padding: "10px" }}>
                            <th>Total</th>
                            <th>
                              {" "}
                              {parseInt(this.state.hundred) +
                                parseInt(this.state.fitfty) +
                                parseInt(this.state.twenty) +
                                parseInt(this.state.ten) +
                                parseInt(this.state.five) +
                                parseInt(this.state.oneDollar)}{" "}
                            </th>
                            <th
                              style={{
                                fontSize: "25px",
                                background: "green",
                                color: "#fff",
                              }}
                            >
                              {" "}
                              {this.state.hundred * 100 +
                                this.state.fitfty * 50 +
                                this.state.twenty * 20 +
                                this.state.ten * 10 +
                                this.state.five * 5 +
                                this.state.oneDollar * 1}{" "}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  ) : (
                    <form method="POST" style={{ height: "340px" }}>
                      <table className="tableDepotEspece">
                        <thead>
                          <tr>
                            <th class="col-md-4">Coupures</th>
                            <th class="col-md-4">Nbr Billets</th>
                            <th class="col-md-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>20000</td>
                            <td>
                              <input
                                type="text"
                                name="vightMille"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.vightMille}
                              />
                            </td>
                            <td>{this.state.vightMille * 20000}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>10000</td>
                            <td>
                              <input
                                type="text"
                                name="dixMille"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.dixMille}
                              />
                            </td>
                            <td>{this.state.dixMille * 10000}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>5000</td>
                            <td>
                              <input
                                type="text"
                                name="cinqMille"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.cinqMille}
                              />
                            </td>
                            <td>{this.state.cinqMille * 5000}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>1000</td>
                            <td>
                              <input
                                type="text"
                                name="milleFranc"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.milleFranc}
                              />
                            </td>
                            <td>{this.state.milleFranc * 1000}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>500</td>
                            <td>
                              <input
                                type="text"
                                name="cinqCentFr"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.cinqCentFr}
                              />
                            </td>
                            <td>{this.state.cinqCentFr * 500}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>200</td>
                            <td>
                              <input
                                type="text"
                                name="deuxCentFranc"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.deuxCentFranc}
                              />
                            </td>
                            <td>{this.state.deuxCentFranc * 200}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>100</td>
                            <td>
                              <input
                                type="text"
                                name="centFranc"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.centFranc}
                              />
                            </td>
                            <td>{this.state.centFranc * 100}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>50</td>
                            <td>
                              <input
                                type="text"
                                name="cinquanteFanc"
                                onChange={
                                  this
                                      .handleChange
                                 }
                                value={this.state.cinquanteFanc}
                              />
                            </td>
                            <td>{this.state.cinquanteFanc * 50}</td>
                          </tr>
                          <tr style={{ padding: "10px" }}>
                            <th>Total</th>
                            <th>
                              {" "}
                              {parseInt(this.state.vightMille) +
                                parseInt(this.state.dixMille) +
                                parseInt(this.state.cinqMille) +
                                parseInt(this.state.milleFranc) +
                                parseInt(this.state.cinqCentFr) +
                                parseInt(this.state.deuxCentFranc) +
                                parseInt(this.state.centFranc) +
                                parseInt(this.state.cinquanteFanc)}{" "}
                            </th>
                            <th
                              style={{
                                fontSize: "25px",
                                background: "green",
                                color: "#fff",
                              }}
                            >
                              {" "}
                              {this.state.vightMille * 20000 +
                                this.state.dixMille * 10000 +
                                this.state.cinqMille * 5000 +
                                this.state.milleFranc * 1000 +
                                this.state.cinqCentFr * 500 +
                                this.state.deuxCentFranc * 200 +
                                this.state.centFranc * 100 +
                                this.state.cinquanteFanc * 50}{" "}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  )}
                </div>
              </div>
             
                    <div className="col-md-2" style={{ background: "#fff",padding:"5px" }}>
                        <tr>
                        <td style={{padding:"2px"}}>
                          {this.state.hundred * 100 +
                            this.state.fitfty * 50 +
                            this.state.twenty * 20 +
                            this.state.ten * 10 +
                            this.state.five * 5 +
                            this.state.oneDollar * 1 ===
                            parseInt(this.state.montantDepot) ||
                          this.state.vightMille * 20000 +
                            this.state.dixMille * 10000 +
                            this.state.cinqMille * 5000 +
                            this.state.milleFranc * 1000 +
                            this.state.cinqCentFr * 500 +
                            this.state.deuxCentFranc * 200 +
                            this.state.centFranc * 100 +
                            this.state.cinquanteFanc * 50 ===
                            parseInt(this.state.montantDepot) ? (
                            <button
                            style={{
                              borderRadius:
                                  "0px",
                              width: "100%",
                              height: "30px",
                              fontSize:
                                  "12px",
                                }}
                              className="btn btn-primary"
                              id="validerbtn"
                              onClick={this.saveOperation}
                            >
                              <i className={`${this.state.loading ? "spinner-border spinner-border-sm":"fas fa-check"}`}></i> Valider {""}
                              {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                            </button>
                          ) : (
                            <button
                            style={{
                              borderRadius:
                                  "0px",
                              width: "100%",
                              height: "30px",
                              fontSize:
                                  "12px",
                                }}
                              className="btn btn-primary"
                              disabled
                            >
                              <i className="fas fa-check"></i> Valider {""}
                              {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                            </button>
                          )}
                        </td>
                        
                      </tr>
                      <tr>
                      <td style={{padding:"2px"}}>
                          {this.state.disabled ? (
                            <button
                            style={{
                              borderRadius:
                                  "0px",
                              width: "100%",
                              height: "30px",
                              fontSize:
                                  "12px",
                                }}
                              className="btn btn-primary"
                              disabled
                            >
                              <i className="fas fa-print"></i> Imprimer {""}
                            </button>
                          ) : (
                            <button
                            style={{
                              borderRadius:
                                  "0px",
                              width: "100%",
                              height: "30px",
                              fontSize:
                                  "12px",
                                }}
                              className="btn btn-primary"
                            >
                              <i className="fas fa-print"></i> Imprimer {""}
                            </button>
                          )}
                        </td>
                      </tr>
                        </div>
                         </div>
                         </div>
                            </div>
                        </div>
                        <div className="container-fluid">
                          <div className="row" style={{border:"4px solid #dcdcdc"}}> 
                          <h3 className="text-muted">Billetage</h3>
                                    <div className="col-md-6">
                                        <table
                                            className="table"
                                            style={{background:"#dcdcdc"}}
                                        >
                                          <thead>
                                            <th style={
                                                tableBorder
                                            }>Num</th>
                                            <th style={
                                                tableBorder
                                            }>Coupure</th>
                                            <th style={
                                                tableBorder
                                            }>Nombre</th>
                                            <th style={
                                                tableBorder
                                            }>Montant</th>
                                          </thead>
                                           <tr>
                                             <td className="col-md-1">
                                               {compteur++}
                                             </td>
                                           <td
                                           
                                            style={
                                                tableBorder
                                            }
                                        >
                                            20 000 x
                                        </td>
                                        <td
                                       
                                            style={
                                                tableBorder
                                            }
                                            >
                                          1
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                                  
                                             
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                               >
                                          
                                            10 000 x
                                        </td> 
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                         2
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                            5000 x
                                        </td>
                                       
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                        3
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                           1000 x
                                        </td>
                                       
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          4
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                        >
                                           500 x
                                        </td>
                                      
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          5
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                           >
                                           200 x
                                        </td>
                                      
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          6
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                            100 x
                                        </td>
                                       
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          7
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                           </tr>
                                            
                                           <tr>
                                           <td>
                                               {compteur++}
                                             </td>
                                           <td
                                            style={
                                                tableBorder
                                            }
                                           >
                                           50 x
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          8
                                        </td>
                                        <td
                                            style={
                                                tableBorder
                                            }
                                            >
                                          Montant
                                        </td>
                                      
                                           </tr>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                    <h3 className="text-muted">Opérations recentes</h3>
                                    <table
                                            className="table"
                                            style={{background:"#dcdcdc"}}
                                        >
                                          <thead>
                                            <th style={
                                                tableBorder
                                            }>#</th>
                                            <th style={
                                                tableBorder
                                            }>numCompte</th>
                                            <th style={
                                                tableBorder
                                            }>Montant Débit</th>
                                            <th style={
                                                tableBorder
                                            }>Montant Crédit</th>
                                            <th style={
                                                tableBorder
                                            }>Libellé</th>
                                          </thead>
                                          <tr>
                                            <td style={
                                                tableBorder
                                            }>{compteur++}</td>
                                             <td style={
                                                tableBorder
                                            }>3496</td>
                                            <td style={
                                                tableBorder
                                            }>5000</td>
                                            <td style={
                                                tableBorder
                                            }>4000</td>
                                            <td style={
                                                tableBorder
                                            }>RETRAIT ESPECE</td>
                                          </tr>





                                         </table>


                                    </div>
                                    </div>
                                </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
