// Run script in a way that a single Undo step undoes all its changes
// app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "PrevPara"); 
main();

#include "inc/PACmd.jsxinc"

// Main function: 
// function mainX() {
	
	// p = app.selection[0].insertionPoints[0];
	// nextp = p.paragraphs.previousItem(p.paragraphs[0]);
	// if (nextp == null) {
		// return; // end of story
	// }
	// nextIp = nextp.insertionPoints[-2];
	// app.activeWindow.activePage = nextIp.parentTextFrames[0].parentPage;
	// app.activeWindow.select(nextp);


	// $.sleep(100);
	// app.activeWindow.select(nextIp);
// }

function main() {
	curIp = app.selection[0].insertionPoints[0];
	curPara = curIp.paragraphs[0];
	curParas = curIp.paragraphs;
	thisFrame = curIp.parentTextFrames[0];

	idx = -1;  // Rather that using nextItem() on a paragraph that may be deep in the story, just search the current frame.
	for (pp = 0; pp<thisFrame.paragraphs.length; pp++) {
		if (thisFrame.paragraphs[pp] == curPara) {
			idx = pp;
			break;
		}
	}
	if (idx > 0) {
		nextPara = thisFrame.paragraphs[idx-1];
	} else {
		thisFrameIdx = getFrameIdx(thisFrame);
		if (thisFrameIdx == 1) {   // first frame
			nextPara = curPara; 
		} else { 
			nextFrame = getBodyFrameByIdx(thisFrameIdx - 1);
			lastParagraph = nextFrame.paragraphs[-1];
			if (lastParagraph == curPara)  
				nextPara = nextFrame.paragraphs[-2];
			else
				nextPara = lastParagraph;
		}
	}
	try {
		nextIp = nextPara.insertionPoints[0];
		nextPage = nextIp.parentTextFrames[0].parentPage;
		app.activeWindow.activePage = nextPage;
		app.activeWindow.select(nextPara);

		// If there had been any extended selection, wipe it out.
		selEnd = getPersistentNum("end");
		if (selEnd) {
			unhighlightRange(getPersistentNum("start"), selEnd);
			selEnd = setPersistentNum("end", 0);
		}

		$.sleep(100);
		app.activeWindow.select(nextIp);
	} catch(err) {
	}
}