import React from "react";

export default class PaulMuhindoEntete extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: "0 auto",
                    width: "77%",
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
                    <h2>
                        <b>ETABLISEMENT PAUL MUHINDO</b>
                    </h2>
                </div>
                <table id="table" class="table" align="center">
                    <tr>
                        <td>
                            {" "}
                            <img
                                style={{
                                    width: "30%",
                                    height: "90px",
                                }}
                                src="dist/img/logo_pmb.png"
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
                                <h3>«P.M.B»</h3>
                                <p>
                                    Goma RDC <br />
                                    Téléphone: +243 998 344 626 <br />
                                    Courriel: info@pmb-rdc.com <br />
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
                                            src="dist/img/logo_pmb.png"
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
