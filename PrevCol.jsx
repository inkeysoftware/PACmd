// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "PrevCol"); 

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
	if (curFrame == null) {  // No column body frame selected, so select 1st col
		app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, 1));
        return;  
    }
	//unhiliteCol(curFrame);  // shouldn't be necessary, if we didn't mess up something earlier
	
	iCurCol = getFrameIdx(curFrame);
	if (iCurCol == 1) {
		return;  // We can't extend back any further.
	}
	var pgNum = pageByIdx(iCurCol);
	var colNum = colByIdx(iCurCol);

	if (colNum == 1) {  // if currently first column, move back to last column of prev page
		newPg = app.activeWindow.parent.pages[pgNum - 1];
		app.activeWindow.activePage = newPg;
		app.activeWindow.select(getBodyFrame(newPg, colCt()));
	} else {  // move to first column of current page
		app.activeWindow.activePage = curFrame.parentPage;  // because sometimes it had the selected frame but was not actually active
		app.activeWindow.select(getBodyFrame(curFrame.parentPage, 1));
	}
}

