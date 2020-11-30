function plan(problem) {
    const ERROR = 1e7;

    problem.route = problem.route
        .map((r) => {
            r.speed = problem.chargerTypes[r.type].curve[7];
            return r;
        })
        .concat([{
            type: -1,
            position: problem.routeLength,
            overhead: 0,
            speed: 0
        }]);
    problem.route.sort((a, b) => a.speed - b.speed);

    function getTime(charger, startPerc, endPerc) {
        if (endPerc) {
            return getTime(charger, endPerc) - getTime(charger, startPerc);
        }
        else {
            if (startPerc < 0) {
                return 0;
            }
            if (startPerc > 100) {
                return charger.curve[10];
            }

            const bin = startPerc / 10;
            const lower = Math.floor(bin);
            const upper = Math.ceil(bin);
            const f = bin - lower;

            return charger.curve[lower] * (1 - f) + charger.curve[upper] * f;
        }
    }

    function iteration(route, time, arrivalCharge, bound) {
        let position = 0;
        let waypoint = null;
        let maxCharge = arrivalCharge;

        if (route.length > 0) {
            waypoint = route[route.length - 1];
            position = waypoint.position;
            maxCharge = 100;

            route[route.length - 1].arrival = arrivalCharge;
            route[route.length - 1].arrivalTime = time;

            if (waypoint.type == -1) {
                return [route, time];
            }
        }

        if (waypoint && waypoint.type == -1) {
            return [route, time];
        }

        const hops = problem.route.filter(waypoint => (
            waypoint.position > position &&
            waypoint.position < position + ((maxCharge - problem.min) / 100 * problem.range) &&
            waypoint.position <= problem.routeLength
        )).map((waypoint) => {
            let copy = {};

            for (let prop in waypoint) {
                copy[prop] = waypoint[prop];
            }

            return copy;
        });

        if (hops.length == 0) {
            return [route, ERROR];
        }

        let best = route;
        let bestTime = ERROR;

        for (let hop of hops) {
            let distance = hop.position - position;
            let charge = arrivalCharge - distance / problem.range * 100;
            let chargeTime = 1e-7;
            let delta = 0;
            let overhead = 0;

            if (charge < problem.min) {
                delta = problem.min - charge;
                chargeTime = getTime(problem.chargerTypes[waypoint.type], arrivalCharge, arrivalCharge + delta);

                if (route.length > problem.rapidgateCharges) {
                    chargeTime /= 1 - problem.rapidgateReduction / 100;
                }

                charge = problem.min;

                overhead = waypoint.overhead;
            }

            if ((time + distance / problem.speed * 60 + chargeTime + overhead) / (hop.position + 50) * problem.routeLength > bestTime) {
                continue;
            }

            [_route, _time] = iteration(route.concat([hop]), time + distance / problem.speed * 60 + chargeTime + overhead, charge, bestTime);

            if (_time < bestTime) {
                bestTime = _time;
                best = _route;

                if (delta != 0) {
                    route[route.length - 1].chargingTime = chargeTime;
                    route[route.length - 1].leave = arrivalCharge + delta;
                    route[route.length - 1].leaveTime = time + chargeTime + overhead;
                }
            }
        }

        return [best, bestTime];
    }

    return iteration([], 0, problem.start, ERROR)[0];
}
