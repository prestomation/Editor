export enum IPCRequests {
	OpenWindowOnDemand = "openwindowondemand",

	OpenFileDialog = "openfiledialog",
	SaveFileDialog = "savefiledialog",
	OpenDirectoryDialog = "opendirectorydialog",

	GetProjectPath = "getprojectpath",
	SetProjectPath = "setprojectpath",

	GetWorkspacePath = "getworkspacepath",
	SetWorkspacePath = "setworkspacepath",

	GetAppPath = "getapppath",
	GetWindowId = "getwindowid",

	StartGameServer = "startgameserver",

	FocusWindow = "focuswindow",
	CloseWindow = "closewindow",
	SendWindowMessage = "sendwindowmessage",

	OpenDevTools = "opendevtools",
	EnableDevTools = "enabledevtools",

	SetTouchBar = "settouchbar",
}

export enum IPCResponses {
	OpenWindowOnDemand = "openwindowondemand",

	OpenFileDialog = "openfiledialog",
	SaveFileDialog = "savefiledialog",
	OpenDirectoryDialog = "opendirectorydialog",
	CancelOpenFileDialog = "cancelopenfiledialog",
	CancelSaveFileDialog = "cancelsavefiledialog",

	GetProjectPath = "getprojectpath",
	SetProjectPath = "setprojectpath",

	GetWorkspacePath = "getworkspacepath",
	SetWorkspacePath = "setworkspacepath",

	GetAppPath = "getapppath",
	GetWindowId = "getwindowid",

	StartGameServer = "startgameserver",

	SendWindowMessage = "sendwindowmessage",

	EnableDevTools = "enabledevtools",
}
