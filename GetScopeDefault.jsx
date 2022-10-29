// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "GetScopeDefault"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	selEnd = getPersistentNum("pac:selEnd");
	selStart = getPersistentNum("pac:selStart");
	if (selEnd==0) {
		Respond2PA("Col");
		return;
	}
	
	curFrame = getCurColFrame();
	if (curFrame == null) {
		curFrame = getBodyFrame(app.activeWindow.activePage, 1);
		app.activeWindow.select(curFrame);	// Select first textframe
	}
	iCurCol = getFrameIdx(curFrame);

	if (iCurCol != selEnd) {
		// Somehow, the selection is no longer where we left it. Cancel extended selection.
		unhighlightRange(selStart, selEnd);
		selEnd = setPersistentNum("pac:selEnd", 0);
		Respond2PA("Col");
		return;
	}
	
	if (selStart == selEnd) {
		alert("Bug to report: Start and end of extended selection are the same column!");
	}
	
	if (pageByIdx(iCurCol) == pageByIdx(selStart)) {
		Respond2PA("Pg");
		return;
	}
	
	// Use this if we need to swap start and end, and move focus to end for PA's sake.
	// if (iCurCol < selStart) {
		// 
		// newFrame = getBodyFrameByIdx(selStart);
		// app.activeWindow.activePage = newFrame.parentPage; 
		// app.activeWindow.select(newFrame);
		// setPersistentNum("pac:selEnd", selStart);
		// setPersistentNum("pac:selStart", iCurCol);
	// }
		
	Respond2PA((Math.abs(selStart - selEnd) + 1).toString() + "-column");
}

