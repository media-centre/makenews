import R from "ramda"; //eslint-disable-line id-length

export function constructQueryString(options = {}, encode = true) {
    const queryParams = key => key + "=" + (encode ? encodeURIComponent(options[key]) : options[key]);

    return R.pipe(
        R.map(queryParams),
        R.join("&")
    )(Object.keys(options));
}
