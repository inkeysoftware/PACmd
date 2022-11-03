// Run script in a way that a single Undo step undoes all its changes
// app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "NextPara"); 
main();													// NextPara.jsx - Move to next paragraph

#include "inc/PACmd.jsxinc"


// Main function: 
function main() {
	for (ii=1; ii<=idxLastCol(); ii++) {
		unhiliteCol(getBodyFrameByIdx(ii));
	}
}
