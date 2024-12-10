import React from "react";
// import PaulMuhindoEntete from "./PaulMuhindoEntete";

export class EnteteRapport extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: "0 auto",
                    width: "77%",
                    border: "0px",
                }}
                className="main-entente-container"
            >
                {" "}
                <br />
                <br />
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <h4>
                        <b>INITIATIVE HUMANITAIRE POUR LES DEMUNIS</b>
                    </h4>
                </div>
                <table
                    id="table"
                    class="table entente-container"
                    align="center"
                >
                    <tr>
                        <td>
                            {" "}
                            <img
                                style={{
                                    width: "30%",
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
                                    textAlign: "center",
                                }}
                            >
                                <h3>«I.H.D»</h3>
                                <p>
                                    Goma RDC <br />
                                    Téléphone: +243999869620 <br />
                                    Courriel: info@ihdemunis.org <br />
                                </p>
                            </div>
                        </td>
                        <td align="right">
                            <div
                                style={{
                                    marginLeft: "0px",
                                }}
                            >
                                <h4>
                                    <b>
                                        <img
                                            style={{
                                                width: "30%",
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
        );
    }
}

// import React from "react";
// import PaulMuhindoEntete from "./PaulMuhindoEntete";

// export default class EnteteRapport extends React.Component {
//     render() {
//         return (
//             <>
//                 <PaulMuhindoEntete />
//             </>
//         );
//     }
// }
