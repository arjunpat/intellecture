//
//  AppDelegate.swift
//  Intellecture
//
//  Created by Arjun Patrawala on 8/14/20.
//  Copyright © 2020 Arjun Patrawala. All rights reserved.
//

import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Create the SwiftUI view that provides the window contents.
        let contentView = ContentView()

        // Create the window and set the content view.
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 400),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered, defer: false)
        window.maxSize = NSSize(width: 600, height: 100)
        window.minSize = NSSize(width: 600, height: 100)
        window.center()
        window.setFrameAutosaveName("Main Window")
        window.contentView = NSHostingView(rootView: contentView)
        window.makeKeyAndOrderFront(nil)
        window.level = NSWindow.Level.statusBar
        window.styleMask = [.borderless, .resizable]
        
        let screen = NSScreen.main!
        print("asdf: \(screen.frame)")
        
        window.setFrameTopLeftPoint(NSPoint(x: screen.frame.width - 600, y: 100))
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

}

