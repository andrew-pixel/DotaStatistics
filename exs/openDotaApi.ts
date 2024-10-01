//https://www.opendota.com/players/1070668144
function getSpecificPlayer(id):
    GET("https://api.opendota.com/api/players/{id}");

function getSpecficMatch(match_id):
    GET("https://api.opendota.com/api/matches/{match_id}");

function getPlayerRecents(id):
    GET("https://api.opendota.com/api/players/{account_id}/recentMatches");

function getPlayerData(id):
    GET("https://api.opendota.com/api/players/{id}");

function getImmortalMatches(id):
    GET("https://api.opendota.com/api/publicMatches?Minrank=85");

function getProMatchList(id):
    GET("https://api.opendota.com/api/proMatches");

function getProList(id):
    GET("https://api.opendota.com/api/proPlayers");    

    https://api.opendota.com/api/players/{account_id}/heroes