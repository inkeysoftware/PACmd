; PA Commander, for PA7, to run Publishing Assistant from the keyboard.
;======================================================================

Version = 0.0.6

;========================== 
; Initialization
;========================== 
global PaWin := "Publishing Assistant ahk_class WindowsForms10.Window.8.app.0.13965fa_r6_ad1"
global IdWin := "ahk_class indesign" 
EnvGet tempFolder, TEMP
global ID2PAresponseFile:=tempFolder . "\ID2PAresponse.txt"
SetTitleMatchMode, 2
CoordMode, Mouse, Window
MsgBox 0, PubAssist7.ahk, Launching PA Commander`nVersion: %Version%, 1
global lastMods
#SingleInstance Force


;==========================
; HOTKEY DEFINITIONS
;==========================

; Hotkeys to use when both PA's toolbar and ID are running, 
; and, if there is an active window, it's one of them:
#If (WinExist(IdWin) and WinExist(PaWin)) and (WinActive(IdWin) or WinActive(PaWin) or NoWinActive())

; F1 reserved for "Find Best Fit" in a future version of PA

;-------------------------- F2: Shrink
*F2::EnableDoubleTap("Shrink")
SingleTapShrink() { 
	DoAction(1, lastMods)
}
DoubleTapShrink() {
	DoAction(1, lastMods . "^")
}

;-------------------------- F3: Reset
*F3::EnableDoubleTap("Reset")
SingleTapReset() { 
	DoAction(2, lastMods)
}
DoubleTapReset() {
	DoAction(2, lastMods . "!")
}

;-------------------------- F4: Expand
*F4::EnableDoubleTap("Expand")
SingleTapExpand() { 
	DoAction(3, lastMods)
}
DoubleTapExpand() {
	DoAction(3, lastMods . "^")
}

;-------------------------- F5: Adjust
*F5::EnableDoubleTap("Adjust")
SingleTapAdjust() {  
	SendPAClick(4,1, lastMods)
}
DoubleTapAdjust() {
	SendPAClick(4,3, lastMods)
}

;-------------------------- F6: Adjust Next Page
*F6::EnableDoubleTap("AdjustNext")
SingleTapAdjustNext() {  
	AdjustNextPage(1)
}
DoubleTapAdjustNext() {
	AdjustNextPage(3)
}
AdjustNextPage(buttonCol) {
	SendIdKeys("^!+-") ; Ctrl+Alt+Shift+Minus should move to the next page and signal when complete.
	r := GetId2PaResponse()  ; Wait till InDesign responds
	Switch r {
		case "nextPg":
			SendPAClick(4, buttonCol, lastMods)
			return
		case "eof":
			MsgBox You are already on the final page.
			return
	}
}

;-------------------------- F7: Update Header
*F7::EnableDoubleTap("Header")
SingleTapHeader() {  
	SendPAClick(5, 1, lastMods) ; Update header
}
DoubleTapHeader() {
	SendPAClick(5, 3, lastMods) ; Update all headers
}

;-------------------------- F8: Rebuild Gutter
*F8::EnableDoubleTap("Gutter")
SingleTapGutter() {  
	SendPAClick(6, 1, lastMods) ; Rebuild Gutter
}
DoubleTapGutter() {
	SendPAClick(6, 3, lastMods) ; Rebuild All Gutters
}

;-------------------------- F9: Rebuild Marginal Verses
*F9::EnableDoubleTap("Marginal")
SingleTapMarginal() {  
	SendPAClick(7, 1, lastMods) ; Rebuild Marginal Verses
}
DoubleTapMarginal() {
	SendPAClick(7, 3, lastMods) ; Rebuild All Marginal Verses
}

;-------------------------- F10: Import illustrations
*F10::SendPAClick(8,2, GetModKeyStates())  

;-------------------------- F11: Place Notes
*F11::SendPAClick(9,2, GetModKeyStates())  

;-------------------------- F12: Validate
*F12::EnableDoubleTap("Validate")
SingleTapValidate() {  
	SendPAClick(10, 1, lastMods) ; Validate
}
DoubleTapValidate() {
	SendPAClick(10, 3, lastMods) ; Validate All
}

;-------------------------- Ctrl+Shift+p: New Page
^+p::SendPAClick(11,2) 

;-------------------------- Ctrl+Shift+n: Next Book
^+n::SendPAClick(12,2) 

;===================================================
; Hotkeys to pass to PA7 when InDesign is active:
#If (WinExist(IdWin) and WinExist(PaWin)) and (WinActive(IdWin) or NoWinActive())
^a::SendPAKeys("^a")  ; Open/edit job
^d::SendPAKeys("^d")  ; Adjust illustrations 
^g::SendPAKeys("^g")  ; Go to chapter:verse
^!o::SendPAKeys("!o") ; Ctrl+Alt+o for Options
^!j::SendPAKeys("^j") ; Ctrl+Alt+j for Job Settings

;===================================================
; Hotkeys to pass to InDesign when PA is active:
#If (WinExist(IdWin) and WinExist(PaWin)) and (WinActive(PaWin) or NoWinActive())

PgUp::SendIdKeys("{PgUp}")
PgDn::SendIdKeys("{PgDn}")
+PgUp::SendIdKeys("+{PgUp}")
+PgDn::SendIdKeys("+{PgDn}")
Ins::SendIdKeys("{Ins}")  	; Ins - InDesign: Toggle Page/Col
Esc::SendIdKeys("{Esc}") 	; Esc - InDesign: Toggle Text/Col

#If

;===================================================
; Use Ctrl+Alt+Shift+R to reload this script if you make changes to it.
^!+r::Reload

;========================== 
; HELPER FUNCTIONS
;========================== 

;--------------------------
; Send the provided keys to InDesign
SendIdKeys(keys) {
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% ; Activate InDesign
	Send %keys%
}

;--------------------------
; Send the provided keys to PA
SendPAKeys(keys) {
	IfWinNotActive, %PaWin%,, WinActivate, %PaWin% ; Activate PA
	Send %keys%
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% ; Activate InDesign
}

;--------------------------
; Click the button located at the specified row and column, optionally with specified modifier keys.
SendPAClick(row, col, mods="") {
	IfWinNotActive, %PaWin%,, WinActivate, %PaWin% ; Activate PA
	WinGetPos, xx,yy,W,H,%PaWin%
	y := (H/14)*(row + 1.25)  ; Calculate where to click in the PA tool window
	x := W * col / 4 
	Send %mods%{Click %x% %y%}
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% ; Activate InDesign
}

;--------------------------
; Wait up to 3 seconds for ID2PAresponse.txt file, returning its contents, 
; or an empty string if no response.
GetId2PaResponse() {
	Loop 30 {
		if FileExist(ID2PAresponseFile) {
			FileReadLine resp, %ID2PAresponseFile%, 1
			FileDelete %ID2PAresponseFile%
			return resp
		}
		Sleep, 100
	}
	MsgBox No response via %ID2PAresponseFile%
	return ""
}

;--------------------------
; Get the states of the Ctrl, Shift, and Alt modifier keys, in case we want to pass them on later.
GetModKeyStates() {
	s := ""
	if GetKeyState("Ctrl") {
		s := s . "^"
	}
	if GetKeyState("Shift") {
		s := s . "+"
	}
	if GetKeyState("Alt") {
		s := s . "!"
	}
	return s
}

;--------------------------
; Do Shrink/Reset/Expand action on the current scope.
; First runs a script in InDesign to determine the current scope.
DoAction(action, mods="") {
	; Activate InDesign
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% 
	; Send Ctrl+Alt+Shift+Equals to InDesign to trigger the GetScopeDefault/Text script.
	Send ^!+=
	scope := GetId2PaResponse()

	Switch scope {
		case "Para":
			SendPAClick(1, action, mods)
			return
		case "Col":
			SendPAClick(2,action, mods)
			return
		case "Pg":
			SendPAClick(3,action, mods)
			return
		case "":
			MsgBox No response received from InDesign script.
			return
	}
	MsgBox PA7 does not yet support "%scope%" actions.
}

;--------------------------
; Set up double-tap functionality
EnableDoubleTap(key) {
	global
	if (pressed%key% == "s") {  ; Cancel timer and run double tap
		SetTimer TapTimedOut, Delete
		pressed%key% := ""
		DoubleTap%key%()
		return
	}
	; Otherwise, this is the first press. Set a timer.
	pressed%key% := "s"
	lastKey := key
	lastMods := GetModKeyStates()
	SetTimer, TapTimedOut, -400 ; Wait for more presses within a 400 millisecond window.
}

TapTimedOut:
	pressed%lastKey% := ""
	SingleTap%lastKey%()
	return

;--------------------------
; Return true if no window is active. (Used to determine when hotkeys are active.)
NoWinActive() {
	WinGetClass, class, A
	return (class == "")
}

