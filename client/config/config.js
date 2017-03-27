/* TODO: Try removing these confings from window and make them local to their resp. functions*/ //eslint-disable-line

if(!window.mediaCenter) {
    window.mediaCenter = {};
}
window.mediaCenter.serverUrl = "http://localhost:5000";
window.mediaCenter.facebookAppId = "158896271244772";
window.mediaCenter.maxSurfFeedsLifeInDays = 30;
window.mediaCenter.autoRefreshSurfFeedsInterval = 300000;
window.mediaCenter.numberOfDaysToBackUp = 2;
window.mediaCenter.dbSessionInterval = 600000;
