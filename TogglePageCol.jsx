// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "Extend"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
    if (app.selection.length == 0) {
		app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, 2));	// Select second col textframe
        return;  // Nothing selected, so select 2nd col
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
		app.activeWindow.select(getBodyFrame(app.activeWindow.activePage, 2));	// Select second textframe
		return;  // Invalid selection, so select 2nd col
	} 

	var lbl = selFrame.label;
	var pgNum = selFrame.parentPage.documentOffset;
	var m = lbl.match(/body(\d)/);
	// var col = parseInt(m[1]);
	var colStr = m[1];

	var extPageStr = app.activeDocument.extractLabel("ExtPg");
	if (extPageStr.length > 0) {
		// If there was already an extend scope...
		var extPage = parseInt(extPageStr);
		var extColStr = app.activeDocument.extractLabel("ExtCol");
		if (extPage == pgNum && extColStr == colStr) {
			// Repeated on same column, so undo
			selFrame.strokeWeight = 0;
			app.activeDocument.insertLabel("ExtPg", "");
			return;
		} 
		// Remove the old extend
		var oldPg = app.activeWindow.parent.pages[extPage];
		var oldFrame = getBodyFrame(oldPg, parseInt(extColStr));
		oldFrame.strokeWeight = 0;
	}
	// Extend on selected col
	app.activeDocument.insertLabel("ExtPg", pgNum.toString());
	app.activeDocument.insertLabel("ExtCol", colStr);
	selFrame.strokeWeight = 5;
	selFrame.strokeAlignment = StrokeAlignment.OUTSIDE_ALIGNMENT;
	selFrame.strokeColor = "C=75 M=5 Y=100 K=0";
	selFrame.strokeType = "White Diamond";
	app.activeWindow.select(selFrame);
}

