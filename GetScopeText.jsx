// Run script in a way that a single Undo step undoes all its changes
app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "GetScopeText"); 

#include "inc/PACmd.jsxinc"

// Main function: 
function main() {
	Respond2PA("Para");
}

