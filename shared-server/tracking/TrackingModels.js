
function getInfoTracking(res){
    var tracking = {
        "updateAt" : res.rows[0].updateat,
        "id" : res.rows[0].tracking_id,
        "status" : res.rows[0].status
    };
    return tracking;
}


function getAllTrackigs(res){
    var trackings = [];
    for(i=0;i < res.rowCount;i++){
        var tracking = {
            "updateAt" : res.rows[i].updateAt,
            "id" : res.rows[i].tracking_id,
            "status" : res.rows[i].status
        };
        trackings[i] = tracking;
    }
    return trackings;
}


module.exports = {
    getInfoTracking: getInfoTracking,
    getAllTrackigs:getAllTrackigs
};