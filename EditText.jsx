// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "EditText"); 

// getBodyFrame() - Given a Page and a column number, return the TextFrame indicated by the column number.
function getBodyFrame(pg, colNum) {
	// Temporary cheat: Using index rather than label. This probably won't work if intro goes onto second page.
	// Index numbers are different on the first page. 
	return pg.textFrames.item((pg.documentOffset == 0 ? 5 : 3) - colNum);
}

// Main function: 
function main() {
	var selFrame;
    if (app.selection.length > 0 && app.selection[0].constructor.name == "TextFrame") {
		selFrame = app.selection[0];
	} else {
		selFrame = getBodyFrame(app.activeWindow.activePage, 1);
	}

	app.activeWindow.select(selFrame.lines.middleItem());
}

