----------------------------------------->>
-- IGC: International Gaming Community
-- Date: 06 Feb 2017
-- Project: Online Live Map
-- Type: Server Side
-- Author: Ares
----------------------------------------->>
CACHE = {}

function returnServerData(count)
	if (not count or not tonumber(count)) then return {} end
	count = tonumber(count);
	if (count%5 == 0 or count == 1) then return CACHE; else return {players=CACHE.players} end
end

function refreshCACHE()
	local playersData = exports.IGCweb:getPlayersData();

	local players_data = {}
	for i=1, #playersData do
		if (playersData[i].gamemode == "RPG") then
			local playerTable = {
				account = playersData[i].account,
				name = playersData[i].name,
				pos = playersData[i].pos,
				color = playersData[i].color,
			}
			table.insert(players_data, playerTable);
		end
	end

	local turf_data = {}
	for i, turf in ipairs ( getElementsByType("radararea", getResourceRootElement(getResourceFromName("IGCgangTerritories"))) ) do
		local id = getElementData(turf, "id");
		local towner = exports.IGCgangTerritories:getTurfData(id, "owner");
		local owner = exports.IGCgroups:getGroupName(towner);
		local r, g, b = exports.IGCgroups:getGroupColor(towner);
		local isFlashing = tostring(isRadarAreaFlashing(turf));

		local sX, sY = getRadarAreaSize(turf);
		local tX, tY = getElementPosition(turf);

		local turfTable = {
			owner = owner,
			color = { r, g, b },
			flashing = isFlashing,
			radararea = {string.format("%.2f", tX), string.format("%.2f", tY), string.format("%.2f", sX), string.format("%.2f", sY)},
		}
		table.insert(turf_data, turfTable);
	end
	
	CACHE = {players=players_data, turfs=turf_data}
end

setTimer(refreshCACHE, 15000, 0);
refreshCACHE();
