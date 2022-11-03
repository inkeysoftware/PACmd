// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextCol"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	// If there had been any extended selection, wipe it out.
	selEnd = getPersistentNum("pac:selEnd");
	if (selEnd) {
		unhighlightRange(getPersistentNum("pac:selStart"), selEnd);
		selEnd = setPersistentNum("pac:selEnd", 0);
	}
	
	curFrame = getCurColFrame();
	if (curFrame == null) {  // No column body frame selected, so select last col
		app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, colCt()));
        return;  
    }
	//unhiliteCol(curFrame);  // shouldn't be necessary, if we didn't mess up something earlier
	
	iCurCol = getFrameIdx(curFrame);
	if (iCurCol == idxLastCol()) {
		return;  // We can't advance any further.
	}
	var pgNum = pageByIdx(iCurCol);
	var colNum = colByIdx(iCurCol);

	if (colNum == colCt()) {  // if currently last column, move forward to first column of next page
		newPg = app.activeWindow.parent.pages[pgNum + 1];
		app.activeWindow.activePage = newPg;
		app.activeWindow.select(getBodyFrame(newPg, 1));
	} else {  // move to next column of current page
		app.activeWindow.activePage = curFrame.parentPage; // because sometimes it had the selected frame but was not actually active
		app.activeWindow.select(getBodyFrame(curFrame.parentPage, colCt()));
	}
}

