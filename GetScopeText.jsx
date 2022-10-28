// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "GetScopeText"); 

function sendPACommand(cmd) {
	const cmdFilebase = Folder.temp + "/ID2PAresponse";
	var file = new File(cmdFilebase + ".tmp");
	file.open('w');
	file.write(cmd);
	file.close();
	file.rename(cmdFilebase + ".txt");
}

// Main function: 
function main() {
	sendPACommand("Para");
}

