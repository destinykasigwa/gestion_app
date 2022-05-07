import React from "react";
import '../../css/app.css';
import axios from "axios";
import Swal from "sweetalert2";

export default class DepotEspece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled:false,
            isloading: true,
            loading:false,
            dateOuverture:"",
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
        };
        this.actualiser = this.actualiser.bind(this);
    }
      //to refresh
      actualiser() {
        location.reload();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
            document
                .getElementById("modifierbtn")
                .setAttribute("disabled", "disabled");
            document
                .getElementById("validerbtn")
                .setAttribute("disabled", "disabled");
        }, 1000);
        let current_datetime = new Date();
        let formatted_date =
            current_datetime.getDate() +
            "/" +
            (current_datetime.getMonth() + 1) +
            "/" +
            current_datetime.getFullYear();
        this.setState({ dateOuverture: formatted_date });
    }

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
        var inputColor2 = {
            height: "25px",
            border: "1px solid white",
            padding: "3px",
            width: "60px",
        };
        var tableBorder = {
            border: "2px solid #fff",
            fontSize: "10px",
        };
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
                                                            >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </td>
                                                </div>
                                                <div className="input-group input-group-sm ">
                                                    <input
                                                        value={""}
                                                        type="text"
                                                        readOnly
                                                        style={{
                                                            height: "40px",
                                                            background:
                                                                "#dcdcdc",
                                                            border: "4px solid #fff",
                                                        }}
                                                        className="form-control mt-1 font-weight-bold"
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
                                                                disabled
                                                              
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
                                                                name="numCompte"
                                                                value={""}
                                                               
                                                                disabled
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
                                                                value={""}
                                                               
                                                                disabled
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
                                                             onChange={(e) =>
                                                              this.setState({ devise: e.target.value })
                                                            }
                                                                readOnly
                                                                style={inputColor}
                                                                name="devise"
                                                                >
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
                                                                type="text"
                                                                style={inputColor}
                                                                name="numCompte"
                                                                value={""}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                                                value={""}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                                                name="phoneDeposant"
                                                                value={""}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                                                type="text"
                                                                style={inputColor}
                                                                name="montant"
                                                                onChange={(e) =>
                                                                  this.setState({ montantDepot: e.target.value })
                                                                }
                                                                value={this.state.montantDepot}
                                                               
                                                                disabled={
                                                                    this.state
                                                                        .disabled
                                                                        ? "disabled"
                                                                        : ""
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
                                onChange={(e) =>
                                  this.setState({ hundred: e.target.value })
                                }
                                value={this.state.hundred}
                              />
                            </td>
                            <td>{this.state.hundred * 100}</td>
                          </tr>
                          <tr ng-repeat="name in getdrugnameNewArray">
                            <td>50</td>
                            <td>
                              <input
                                type="text"
                                onChange={(e) =>
                                  this.setState({ fitfty: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ twenty: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ ten: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ five: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ oneDollar: e.target.value })
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
                      <table className="tableDepotEspeceCDF">
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
                                onChange={(e) =>
                                  this.setState({ vightMille: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ dixMille: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ cinqMille: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ milleFranc: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({ cinqCentFr: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({
                                    deuxCentFranc: e.target.value,
                                  })
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
                                onChange={(e) =>
                                  this.setState({ centFranc: e.target.value })
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
                                onChange={(e) =>
                                  this.setState({
                                    cinquanteFanc: e.target.value,
                                  })
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
                              id="btnsave"
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
                    </div>
                )}
            </React.Fragment>
        );
    }
}
