import React from "react";
import axios from "axios";
export default class PrintRecuDepot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: true,
            getDataCDF: null,
            getDataUSD: null,
        };
        this.PrintBtn = this.PrintBtn.bind(this);
        this.actualiser = this.actualiser.bind(this);
        this.dispalyRecuDepot = this.dispalyRecuDepot.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isloading: false });
        }, 1000);
        this.dispalyRecuDepot();
    }
    dispalyRecuDepot = async () => {
        const res = await axios.get("rapport/recu/depot");
        if (res.data.devise == 1) {
            this.setState({
                getDataUSD: res.data.dataDepotUSD,
            });
        } else if (res.data.devise == 2) {
            this.setState({
                getDataCDF: res.data.dataDepotCDF,
            });
        }
    };

    PrintBtn(e) {
        e.preventDefault();
        const printableElements = document.getElementById("printme").innerHTML;
        const orderHtml =
            "<html ><head><title></title>  </head><body>" +
            printableElements +
            "</body></html>";
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        document.body.innerHTML = oldPage;
    }

    actualiser() {
        location.reload();
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

        const dateParser = (num) => {
            const options = {
                // weekday: "long",
                year: "numeric",
                month: "numeric",
                day: "numeric",
            };

            let timestamp = Date.parse(num);

            let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

            return date.toString();
        };

        // PERMET DE FORMATER LES CHIFFRES

        // const numberFormat = (number=0)=>{
        //   var locales =
        //    [
        //     undefined,  // Your own browser
        //     'en-US',    // United States
        //     'de-DE',    // Germany
        //     'ru-RU',    // Russia
        //     'hi-IN',    // India
        //   ];
        //   var opts = { minimumFractionDigits: 2 };
        //   var index=3
        //   var nombre=number.toLocaleString(locales[index], opts);
        //   return nombre;
        // }

        // let compteur=1;
        // JavaScript Document
        /****************************************************************************
         *________________________________________________________________________	*
         *	About 		:	Convertit jusqu'à  999 999 999 999 999 (billion)		*
         *					avec respect des accords								*
         *_________________________________________________________________________	*
         *	Auteur  	:	GALA OUSSE Brice, Engineer programmer of management		*
         *	Mail    	:	bricegala@yahoo.fr, bricegala@gmail.com					*
         *	Tél	    	:	+237 99 37 95 83 / +237 79 99 82 80						*
         *	Copyright 	:	avril  2007												*
         *_________________________________________________________________________	*
         *****************************************************************************
         */
        function Unite(nombre) {
            var unite;
            switch (nombre) {
                case 0:
                    unite = "zéro";
                    break;
                case 1:
                    unite = "un";
                    break;
                case 2:
                    unite = "deux";
                    break;
                case 3:
                    unite = "trois";
                    break;
                case 4:
                    unite = "quatre";
                    break;
                case 5:
                    unite = "cinq";
                    break;
                case 6:
                    unite = "six";
                    break;
                case 7:
                    unite = "sept";
                    break;
                case 8:
                    unite = "huit";
                    break;
                case 9:
                    unite = "neuf";
                    break;
            } //fin switch
            return unite;
        } //-----------------------------------------------------------------------

        function Dizaine(nombre) {
            let dizaine = "";
            switch (nombre) {
                case 10:
                    dizaine = "dix";
                    break;
                case 11:
                    dizaine = "onze";
                    break;
                case 12:
                    dizaine = "douze";
                    break;
                case 13:
                    dizaine = "treize";
                    break;
                case 14:
                    dizaine = "quatorze";
                    break;
                case 15:
                    dizaine = "quinze";
                    break;
                case 16:
                    dizaine = "seize";
                    break;
                case 17:
                    dizaine = "dix-sept";
                    break;
                case 18:
                    dizaine = "dix-huit";
                    break;
                case 19:
                    dizaine = "dix-neuf";
                    break;
                case 20:
                    dizaine = "vingt";
                    break;
                case 30:
                    dizaine = "trente";
                    break;
                case 40:
                    dizaine = "quarante";
                    break;
                case 50:
                    dizaine = "cinquante";
                    break;
                case 60:
                    dizaine = "soixante";
                    break;
                case 70:
                    dizaine = "soixante-dix";
                    break;
                case 80:
                    dizaine = "quatre-vingt";
                    break;
                case 90:
                    dizaine = "quatre-vingt-dix";
                    break;
            } //fin switch
            return dizaine;
        } //-----------------------------------------------------------------------

        function NumberToLetter(nombre) {
            var i, j, n, quotient, reste, nb;
            var ch;
            var numberToLetter = "";
            //__________________________________

            if (nombre.toString().replace(/ /gi, "").length > 15)
                return "dépassement de capacité";
            if (isNaN(nombre.toString().replace(/ /gi, "")))
                return "Nombre non valide";

            nb = parseFloat(nombre.toString().replace(/ /gi, ""));
            if (Math.ceil(nb) != nb) return "Nombre avec virgule non géré.";

            n = nb.toString().length;
            switch (n) {
                case 1:
                    numberToLetter = Unite(nb);
                    break;
                case 2:
                    if (nb > 19) {
                        quotient = Math.floor(nb / 10);
                        reste = nb % 10;
                        if (nb < 71 || (nb > 79 && nb < 91)) {
                            if (reste == 0)
                                numberToLetter = Dizaine(quotient * 10);
                            if (reste == 1)
                                numberToLetter =
                                    Dizaine(quotient * 10) +
                                    "-et-" +
                                    Unite(reste);
                            if (reste > 1)
                                numberToLetter =
                                    Dizaine(quotient * 10) + "-" + Unite(reste);
                        } else
                            numberToLetter =
                                Dizaine((quotient - 1) * 10) +
                                "-" +
                                Dizaine(10 + reste);
                    } else numberToLetter = Dizaine(nb);
                    break;
                case 3:
                    quotient = Math.floor(nb / 100);
                    reste = nb % 100;
                    if (quotient == 1 && reste == 0) numberToLetter = "cent";
                    if (quotient == 1 && reste != 0)
                        numberToLetter = "cent" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = Unite(quotient) + " cents";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            Unite(quotient) + " cent " + NumberToLetter(reste);
                    break;
                case 4:
                    quotient = Math.floor(nb / 1000);
                    reste = nb - quotient * 1000;
                    if (quotient == 1 && reste == 0) numberToLetter = "mille";
                    if (quotient == 1 && reste != 0)
                        numberToLetter = "mille" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " mille";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " mille " +
                            NumberToLetter(reste);
                    break;
                case 5:
                    quotient = Math.floor(nb / 1000);
                    reste = nb - quotient * 1000;
                    if (quotient == 1 && reste == 0) numberToLetter = "mille";
                    if (quotient == 1 && reste != 0)
                        numberToLetter = "mille" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " mille";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " mille " +
                            NumberToLetter(reste);
                    break;
                case 6:
                    quotient = Math.floor(nb / 1000);
                    reste = nb - quotient * 1000;
                    if (quotient == 1 && reste == 0) numberToLetter = "mille";
                    if (quotient == 1 && reste != 0)
                        numberToLetter = "mille" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " mille";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " mille " +
                            NumberToLetter(reste);
                    break;
                case 7:
                    quotient = Math.floor(nb / 1000000);
                    reste = nb % 1000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un million";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un million" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " millions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " millions " +
                            NumberToLetter(reste);
                    break;
                case 8:
                    quotient = Math.floor(nb / 1000000);
                    reste = nb % 1000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un million";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un million" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " millions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " millions " +
                            NumberToLetter(reste);
                    break;
                case 9:
                    quotient = Math.floor(nb / 1000000);
                    reste = nb % 1000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un million";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un million" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " millions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " millions " +
                            NumberToLetter(reste);
                    break;
                case 10:
                    quotient = Math.floor(nb / 1000000000);
                    reste = nb - quotient * 1000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un milliard";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un milliard" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter =
                            NumberToLetter(quotient) + " milliards";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " milliards " +
                            NumberToLetter(reste);
                    break;
                case 11:
                    quotient = Math.floor(nb / 1000000000);
                    reste = nb - quotient * 1000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un milliard";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un milliard" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter =
                            NumberToLetter(quotient) + " milliards";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " milliards " +
                            NumberToLetter(reste);
                    break;
                case 12:
                    quotient = Math.floor(nb / 1000000000);
                    reste = nb - quotient * 1000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un milliard";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un milliard" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter =
                            NumberToLetter(quotient) + " milliards";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " milliards " +
                            NumberToLetter(reste);
                    break;
                case 13:
                    quotient = Math.floor(nb / 1000000000000);
                    reste = nb - quotient * 1000000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un billion";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un billion" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " billions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " billions " +
                            NumberToLetter(reste);
                    break;
                case 14:
                    quotient = Math.floor(nb / 1000000000000);
                    reste = nb - quotient * 1000000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un billion";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un billion" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " billions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " billions " +
                            NumberToLetter(reste);
                    break;
                case 15:
                    quotient = Math.floor(nb / 1000000000000);
                    reste = nb - quotient * 1000000000000;
                    if (quotient == 1 && reste == 0)
                        numberToLetter = "un billion";
                    if (quotient == 1 && reste != 0)
                        numberToLetter =
                            "un billion" + " " + NumberToLetter(reste);
                    if (quotient > 1 && reste == 0)
                        numberToLetter = NumberToLetter(quotient) + " billions";
                    if (quotient > 1 && reste != 0)
                        numberToLetter =
                            NumberToLetter(quotient) +
                            " billions " +
                            NumberToLetter(reste);
                    break;
            } //fin switch
            /*respect de l'accord de quatre-vingt*/
            if (
                numberToLetter.substr(
                    numberToLetter.length - "quatre-vingt".length,
                    "quatre-vingt".length
                ) == "quatre-vingt"
            )
                numberToLetter = numberToLetter + "s";

            return numberToLetter;
        } //-----------------------------------------------------------------------

        // console.log(NumberToLetter(400));
        return (
            <React.Fragment>
                {this.state.isloading ? (
                    <div className="row" id="rowspinner">
                        <div class="myspinner" style={myspinner}>
                            <span class="spinner-border" role="status"></span>
                            <span style={{ marginLeft: "-20px" }}>
                                Chargement...
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card card-default">
                                <div
                                    className="card-header"
                                    style={{
                                        background: "dcdcdc",
                                        textAlign: "center",
                                        color: "#000",
                                    }}
                                >
                                    <h3 className="card-title">
                                        {/* <b>BORDEREAU DE RETRAIT</b> */}
                                    </h3>
                                    <button
                                        style={{
                                            height: "30px",
                                            float: "right",
                                            background: "green",
                                            border: "0px",
                                            padding: "3px",
                                        }}
                                        onClick={this.actualiser}
                                    >
                                        <i class="fas fa-sync"></i> Actualiser{" "}
                                    </button>
                                </div>

                                {/* <div
                                    className="card-body"
                                    style={{ background: "#dcdcdc" }}
                                >
                                    <form method="POST">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                style={{
                                                                    height: "33px",
                                                                    border: "1px solid steelblue",
                                                                }}
                                                                type="text"
                                                                placeholder="N° Opération"
                                                                onChange={(e) =>
                                                                    this.setState(
                                                                        {
                                                                            numOperation:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <button
                                                                type="submit"
                                                                name="submitLiberation"
                                                                style={{
                                                                    padding:
                                                                        "6px",
                                                                    color: "#fff",
                                                                    fontWeight:
                                                                        "bold",
                                                                    background:
                                                                        " rgb(20,40,100)",
                                                                    border: "0px",
                                                                }}
                                                                className="btn "
                                                                onClick={
                                                                    this
                                                                        .dispalyRecuRetrait
                                                                }
                                                            >
                                                                <i className="fas fa-desktop"></i>{" "}
                                                                Afficher
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </form>
                                </div> */}

                                <React.Fragment>
                                    <hr class="solid" />

                                    <div>
                                        {this.state.getDataCDF ? (
                                            <div className="row" id="printme">
                                                <div
                                                    className="card"
                                                    style={{
                                                        margin: "5px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <div
                                                        className="logo-container"
                                                        style={{
                                                            // margin: "0 auto",
                                                            width: "40%",
                                                        }}
                                                    >
                                                        {" "}
                                                        <br />
                                                        <br />
                                                        {/* <div style={{ textAlign: "center" }}><h4><b>ACTION POUR LA PAIX L'EDUCATION ET LE DEFENSE DES DROITS HUMAINS</b></h4></div> */}
                                                        <table
                                                            id="table"
                                                            class="table-responsive"
                                                            align="center"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <tr>
                                                                <td>
                                                                    {" "}
                                                                    <img
                                                                        style={{
                                                                            width: "50%",
                                                                            height: "90px",
                                                                        }}
                                                                        src="dist/img/ihdlogo.jpg"
                                                                    />
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        border: "0px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <h3>
                                                                            «I.H.D»
                                                                        </h3>
                                                                        <p>
                                                                            Goma
                                                                            RDC{" "}
                                                                            <br />
                                                                            Téléphone:
                                                                            +243999869620{" "}
                                                                            <br />
                                                                            Courriel:
                                                                            info@ihdemunis.org{" "}
                                                                            <br />
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td align="right">
                                                                    <div
                                                                        style={{
                                                                            marginLeft:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        <h4>
                                                                            <b>
                                                                                <img
                                                                                    style={{
                                                                                        width: "50%",
                                                                                        height: " 90px",
                                                                                    }}
                                                                                    src="dist/img/ihdlogo.jpg"
                                                                                />
                                                                            </b>
                                                                        </h4>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div
                                                        className="row"
                                                        style={{
                                                            // margin: "0px auto",
                                                            marginTop: "5px",
                                                            width: "300px",
                                                        }}
                                                    >
                                                        {" "}
                                                        <h5
                                                            style={{
                                                                background:
                                                                    "#dcdcdc",
                                                                padding: "5px",
                                                                color: "#000",
                                                                fontSize:
                                                                    "16px",
                                                                marginBottom:
                                                                    "-30px",
                                                                marginLeft:
                                                                    "30px",
                                                                marginRight:
                                                                    "30px",
                                                            }}
                                                        >
                                                            BORDEREAU DE DEPOT
                                                            N°{" "}
                                                            {
                                                                this.state
                                                                    .getDataCDF
                                                                    .refOperation
                                                            }
                                                        </h5>{" "}
                                                    </div>

                                                    <div
                                                        class="card-body"
                                                        style={{
                                                            marginLeft: "2px",
                                                            marginRight: "2px",
                                                            marginTop: "30px",
                                                        }}
                                                    >
                                                        <div
                                                            className="row entete-recu"
                                                            style={{
                                                                width: "40%",
                                                                // margin: "0px auto",
                                                                background:
                                                                    "#dcdcdc",
                                                                padding: "2px",
                                                                color: "#000",
                                                                border: "1px solid #444",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <div className="col-md-12">
                                                                <table
                                                                    className=""
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            N°
                                                                            Compte
                                                                            :
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .NumCompte
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        <td>
                                                                            Intitulé
                                                                            :
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .NomMembre
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            N°
                                                                            Abregé
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .NumAbrege
                                                                            }
                                                                        </td>
                                                                    </tr>

                                                                    {/* <tr>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            Bénéficiaire
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .Beneficiaire
                                                                            }
                                                                        </td>
                                                                    </tr> */}

                                                                    <tr
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        <td>
                                                                            Motif
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .Motif
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        <td>
                                                                            Dévise
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            CDF
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div
                                                            align="left"
                                                            style={{
                                                                marginLeft:
                                                                    "100px",
                                                            }}
                                                        >
                                                            BILLETAGE
                                                        </div>
                                                        <div
                                                            className="row  corp-recu"
                                                            // id=""
                                                            style={{
                                                                width: "40%",
                                                                // margin: "0px auto",
                                                                background:
                                                                    "#DCDCDC",
                                                                padding: "5px",
                                                                color: "#000",
                                                                border: "2px solid #444",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <table
                                                                className="table table-striped"
                                                                style={{
                                                                    background:
                                                                        "#DCDCDC",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">
                                                                            Nbre
                                                                            Billets
                                                                        </th>
                                                                        <th scope="col">
                                                                            Coupure
                                                                        </th>
                                                                        <th scope="col">
                                                                            Total
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .vightMilleFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .vightMilleFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    20000{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .vightMilleFranc
                                                                                    ) *
                                                                                        20000}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .dixMilleFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .dixMilleFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    10000{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .dixMilleFranc
                                                                                    ) *
                                                                                        10000}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .cinqMilleFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinqMilleFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    5000{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinqMilleFranc
                                                                                    ) *
                                                                                        5000}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .milleFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .milleFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    1000{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .milleFranc
                                                                                    ) *
                                                                                        1000}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .cinqCentFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinqCentFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    500{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinqCentFranc
                                                                                    ) *
                                                                                        500}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .deuxCentFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .deuxCentFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    200{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .deuxCentFranc
                                                                                    ) *
                                                                                        200}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}

                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .centFranc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .centFranc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    100{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .centFranc
                                                                                    ) *
                                                                                        100}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}
                                                                    {parseInt(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .cinquanteFanc
                                                                    ) > 0 && (
                                                                        <React.Fragment>
                                                                            <tr>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinquanteFanc
                                                                                    )}{" "}
                                                                                </td>
                                                                                <td>
                                                                                    X
                                                                                    50{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {parseInt(
                                                                                        this
                                                                                            .state
                                                                                            .getDataCDF
                                                                                            .cinquanteFanc
                                                                                    ) *
                                                                                        50}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )}

                                                                    <tr>
                                                                        <th>
                                                                            Total
                                                                        </th>
                                                                        <th></th>
                                                                        <td>
                                                                            {parseInt(
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .montantEntre
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div>
                                                                Nous disons CDF{" "}
                                                                <b>
                                                                    {" "}
                                                                    {NumberToLetter(
                                                                        this
                                                                            .state
                                                                            .getDataCDF
                                                                            .montantEntre
                                                                    )}{" "}
                                                                    Francs
                                                                    congolais
                                                                </b>{" "}
                                                            </div>
                                                            <hr
                                                                style={{
                                                                    border: "2px dashed #fff",
                                                                    width: "95%",
                                                                }}
                                                            />
                                                            <div>
                                                                Date valeur :{" "}
                                                                {dateParser(
                                                                    this.state
                                                                        .getDataCDF
                                                                        .DateTransaction
                                                                )}
                                                            </div>

                                                            <div>
                                                                Fait à goma le{" "}
                                                                {dateParser(
                                                                    new Date()
                                                                )}{" "}
                                                            </div>
                                                            <table className="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th
                                                                            style={{
                                                                                border: "2px solid #000",
                                                                                padding:
                                                                                    "20px",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Signature{" "}
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataCDF
                                                                                    .NomUtilisateur
                                                                            }
                                                                        </th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>

                                                                        <th
                                                                            style={{
                                                                                border: "2px solid #000",
                                                                                padding:
                                                                                    "20px",
                                                                            }}
                                                                        >
                                                                            <i>
                                                                                Signature{" "}
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .getDataCDF
                                                                                        .Beneficiaire
                                                                                }
                                                                            </i>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>

                                    {this.state.getDataUSD ? (
                                        <div className="row" id="printme">
                                            <div
                                                className="card"
                                                style={{
                                                    margin: "5px",
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    className="logo-container"
                                                    style={{
                                                        // margin: "0 auto",
                                                        width: "40%",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    {/* <div style={{ textAlign: "center" }}><h4><b>ACTION POUR LA PAIX L'EDUCATION ET LE DEFENSE DES DROITS HUMAINS</b></h4></div> */}
                                                    <table
                                                        id="table"
                                                        class="table-responsive"
                                                        align="center"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <img
                                                                    style={{
                                                                        width: "50%",
                                                                        height: "90px",
                                                                    }}
                                                                    src="dist/img/ihdlogo.jpg"
                                                                />
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                    width: "30%",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <h3>
                                                                        «IHD»
                                                                    </h3>
                                                                    <p>
                                                                        Goma RDC{" "}
                                                                        <br />
                                                                        Téléphone:
                                                                        +2439998696620{" "}
                                                                        <br />
                                                                        Courriel:
                                                                        info@ihdemunis.org{" "}
                                                                        <br />
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td align="right">
                                                                <div
                                                                    style={{
                                                                        marginLeft:
                                                                            "0px",
                                                                    }}
                                                                >
                                                                    <h4>
                                                                        <b>
                                                                            <img
                                                                                style={{
                                                                                    width: "50%",
                                                                                    height: " 90px",
                                                                                }}
                                                                                src="dist/img/ihdlogo.jpg"
                                                                            />
                                                                        </b>
                                                                    </h4>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div
                                                    className="row "
                                                    style={{
                                                        // margin: "0px auto",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    {" "}
                                                    <h5
                                                        style={{
                                                            background:
                                                                "#DCDCDC",
                                                            padding: "5px",
                                                            color: "#000",
                                                            fontSize: "16px",
                                                            marginBottom:
                                                                "-30px",
                                                            marginLeft: "30px",
                                                            marginRight: "30px",
                                                            width: "300px",
                                                        }}
                                                    >
                                                        BORDEREAU DE DEPOT N°{" "}
                                                        {
                                                            this.state
                                                                .getDataUSD
                                                                .refOperation
                                                        }
                                                    </h5>{" "}
                                                </div>

                                                <div
                                                    class="card-body"
                                                    style={{
                                                        marginLeft: "2px",
                                                        marginRight: "2px",
                                                        marginTop: "30px",
                                                    }}
                                                >
                                                    <div
                                                        className="row entete-recu"
                                                        style={{
                                                            width: "40%",
                                                            // margin: "0px auto",
                                                            background:
                                                                "#DCDCDC",
                                                            padding: "5px",
                                                            color: "#000",
                                                            border: "3px solid #444",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    >
                                                        <div className="col-md-12">
                                                            <table
                                                                className=""
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <tr
                                                                    style={{
                                                                        border: "1px solid #fff",
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        N°
                                                                        Compte
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .NumCompte
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        border: "1px solid #fff",
                                                                    }}
                                                                >
                                                                    <td>
                                                                        Intitulé
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .NomMembre
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        border: "1px solid #fff",
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        N°
                                                                        Abregé
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .NumAbrege
                                                                        }
                                                                    </td>
                                                                </tr>

                                                                {/* <tr>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        Bénéficiaire
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .Operant
                                                                        }
                                                                    </td>
                                                                </tr> */}

                                                                {/* <tr>
                                  <td>Adresse</td>
                                  <td></td>
                                </tr> */}
                                                                <tr
                                                                    style={{
                                                                        border: "1px solid #fff",
                                                                    }}
                                                                >
                                                                    <td>
                                                                        Motif
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .Motif
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        border: "1px solid #fff",
                                                                    }}
                                                                >
                                                                    <td>
                                                                        Dévise
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            border: "1px solid #fff",
                                                                        }}
                                                                    >
                                                                        USD
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div
                                                        align="left"
                                                        style={{
                                                            marginLeft: "100px",
                                                        }}
                                                    >
                                                        BILLETAGE
                                                    </div>
                                                    <div
                                                        className="row corp-recu"
                                                        style={{
                                                            width: "40%",
                                                            // margin: "0px auto",
                                                            background:
                                                                "#DCDCDC",
                                                            padding: "5px",
                                                            color: "#000",
                                                            border: "3px solid #444",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    >
                                                        <table
                                                            className="table table-striped"
                                                            style={{
                                                                background:
                                                                    "#DCDCDC",
                                                                padding: "5px",
                                                                color: "#000",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">
                                                                        Nbre
                                                                        Billets
                                                                    </th>
                                                                    <th scope="col">
                                                                        Coupure
                                                                    </th>
                                                                    <th scope="col">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .centDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .centDollars
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                100{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .centDollars
                                                                                ) *
                                                                                    100}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .cinquanteDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .cinquanteDollars
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                50{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .cinquanteDollars
                                                                                ) *
                                                                                    50}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .vightDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .vightDollars
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                20{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .vightDollars
                                                                                ) *
                                                                                    20}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .dixDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .dixDollars
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                10{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .dixDollars
                                                                                ) *
                                                                                    10}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .cinqDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .cinqDollars
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                5{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .cinqDollars
                                                                                ) *
                                                                                    5}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}
                                                                {parseInt(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .unDollars
                                                                ) > 0 && (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .unDollars
                                                                                )}{" "}
                                                                            </td>
                                                                            <td>
                                                                                X
                                                                                1{" "}
                                                                            </td>
                                                                            <td>
                                                                                {parseInt(
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .unDollars
                                                                                ) *
                                                                                    1}
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )}

                                                                <tr>
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                    <th></th>
                                                                    <td>
                                                                        {parseInt(
                                                                            this
                                                                                .state
                                                                                .getDataUSD
                                                                                .montantEntre
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <div>
                                                            Nous disons USD{" "}
                                                            <b>
                                                                {" "}
                                                                {NumberToLetter(
                                                                    this.state
                                                                        .getDataUSD
                                                                        .montantEntre
                                                                )}{" "}
                                                                Dollars
                                                                Americains{" "}
                                                            </b>
                                                        </div>
                                                        <hr
                                                            style={{
                                                                border: "2px dashed #fff",
                                                                width: "100%",
                                                            }}
                                                        />
                                                        <div>
                                                            Date valeur :{" "}
                                                            {dateParser(
                                                                this.state
                                                                    .getDataUSD
                                                                    .DateTransaction
                                                            )}
                                                        </div>

                                                        <div>
                                                            Fait à goma le{" "}
                                                            {dateParser(
                                                                new Date()
                                                            )}{" "}
                                                        </div>

                                                        <div
                                                            className="row"
                                                            style={{
                                                                width: "100%",
                                                                height: "65px",
                                                                marginLeft:
                                                                    "2px",
                                                            }}
                                                        >
                                                            <table className="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th
                                                                            style={{
                                                                                border: "2px solid #000",
                                                                                padding:
                                                                                    "20px",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Signature{" "}
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .getDataUSD
                                                                                    .NomUtilisateur
                                                                            }
                                                                        </th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>

                                                                        <th
                                                                            style={{
                                                                                border: "2px solid #000",
                                                                                padding:
                                                                                    "20px",
                                                                            }}
                                                                        >
                                                                            <i>
                                                                                Signature{" "}
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .getDataUSD
                                                                                        .Beneficiaire
                                                                                }
                                                                            </i>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    <div className="row mb-1">
                                        <div className="col-md-6"></div>
                                        <div className="col-md-6">
                                            <span>
                                                {/* <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                >
                                                    <i className="fas fa-file-excel"></i>{" "}
                                                    Exporter
                                                </button>{" "}
                                                {""}
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                >
                                                    <i className="fas fa-file-word"></i>{" "}
                                                    Export
                                                </button>{" "} */}
                                                <button
                                                    onClick={this.PrintBtn}
                                                    type="submit"
                                                    className="btn btn-success"
                                                >
                                                    <i className="fas fa-print"></i>{" "}
                                                    Imprimer
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
