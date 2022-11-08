; PA Keymander, for PA7, to run Publishing Assistant from the keyboard.
;======================================================================

Version = 0.1.2
;@Ahk2Exe-SetVersion 0.0.1.2
;@Ahk2Exe-SetName PAKeymander
;@Ahk2Exe-SetProductName PAKeymander
;@Ahk2Exe-SetMainIcon PAKey128.ico

;========================== 
; Initialization
;========================== 
global PaWin := "Publishing Assistant ahk_class WindowsForms10.Window.8.app.0.13965fa_r6_ad1"
PaWinDebug := "ahk_class Notepad"
if ((not WinExist(PaWin)) and WinExist(PaWinDebug)) 
	PaWin := PaWinDebug
Menu Tray, Icon, %A_ScriptDir%\PAKey128.ico,,1
Menu Tray, Tip, PAKeymander
Menu Tray, NoStandard
Menu Tray, Add, Suspend, HoldIt
Menu Tray, Add, Exit, QuitIt
global IdWin := "ahk_class indesign" 
EnvGet tempFolder, TEMP
global ID2PAresponseFile:=tempFolder . "\ID2PAresponse.txt"
SetTitleMatchMode, 2
CoordMode, Mouse, Window
MsgBox 0, PubAssist7.ahk, Launching PA Keymander`nVersion: %Version%, 1
global lastMods
#SingleInstance Force
return

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
	DoAction(0, lastMods)
}
DoubleTapShrink() {
	DoAction(0, lastMods + 2)
}

;-------------------------- F3: Reset
*F3::EnableDoubleTap("Reset")
SingleTapReset() { 
	DoAction(16, lastMods)
}
DoubleTapReset() {
	DoAction(16, lastMods + 4)
}

;-------------------------- F4: Expand
*F4::EnableDoubleTap("Expand")
SingleTapExpand() { 
	DoAction(32, lastMods)
}
DoubleTapExpand() {
	DoAction(32, lastMods + 2)
}

;-------------------------- F5: Adjust
*F5::EnableDoubleTap("Adjust")
SingleTapAdjust() {  
	SendPAClick(64, lastMods)
}
DoubleTapAdjust() {
	SendPAClick(65, lastMods)
}

;-------------------------- F6: Adjust Next Page
*F6::EnableDoubleTap("AdjustNext")
SingleTapAdjustNext() {  
	AdjustNextPage(64)
}
DoubleTapAdjustNext() {
	AdjustNextPage(65)
}
AdjustNextPage(button) {
	SendIdKeys("^!+-") ; Ctrl+Alt+Shift+Minus should move to the next page and signal when complete.
	r := GetId2PaResponse()  ; Wait till InDesign responds
	Switch r {
		case "nextPg":
			SendPAClick(button, lastMods)
			return
		case "eof":
			MsgBox You are already on the final page.
			return
	}
}

;-------------------------- F7: Update Header
*F7::EnableDoubleTap("Header")
SingleTapHeader() {  
	SendPAClick(66, lastMods) ; Update header
}
DoubleTapHeader() {
	SendPAClick(67, lastMods) ; Update all headers
}

;-------------------------- F8: Rebuild Gutter
*F8::EnableDoubleTap("Gutter")
SingleTapGutter() {  
	SendPAClick(68, lastMods) ; Rebuild Gutter
}
DoubleTapGutter() {
	SendPAClick(69, lastMods) ; Rebuild All Gutters
}

;-------------------------- F9: Rebuild Marginal Verses
*F9::EnableDoubleTap("Marginal")
SingleTapMarginal() {  
	SendPAClick(70, lastMods) ; Rebuild Marginal Verses
}
DoubleTapMarginal() {
	SendPAClick(71, lastMods) ; Rebuild All Marginal Verses
}

;-------------------------- F10: Import illustrations
*F10::SendPAClick(72, GetModKeyStates())  

;-------------------------- F11: Place Notes
*F11::SendPAClick(74, GetModKeyStates())  

;-------------------------- F12: Validate
*F12::EnableDoubleTap("Validate")
SingleTapValidate() {  
	SendPAClick(76, lastMods) ; Validate
}
DoubleTapValidate() {
	SendPAClick(77, lastMods) ; Validate All
}

;-------------------------- Ctrl+Shift+p: New Page
^+p::SendPAClick(78) 

;-------------------------- Ctrl+Shift+n: Next Book
^+n::SendPAClick(79) 

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
!`::
if (WinExist(PaWin) AND NOT WinActive(PaWin)) {
	WinActivate, %PaWin% ; Activate PA
} else {
	WinActivate, %IdWin% ; Activate InDesign
}
return

;===================================================
; Use Ctrl+Alt+Shift+R to reload this script if you make changes to it. (Uncompiled version only.)
;@Ahk2Exe-IgnoreBegin
^!+r::Reload
;@Ahk2Exe-IgnoreEnd

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
	WinWait, %PaWin%
	SoundPlay, %A_ScriptDir%\click.wav
}

;--------------------------
; Click the button specified by id, optionally with specified modifier keys.
SendPAClick(buttonid, mods=0) {
	SendMessage 0x8001, %mods%, %buttonid%,, %PaWin%
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% ; Activate InDesign
	WinWait, %PaWin%
	SoundPlay, %A_ScriptDir%\click.wav
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
	MsgBox 17, Error: No Response from InDesign shortcut key, PAKeymander has not received an expected response from InDesign.`n`nPlease go to [Edit] > [Keyboard shortcuts], and ensure that the [PAKeymander] set is selected.`n`nIf it was already selected, please select [Scripts] from the `n[Product Area] dropdown, and ensure that the keyboard shortcuts assigned to each script match the settings in the PAKeyInDesignKeyboardShortcuts.txt file.`n`nWould you like to open this file now?
	IfMsgBox, OK 
		Run %A_ScriptDir%\PAKeyInDesignKeyboardShortcuts.txt
	return ""
}

;--------------------------
; Get the states of the Ctrl, Shift, and Alt modifier keys, in case we want to pass them on later.
GetModKeyStates() {
	s := 0
	if GetKeyState("Shift") {
		s := s + 1
	}
	if GetKeyState("Ctrl") {
		s := s + 2
	}
	if GetKeyState("Alt") {
		s := s + 4
	}
	return s
}

;--------------------------
; Do Shrink/Reset/Expand action on the current scope.
; First runs a script in InDesign to determine the current scope.
DoAction(action, mods=0) {
	; Activate InDesign
	IfWinNotActive, %IdWin%,, WinActivate, %IdWin% 
	; Send Ctrl+Alt+Shift+Equals to InDesign to trigger the GetScopeDefault/Text script.
	Send ^!+=
	scope := GetId2PaResponse()

	Switch scope {
		case "Para":
			SendPAClick(action, mods)
			return
		case "Col":
			SendPAClick(action+1, mods)
			return
		case "Pg":
			SendPAClick(action+2, mods)
			return
		case "":
			; MsgBox No response received from InDesign script.
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

HoldIt:
Suspend Toggle
Menu, Tray, ToggleCheck, Suspend
return

QuitIt:
ExitApp

