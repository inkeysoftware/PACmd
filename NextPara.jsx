// Run script in a way that a single Undo step undoes all its changes
// app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextPara"); 
main();													// NextPara.jsx - Move to next paragraph

#include "inc/PACmd.jsxinc"


// Main function: 
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
	if (idx < thisFrame.paragraphs.length-1) {
		nextPara = thisFrame.paragraphs[idx+1];
	} else {
		thisFrameIdx = getFrameIdx(thisFrame);
		if (thisFrameIdx == idxLastCol()) {   // end of story
			nextPara = curPara; 
		} else { 
			nextFrame = getBodyFrameByIdx(thisFrameIdx + 1);
			firstParagraph = nextFrame.paragraphs[0];
			if (firstParagraph == curPara)  
				nextPara = nextFrame.paragraphs[1];
			else
				nextPara = firstParagraph;
		}
	}

	nextIp = nextPara.insertionPoints[0];
	nextPage = nextIp.parentTextFrames[0].parentPage;
	app.activeWindow.activePage = nextPage;
	app.activeWindow.select(nextPara);

	// If there had been any extended selection, wipe it out.
	selEnd = getPersistentNum("pac:selEnd");
	if (selEnd) {
		unhighlightRange(getPersistentNum("pac:selStart"), selEnd);
		selEnd = setPersistentNum("pac:selEnd", 0);
	}

	$.sleep(100);
	app.activeWindow.select(nextIp);
}

// function main3() {
	
	// d = new Date(); 
	// time1  = d.getTime();

	// curIp = app.selection[0].insertionPoints[0];

	// curPara = curIp.paragraphs[0];
	// if (curPara == null) { return; }
	

	// d2 = new Date();
	// time2  = d2.getTime();

	// curParas = curIp.paragraphs;
	// if (curParas == null) {return;}


	// thisFrame = curIp.parentTextFrames[0];
	// if (thisFrame == null) { return} 

	// d3 = new Date();
	// time3  = d3.getTime();

	// idx = -1;
	// for (pp = 0; pp<thisFrame.paragraphs.length; pp++) {
		// if (thisFrame.paragraphs[pp] == curPara) {
			// idx = pp;
			// break;
		// }
	// }
	// if (idx < thisFrame.paragraphs.length-1) {
		// nextPara = thisFrame.paragraphs[idx+1];
	// } else {
		// thisFrameIdx = getFrameIdx(thisFrame);
		// if (thisFrameIdx == idxLastCol()) { return }
		// nextFrame = getBodyFrameByIdx(thisFrameIdx + 1);
		// if (nextFrame == null)
				// return;
		// firstParagraph = nextFrame.paragraphs[0];
		// if (firstParagraph == curPara)  
			// nextPara = nextFrame.paragraphs[1];
		// else
			// nextPara = firstParagraph;
	// }

	// d4 = new Date();
	// time4  = d4.getTime();

	// if (nextPara == null) { return; }  // end of story

	// d5 = new Date();
	// time5  = d5.getTime();

	// nextIp = nextPara.insertionPoints[0];
	// if (nextIp == null) { return; } 

	// d6 = new Date();
	// time6  = d6.getTime();

	// nextPage = nextIp.parentTextFrames[0].parentPage;

	// d7 = new Date();
	// time7  = d7.getTime();

	// app.activeWindow.activePage = nextPage;

	// d8 = new Date();
	// time8  = d8.getTime();

	// app.activeWindow.select(nextPara);



	// $.sleep(100);
	// app.activeWindow.select(nextIp);


	// diff2 = time2 - time1;
	// diff3 = time3 - time2;
	// diff4 = time4 - time3;
	// diff5 = time5 - time4;
	// diff6 = time6 - time5;
	// diff7 = time7 - time6;
	// diff8 = time8 - time7;
	// alert("2:" + diff2 + ", 3:" + diff3 + ", 4:" + diff4 + ", 5:" + diff5 + ", 6:" + diff6 + ", 7:" + diff7 + ", 8:" + diff8 , thisFrame.paragraphs.length.toString());
// }

