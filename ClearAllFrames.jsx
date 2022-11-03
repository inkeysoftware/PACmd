// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "ClearAllFrames"); 
// main();													

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	unhighlightRange(1, idxLastCol());
	alert("ClearAllFrames completed.");
}

