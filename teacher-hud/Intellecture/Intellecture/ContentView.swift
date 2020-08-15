//
//  ContentView.swift
//  Intellecture
//
//  Created by Arjun Patrawala on 8/14/20.
//  Copyright © 2020 Arjun Patrawala. All rights reserved.
//

import SwiftUI

struct BrowserView: View {
    private let browser = WebView()

    var body: some View {
        HStack {
            browser.onAppear() {
                self.browser.load(url: URL(string: "https://intellecture.app")!)
            }
        }
    }
}

struct ContentView: View {
    var body: some View {
        BrowserView()
    }
}
