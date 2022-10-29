// Extend the column selection forward.

// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "Extend2Next"); 
// main();

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	selEnd = getPersistentNum("pac:selEnd");
	if (selEnd == 0) {
		// There was not yet an extended selection. Extend forward 1 col.
		curFrame = getCurColFrame();
		if (curFrame == null) {
			// No selection. Just select last col on active page, and exit.
			app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, colCt()));
			return;
		}
		iCurCol = getFrameIdx(curFrame);
		if (iCurCol == idxLastCol()) {
			return;  // We can't advance any further.
		}
		selStart = setPersistentNum("pac:selStart", iCurCol);
		selEnd = setPersistentNum("pac:selEnd", iCurCol + 1);
		hiliteCol(curFrame);
		colNew = getBodyFrameByIdx(selEnd);
		hiliteCol(colNew);
		app.activeWindow.select(colNew);
	} else {
		// There was already an extended selection
		selStart = getPersistentNum("pac:selStart");
		curFrame = getCurColFrame();
		if (curFrame == null) {
			iCurCol = selEnd;
		} else {
			iCurCol = getFrameIdx(curFrame);
			if (iCurCol != selEnd) { 
				// Somehow, they've moved the selection since setting up. For now, just cancel that selection and start over.
				unhighlightRange(selStart, selEnd);
				if (iCurCol == idxLastCol()) {
					selEnd = setPersistentNum("pac:selEnd", 0);
					return; // We can't advance any further.
				}
				
				selStart = setPersistentNum("pac:selStart", iCurCol);
				selEnd = setPersistentNum("pac:selEnd", iCurCol + 1);
				hiliteCol(curFrame);
				colNew = getBodyFrameByIdx(selEnd);
				hiliteCol(colNew);
				app.activeWindow.select(colNew);
				return;
			}
		}
		if (iCurCol == idxLastCol()) {  // We can't advance any further.
			return;
		}
		if (selStart == selEnd + 1) { // reversing selection to start: remove all selection, unhighlight both
			selEnd = setPersistentNum("pac:selEnd", 0);
			unhiliteCol(curFrame);
			colNew = getBodyFrameByIdx(iCurCol + 1);
			unhiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart == selEnd) { // we are to extend the selection forwards
			selEnd = setPersistentNum("pac:selEnd", iCurCol + 1);
			hiliteCol(curFrame);
			colNew = getBodyFrameByIdx(selEnd);
			hiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart < selEnd) { // we are to extend the selection forwards
			selEnd = setPersistentNum("pac:selEnd", selEnd + 1);
			colNew = getBodyFrameByIdx(selEnd);
			hiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart > selEnd) { // we are to reduce the selection forwards
			unhiliteCol(curFrame);
			selEnd = setPersistentNum("pac:selEnd", selEnd + 1);
			colNew = getBodyFrameByIdx(selEnd);
			app.activeWindow.select(colNew);
		}
	}
}


