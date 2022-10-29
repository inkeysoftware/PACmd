// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "EditText"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	
	// If there was an extended selection, cancel it.
	selEnd = getPersistentNum("pac:selEnd");
	if (selEnd != 0) {
		selStart = getPersistentNum("pac:selStart");
		unhighlightRange(selStart, selEnd);
		selEnd = setPersistentNum("pac:selEnd", 0);
	}

	var selFrame;
    if (app.selection.length > 0 && app.selection[0].constructor.name == "TextFrame") {
		selFrame = app.selection[0];
	} else {
		selFrame = getBodyFrame(app.activeWindow.activePage, 1);
	}

	app.activeWindow.select(selFrame.lines.middleItem());
}

