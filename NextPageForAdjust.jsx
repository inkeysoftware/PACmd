// Move to the first column on the next page, and signal PA when done.

// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextPage"); 

#include "inc/PACmd.jsxinc"

// function justDoNext() { // Make next window active, and select left Frame
	// curr = app.activeWindow.activePage;
	// newPg = app.activeWindow.parent.pages[Math.min(app.activeWindow.parent.pages.length-1,curr.documentOffset+1)];
	// app.activeWindow.activePage = newPg;
	// app.activeWindow.select(getBodyFrame(newPg, 1));	// Select left textframe
	// Respond2PA("nextPg")
// }

// Main function: 
function main() {

	// If there was an extended selection, cancel it.
	selEnd = getPersistentNum("end");
	if (selEnd != 0) {
		selStart = getPersistentNum("start");
		unhighlightRange(selStart, selEnd);
		selEnd = setPersistentNum("end", 0);
	}

	curFrame = getCurColFrame();
	curPg = (curFrame == null) ? app.activeWindow.activePage : curFrame.parentPage; // selection might not be in active page.
	
	if (curPg.documentOffset == app.activeWindow.parent.pages.length-1) { // If on the last pageX
		Respond2PA("eof")  // end of file. Can't go to next page. Cancel adjust.
		return;
	}
	
	newPg = app.activeWindow.parent.pages[curPg.documentOffset+1];
	app.activeWindow.activePage = newPg;
	app.activeWindow.select(getBodyFrame(newPg, 1));
	Respond2PA("nextPg")
}



