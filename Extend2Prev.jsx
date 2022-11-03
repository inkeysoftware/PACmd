// Move to the same column (if possible) on the previous page.

// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "PrevPage"); 

#include "inc/PACmd.jsxinc"


// Main function: 
function main() {
	selEnd = getPersistentNum("end");
//	alert("selEnd " + selEnd.toString());
	if (selEnd == 0) {
		// There was not yet an extended selection. Extend back 1 col.
		curFrame = getCurColFrame();
		if (curFrame == null) {
			// No selection. Just select 1st col on active page, and exit.
			app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, 1));
			return;
		}
		iCurCol = getFrameIdx(curFrame);
		if (iCurCol == 1) {
			return;  // We can't extend back any further.
		}
		selStart = setPersistentNum("start", iCurCol);
		selEnd = setPersistentNum("end", iCurCol - 1);
		hiliteCol(curFrame);
		colNew = getBodyFrameByIdx(selEnd);
		hiliteCol(colNew);
		app.activeWindow.select(colNew);
	} else {
		// There was already an extended selection
		selStart = getPersistentNum("start");
		curFrame = getCurColFrame();
		if (curFrame == null) {
			iCurCol = selEnd;
		} else {
			iCurCol = getFrameIdx(curFrame);
			if (iCurCol != selEnd) { 
				// Somehow, they've moved the selection since setting up. For now, just cancel that selection and start over.
				unhighlightRange(selStart, selEnd);
				if (iCurCol == 1) {
					selEnd = setPersistentNum("end", 0);
					return; // We can't extend back any further.
				}
				
				// Same as above for starting new selection
				selStart = setPersistentNum("start", iCurCol);
				selEnd = setPersistentNum("end", iCurCol - 1);
				hiliteCol(curFrame);
				colNew = getBodyFrameByIdx(selEnd);
				hiliteCol(colNew);
				app.activeWindow.select(colNew);
				return;
			}
		}
		if (iCurCol == 1) {  // We can't extend back any further.
			return;
		}
		if (selStart == selEnd - 1) { // reversing selection to start: remove all selection, unhighlight both
			selEnd = setPersistentNum("end", 0);
			unhiliteCol(curFrame);
			colNew = getBodyFrameByIdx(iCurCol - 1);
			unhiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart == selEnd) { // we are to extend the selection backwards
			selEnd = setPersistentNum("end", iCurCol - 1);
			hiliteCol(curFrame);
			colNew = getBodyFrameByIdx(selEnd);
			hiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart > selEnd) { // we are to extend the selection backwards
			selEnd = setPersistentNum("end", selEnd - 1);
			colNew = getBodyFrameByIdx(selEnd);
			hiliteCol(colNew);
			app.activeWindow.select(colNew);
			return;
		}
		if (selStart < selEnd) { // we are to reduce the selection backwards
			unhiliteCol(curFrame);
			selEnd = setPersistentNum("end", selEnd - 1);
			colNew = getBodyFrameByIdx(selEnd);
			app.activeWindow.select(colNew);
		}
	}
}



