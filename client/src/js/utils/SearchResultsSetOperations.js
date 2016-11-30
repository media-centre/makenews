import R from "ramda"; //eslint-disable-line id-length

function _containsWith(pred, list, elem) {
    var idx = 0;
    var len = list.length;

    while (idx < len) {
        if (pred(list[idx], elem)) {
            list[idx].added = true;
            break;
        }
        idx = R.inc(idx);
    }
}

export function intersectionWith(pred, sources, configuration) {
    let idx = 0;
    if(sources !== []) {
        while (idx < configuration.length) {
            _containsWith(pred, sources, configuration[idx]);
            idx = R.inc(idx);
        }
    }
}
