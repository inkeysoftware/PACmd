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

	//app.activeWindow.select(selFrame.paragraphs.middleItem());
	
	
	
	
	
		// p = app.selection[0].insertionPoints[0];
	nextp = selFrame.paragraphs.middleItem();
	// if (nextp == null) {
		// return; // end of story
	// }
	nextIp = nextp.insertionPoints[0];
	app.activeWindow.activePage = nextIp.parentTextFrames[0].parentPage;
	app.activeWindow.select(nextp);

	// If there had been any extended selection, wipe it out.
	selEnd = getPersistentNum("pac:selEnd");
	if (selEnd) {
		unhighlightRange(getPersistentNum("pac:selStart"), selEnd);
		selEnd = setPersistentNum("pac:selEnd", 0);
	}

	$.sleep(100);
	app.activeWindow.select(nextIp);

}

