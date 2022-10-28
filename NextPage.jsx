// Move to the same column (if possible) on the next page.

// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextPage"); 

// getBodyFrame() - Given a Page and a column number, return the TextFrame indicated by the column number.
function getBodyFrame(pg, colNum) {
	// Temporary cheat: Using index rather than label. This probably won't work if intro goes onto second page.
	// Index numbers are different on the first page. 
	return pg.textFrames.item((pg.documentOffset == 0 ? 5 : 3) - colNum);
}

function justDoNext() { // Make next window active, and select left Frame
	curr = app.activeWindow.activePage;
	newPg = app.activeWindow.parent.pages[Math.min(app.activeWindow.parent.pages.length-1,curr.documentOffset+1)];
	app.activeWindow.activePage = newPg;
	app.activeWindow.select(getBodyFrame(newPg, 1));	// Select left textframe
}

// Main function: 
function main() {
    if (app.selection.length == 0) { // Nothing selected, so just do next.
		justDoNext();
        return;  
    }

    for(ii = 0; ii < app.selection.length; ii++) {  // for each item in selection
        var selFrame = null;
        if ((app.selection[ii].constructor.name == "TextFrame") && (app.selection[ii].label.substring(4,0) == "body")) { // if item is a body textframe
            selFrame = app.selection[ii];
        } else {
            try {
                selFrame = app.selection[ii].parentTextFrames[0]; // if item has a parent textframe
            } catch (err) {
            }
        }
        if (selFrame == null || selFrame.label.substring(4,0) != "body") {     // e.g. Illustration group is selected
			justDoNext();
			return;  
        } else {
			var lbl = selFrame.label;
			var pg = selFrame.parentPage;
			try {
				var m = lbl.match(/body(\d)/);
				var col = parseInt(m[1]);
				newPg = app.activeWindow.parent.pages[Math.min(app.activeWindow.parent.pages.length-1,pg.documentOffset+1)];
				app.activeWindow.activePage = newPg;
				app.activeWindow.select(getBodyFrame(newPg, col));
			} catch (err) {
				justDoNext();
			}
        }
    }
}



