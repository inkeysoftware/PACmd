// Run script in a way that a single Undo step undoes all its changes
// app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextPara"); 
main();

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	
	p = app.selection[0].insertionPoints[0];
	nextp = p.paragraphs.nextItem(p.paragraphs[0]);
	if (nextp == null) {
		return; // end of story
	}
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

