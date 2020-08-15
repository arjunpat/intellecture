//
//  WebView.swift
//  Intellecture
//
//  Created by Arjun Patrawala on 8/14/20.
//  Copyright © 2020 Arjun Patrawala. All rights reserved.
//

import Foundation
import WebKit
import SwiftUI

public struct WebView {
    private let webView: WKWebView = WKWebView()

    public func load(url: URL) {
        webView.configuration.preferences.javaScriptEnabled = true
        webView.load(URLRequest(url: url))
    }

    public class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        var parent: WebView

        init(parent: WebView) {
            self.parent = parent
        }

        public func webView(_: WKWebView, didFail: WKNavigation!, withError: Error) {
            // ...
        }

        public func webView(_: WKWebView, didFailProvisionalNavigation: WKNavigation!, withError: Error) {
            // ...
        }

        public func webView(_: WKWebView, didFinish: WKNavigation!) {
            // ...
        }

        public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            // ...
        }

        public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            decisionHandler(.allow)
        }

        public func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if navigationAction.targetFrame == nil {
                webView.load(navigationAction.request)
            }
            return nil
        }
    }

    public func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
}


extension WebView: NSViewRepresentable {
    public typealias NSViewType = WKWebView

    public func makeNSView(context: NSViewRepresentableContext<WebView>) -> WKWebView {
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        return webView
    }

    public func updateNSView(_ nsView: WKWebView, context: NSViewRepresentableContext<WebView>) {
        // ...
    }
}
