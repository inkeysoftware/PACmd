// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "GetScopeDefault"); 

function sendPACommand(cmd) {
	const cmdFilebase = Folder.temp + "/ID2PAresponse";
	var file = new File(cmdFilebase + ".tmp");
	file.open('w');
	file.write(cmd);
	file.close();
	file.rename(cmdFilebase + ".txt");
	// alert(cmdFilebase);
}

// getBodyFrame() - Given a Page and a column number, return the TextFrame indicated by the column number.
function getBodyFrame(pg, colNum) {
	// Temporary cheat: Using index rather than label. This probably won't work if intro goes onto second page.
	// Index numbers are different on the first page. 
	return pg.textFrames.item((pg.documentOffset == 0 ? 5 : 3) - colNum);
}

// Main function: 
function main() {
	var extPageStr = app.activeDocument.extractLabel("ExtPg");
	var hiddenExtPageStr = app.activeDocument.extractLabel("hiddenExtPage");
	if (extPageStr.length ==0 && hiddenExtPageStr.length == 0) {
		sendPACommand("Col");
		return;
	}
	
	var selFrame = null;
    for(ii = 0; ii < app.selection.length; ii++) {  // for each item in selection
        if ((app.selection[ii].constructor.name == "TextFrame") && (app.selection[ii].label.substring(4,0) == "body")) { // if item is a body textframe
            selFrame = app.selection[ii];
			break;
        } else {
            try {
                selFrame = app.selection[ii].parentTextFrames[0]; // if item has a parent textframe
            } catch (err) {
            }
        }
	}
	if (selFrame == null || selFrame.label.substring(4,0) != "body") {     // e.g. Illustration group is selected
		selFrame = getBodyFrame(app.activeWindow.activePage, 2);
		app.activeWindow.select(selFrame);	// Select second textframe
	} 

	var lbl = selFrame.label;
	var pgNum = selFrame.parentPage.documentOffset;
	var m = lbl.match(/body(\d)/);
	// var col = parseInt(m[1]);
	var colStr = m[1];

	var extPage = -1;
	if (extPageStr.length > 0) {
		extPage = parseInt(extPageStr);
	} else {
		extPage = parseInt(hiddenExtPageStr);
	}
	var extColStr = app.activeDocument.extractLabel("ExtCol");
	if (extPage == pgNum && extColStr == colStr) {
		// Extend on same column, so treat this as extend to page
		if (colStr == "1") {
			selFrame = getBodyFrame(app.activeWindow.activePage, 2);
			app.activeWindow.select(selFrame);
			colStr = "2";
		} else {
			selFrame.strokeWeight = 0;
			extColStr = "1";
		}
	}

	if (extPageStr.length == 0) {
		var hiddenExtPageSelStr = app.activeDocument.extractLabel("hiddenExtPageSel");
		if (hiddenExtPageSelStr != pgNum.toString() + ":" + colStr) {
			app.activeDocument.insertLabel("hiddenExtPage", "");
			sendPACommand("Col");
			// sendPACommand("expired");
			return;
		}
	}
	
	var selPos = pgNum * 2 + parseInt(colStr);
	var extPos = extPage * 2 + parseInt(extColStr);
	// var diff = Math.abs(selPos - extPos);
	var diff;

	// Remove the old extend
	// var oldPg = app.activeWindow.parent.pages[extPage];
	// var oldFrame = getBodyFrame(oldPg, parseInt(extColStr));
	// oldFrame.strokeWeight = 0;
	if (extPageStr.length > 0) {
		ePg = app.activeWindow.parent.pages[extPage];
		eFrame = getBodyFrame(ePg, parseInt(extColStr));
		eFrame.strokeWeight = 0;
		app.activeDocument.insertLabel("ExtPg", "");
		if (selPos > extPos) {
			diff = selPos - extPos + 1;
			app.activeDocument.insertLabel("hiddenExtPage", extPageStr);
			app.activeDocument.insertLabel("hiddenExtPageSel", pgNum.toString() + ":" + colStr);
		} else {  
			// swap extend and selected
			diff = extPos - selPos + 1;
			app.activeDocument.insertLabel("hiddenExtPage", pgNum.toString());
			app.activeDocument.insertLabel("ExtCol", colStr);
			app.activeDocument.insertLabel("hiddenExtPageSel", extPageStr + ":" + extColStr);
			app.activeWindow.select(eFrame);
		}
	}

	if (pgNum == extPage) {
		sendPACommand("Pg");
		return;
	}
	
	
		// alert("PA7 does not yet support multi-column ranges. Acting on Page instead.\n\n" + "Sel: " + pgNum.toString() + ", " + colStr + ".  Ext: " + extPage.toString() + ", " + extColStr );
	sendPACommand(diff.toString() + "-column");
}

