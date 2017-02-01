import R from "ramda"; //eslint-disable-line id-length

function _containsWith(predicate, list, elem) {
    const len = list.length;

    addAddedProp(0); //eslint-disable-line no-magic-numbers

    function addAddedProp(index) {
        if (index !== len) {
            if (predicate(list[index], elem)) {
                list[index].added = true;
                return;
            }
            addAddedProp(index + 1); //eslint-disable-line no-magic-numbers
        }
    }
}

export function intersectionWith(predicate, sources, configuration) {
    if(sources !== []) {
        let idx = 0;
        while (idx < configuration.length) { //eslint-disable-line no-loops/no-loops
            _containsWith(predicate, sources, configuration[idx]);
            idx = R.inc(idx);
        }
    }
}
