function formatTime(t) {
    return Math.floor(t / 60) + ":" + ((t % 60) < 10 ? ("0" + Math.floor(t % 60)) : Math.floor(t % 60));
}

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            start: 100,
            min: 10,
            range: 350,
            routeLength: 1000,
            speed: 115,
            rapidgateCharges: 3,
            rapidgateReduction: 0,
            chargerTypes: [
                {
                    name: "SCv2",
                    curve: [
                        0,
                        4.3,
                        7.5,
                        10.7,
                        13.8,
                        16.9,
                        20.5,
                        25.2,
                        31.7,
                        42.5,
                        60
                    ]
                },
                {
                    name: "SCv3",
                    curve: [
                        0,
                        3.2,
                        5,
                        6.9,
                        9.2,
                        12,
                        15.6,
                        20.3,
                        27.5,
                        39.1,
                        50
                    ]
                },
                {
                    name: "CCS50",
                    curve: [
                        0,
                        14.2,
                        26,
                        37.2,
                        47.8,
                        58,
                        67.7,
                        77,
                        85.9,
                        96.7,
                        115
                    ]
                },
                {
                    name: "CCS150",
                    curve: [
                        0,
                        4.3,
                        7.6,
                        10.7,
                        13.8,
                        16.8,
                        20.4,
                        25.1,
                        31.7,
                        42.4,
                        60
                    ]
                },
                {
                    name: "CCS350",
                    curve: [
                        0,
                        3.8,
                        6.3,
                        8.7,
                        11.0,
                        13.8,
                        17.4,
                        22.0,
                        28.6,
                        39.4,
                        50
                    ]
                }
            ],
            route: [
                {
                    position: 50,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 80,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 90,
                    type: 0,
                    overhead: 3
                },
                {
                    position: 120,
                    type: 3,
                    overhead: 3
                },
                {
                    position: 210,
                    type: 3,
                    overhead: 3
                },
                {
                    position: 230,
                    type: 0,
                    overhead: 3
                },
                {
                    position: 290,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 370,
                    type: 4,
                    overhead: 3
                },
                {
                    position: 380,
                    type: 1,
                    overhead: 3
                },
                {
                    position: 460,
                    type: 3,
                    overhead: 3
                },
                {
                    position: 510,
                    type: 0,
                    overhead: 3
                },
                {
                    position: 520,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 590,
                    type: 4,
                    overhead: 3
                },
                {
                    position: 670,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 710,
                    type: 1,
                    overhead: 3
                },
                {
                    position: 760,
                    type: 4,
                    overhead: 3
                },
                {
                    position: 800,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 800,
                    type: 0,
                    overhead: 3
                },
                {
                    position: 850,
                    type: 2,
                    overhead: 3
                },
                {
                    position: 920,
                    type: 4,
                    overhead: 3
                },
                {
                    position: 920,
                    type: 0,
                    overhead: 3
                }
            ]
        };

        this.calculate = this.calculate.bind(this);
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
    }

    calculate() {
        let preset = {
            start: parseFloat(this.state.start),
            min: parseFloat(this.state.min),
            range: parseFloat(this.state.range),
            routeLength: parseFloat(this.state.routeLength),
            speed: parseFloat(this.state.speed),
            rapidgateCharges: parseInt(this.state.rapidgateCharges),
            rapidgateReduction: parseFloat(this.state.rapidgateReduction),
            chargerTypes: this.state.chargerTypes.map((d) => {
                return {
                    name: d.name,
                    curve: d.curve.map(parseFloat)
                };
            }),
            route: this.state.route.map((r) => {
                return {
                    position: parseFloat(r.position),
                    type: r.type,
                    overhead: parseFloat(r.overhead)
                };
            })
        };

        preset.result = plan(preset);

        this.setState({
            preset: preset
        });
    }

    save() {
        let temp = document.createElement("a");
        temp.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state)));
        temp.setAttribute("download", "profile.json");
        temp.style.display = "none";
        document.body.appendChild(temp);
        temp.click();
        document.body.removeChild(temp);
    }

    load() {
        let temp = document.createElement("input");
        temp.setAttribute("type", "file");
        temp.style.display = "none";
        document.body.appendChild(temp);
        temp.addEventListener('change', (e) => {
            let file = e.target.files[0];
            if (!file) {
                return;
            }

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState(JSON.parse(e.target.result));
            };

            reader.readAsText(file);
        }, false);
        temp.click();
        document.body.removeChild(temp);

    }

    render() {
        let route = null;
        let preset = null;

        if (this.state.preset) {
            preset = this.state.preset;
            route = preset.result;
        }

        return (
            <div class="text-light m-4">
                <h1>EV Trip Simulator</h1>
                <h2>Settings</h2>
                <div class="d-flex mb-2">
                    <button class="btn btn-primary" onClick={this.load}>
                        Load profile
                    </button>
                    <button class="btn btn-primary ml-2" onClick={this.save}>
                        Save profile
                    </button>
                </div>
                <h3>General</h3>
                <div>
                    <table class="table table-responsive text-light mt-2">
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Starting charge</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ start: e.target.value });
                                        }}
                                        value={this.state.start}
                                    />
                                    <div class="ml-1">%</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Minimum arrival charge</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ min: e.target.value });
                                        }}
                                        value={this.state.min}
                                    />
                                    <div class="ml-1">%</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Range</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ range: e.target.value });
                                        }}
                                        value={this.state.range}
                                    />
                                    <div class="ml-1">km</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Trip length</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ routeLength: e.target.value });
                                        }}
                                        value={this.state.routeLength}
                                    />
                                    <div class="ml-1">km</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Speed</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ speed: e.target.value });
                                        }}
                                        value={this.state.speed}
                                    />
                                    <div class="ml-1">km/h</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Rapidgate after</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ rapidgateCharges: e.target.value });
                                        }}
                                        value={this.state.rapidgateCharges}
                                    />
                                    <div class="ml-1">charges</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Rapidgate slowdown</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <input
                                        class="text-right form-control form-control-sm"
                                        onChange={(e) => {
                                            this.setState({ rapidgateReduction: e.target.value });
                                        }}
                                        value={this.state.rapidgateReduction}
                                    />
                                    <div class="ml-1">%</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <h3>Charger types</h3>
                <table class="table table-responsive text-light mt-2">
                    <tr>
                        <th></th>
                        {
                            this.state.chargerTypes.map((c, i) => {
                                return (
                                    <th>
                                        <input
                                            class="form-control form-control-sm"
                                            onChange={(e) => {
                                                let types = this.state.chargerTypes;
                                                types[i].name = e.target.value;
                                                this.setState({ chargerTypes: types });
                                            }}
                                            value={c.name}
                                        />
                                    </th>
                                );
                            })
                        }
                    </tr>
                    <tr>
                        <td class="border-0"></td>
                        {
                            this.state.chargerTypes.map((c, i) => {
                                return (
                                    <td class="border-0">
                                        <button
                                            class="btn btn-danger"
                                            onClick={() => {
                                                let types = this.state.chargerTypes.filter((d, j) => j != i);
                                                let route = this.state.route
                                                    .filter((w) => w.type != i)
                                                    .map((w) => {
                                                        if (w.type > i) {
                                                            w.type--;
                                                        }
                                                        return w;
                                                    });
                                                this.setState({ chargerTypes: types, route: route });
                                            }}
                                        >
                                            Remove
                                    </button>
                                    </td>
                                );
                            })
                        }
                        <td class="border-0">
                            <button
                                class="btn btn-primary"
                                onClick={() => {
                                    let types = this.state.chargerTypes;
                                    types.push({
                                        name: "New charger",
                                        curve: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
                                    });
                                    this.setState({ chargerTypes: types });
                                }}
                            >
                                + Add type
                            </button>
                        </td>
                    </tr>
                    {
                        [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((perc) => {
                            return (
                                <tr>
                                    <td>{perc}%</td>
                                    {
                                        this.state.chargerTypes.map((c, i) => {
                                            return (
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <input
                                                            class="text-right form-control form-control-sm"
                                                            onChange={(e) => {
                                                                let types = this.state.chargerTypes;
                                                                types[i].curve[perc / 10] = e.target.value;
                                                                this.setState({ chargerTypes: types });
                                                            }}
                                                            value={c.curve[perc / 10]}
                                                        />
                                                        <div class="ml-1">min</div>
                                                    </div>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </table>
                <h3>Chargers</h3>
                <table class="table table-responsive text-light mt-2">
                    <tr>
                        <th>Position</th>
                        <th>Type</th>
                        <th>Overhead</th>
                        <th></th>
                    </tr>
                    {
                        this.state.route.map((w, i) => {
                            return (
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <input
                                                class="text-right form-control form-control-sm"
                                                onChange={(e) => {
                                                    let route = this.state.route;
                                                    route[i].position = e.target.value;
                                                    this.setState({ route: route });
                                                }}
                                                value={w.position}
                                            />
                                            <div class="ml-1">km</div>
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            class="form-control form-control-sm"
                                            value={w.type}
                                            onChange={(e) => {
                                                let route = this.state.route;
                                                route[i].type = e.target.value;
                                                this.setState({ route: route });
                                            }}
                                        >
                                            {
                                                this.state.chargerTypes.map((c, i) => {
                                                    return (
                                                        <option value={i}>{c.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <input
                                                class="text-right form-control form-control-sm"
                                                onChange={(e) => {
                                                    let route = this.state.route;
                                                    route[i].overhead = e.target.value;
                                                    this.setState({ route: route });
                                                }}
                                                value={w.overhead}
                                            />
                                            <div class="ml-1">min</div>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            class="btn btn-danger"
                                            onClick={() => {
                                                let route = this.state.route.filter((w, j) => i != j);
                                                this.setState({ route: route });
                                            }}
                                        >
                                            Remove
                                    </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    <tr>
                        <td class="border-0">
                            <button
                                class="btn btn-primary"
                                onClick={() => {
                                    let route = this.state.route;
                                    route.push({
                                        position: 0,
                                        type: 0,
                                        overhead: 3
                                    });
                                    this.setState({ route: route });
                                }}
                            >
                                + Add charger
                            </button>
                        </td>
                    </tr>
                </table>
                <h2>Results</h2>
                <div>
                    <button
                        class="btn btn-primary"
                        onClick={this.calculate}
                    >
                        Calculate
                    </button>
                </div>
                {
                    preset && route.length == 0 &&
                    <div class="alert alert-danger mt-2">
                        Route impossible
                    </div>
                }
                {
                    preset && route.length > 0 &&
                    <table class="table table-responsive text-light mt-2">
                        <tr>
                            <th>Position</th>
                            <th>Distance</th>
                            <th>Driving time</th>
                            <th>Type</th>
                            <th>Arrival time</th>
                            <th>Arrival charge</th>
                            <th>Leave time</th>
                            <th>Leave charge</th>
                            <th>Charging time</th>
                        </tr>
                        <tr>
                            <td class="text-right">0km</td>
                            <td></td>
                            <td></td>
                            <td class="text-right">Start</td>
                            <td></td>
                            <td></td>
                            <td class="text-right">0:00</td>
                            <td class="text-right">{preset.start}%</td>
                            <td></td>
                        </tr>
                        {
                            route.map((waypoint, i) => {
                                let delta = i > 0 ? (waypoint.position - route[i - 1].position) : waypoint.position;
                                let type = "End";

                                if (waypoint.type != -1) {
                                    type = preset.chargerTypes[waypoint.type].name;
                                }

                                return (
                                    <tr>
                                        <td class="text-right">{waypoint.position}km</td>
                                        <td class="text-right">+{delta}km</td>
                                        <td class="text-right">{formatTime(delta / preset.speed * 60)}</td>
                                        <td class="text-right">{type}</td>
                                        <td class="text-right">{formatTime(waypoint.arrivalTime)}</td>
                                        <td class="text-right">{Math.round(waypoint.arrival)}%</td>
                                        <td class="text-right">{waypoint.leaveTime && formatTime(waypoint.leaveTime)}</td>
                                        <td class="text-right">{waypoint.leave && Math.round(waypoint.leave) + "%"}</td>
                                        <td class="text-right">{waypoint.chargingTime && formatTime(waypoint.chargingTime)}</td>
                                    </tr>
                                );
                            })
                        }
                    </table>
                }
                
                <div class="mt-4 text-muted">
                    Made by <a href="https://twitter.com/niwasox">Niel Wagensommer</a>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
