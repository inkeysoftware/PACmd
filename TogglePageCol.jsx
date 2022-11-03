// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "Extend"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	// If there had been any extended selection, wipe it out.
	selEnd = getPersistentNum("end");
	if (selEnd) {
		unhighlightRange(getPersistentNum("start"), selEnd);
		selEnd = setPersistentNum("end", 0);
		return;
	}
	if (colCt() == 1) {
		return;
	}
	
	curFrame = getCurColFrame();
	if (curFrame == null) {  // No column body frame selected, so select last col
		curFrame = getBodyFrame(app.activeWindow.activePage, colCt());
    }
	app.activeWindow.select(curFrame);
	colIdx = getFrameIdx(curFrame);
	colNum = colByIdx(colIdx);
	otherColNum = 3 - colNum;
	otherColIdx = colIdx - colNum + otherColNum;
	hiliteCol(curFrame);
	hiliteCol(getBodyFrame(curFrame.parentPage, otherColNum));
	setPersistentNum("end", colIdx);
	setPersistentNum("start", otherColIdx);
	

}

