\
    package com.team.productstudio;

    import android.app.Activity;
    import android.content.ActivityNotFoundException;
    import android.content.Intent;
    import android.graphics.Bitmap;
    import android.net.Uri;
    import android.os.Bundle;
    import android.view.KeyEvent;
    import android.view.View;
    import android.view.ViewGroup;
    import android.webkit.ValueCallback;
    import android.webkit.WebChromeClient;
    import android.webkit.WebResourceRequest;
    import android.webkit.WebSettings;
    import android.webkit.WebView;
    import android.webkit.WebViewClient;
    import android.widget.FrameLayout;
    import android.widget.ProgressBar;
    import android.widget.Toast;

    public class MainActivity extends Activity {
        private static final String HOME_URL = "https://team-website-sand.vercel.app/";
        private static final int FILE_CHOOSER_REQUEST = 1001;

        private WebView webView;
        private ProgressBar progressBar;
        private ValueCallback<Uri[]> filePathCallback;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            FrameLayout root = new FrameLayout(this);

            webView = new WebView(this);
            progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
            progressBar.setMax(100);

            root.addView(webView, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
            ));

            FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    8
            );
            progressParams.gravity = android.view.Gravity.TOP;
            root.addView(progressBar, progressParams);

            setContentView(root);

            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setLoadWithOverviewMode(true);
            settings.setUseWideViewPort(true);
            settings.setSupportZoom(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setAllowFileAccess(false);
            settings.setAllowContentAccess(true);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

            webView.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageStarted(WebView view, String url, Bitmap favicon) {
                    progressBar.setVisibility(View.VISIBLE);
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    progressBar.setVisibility(View.GONE);
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    return handleUrl(request.getUrl());
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    return handleUrl(Uri.parse(url));
                }
            });

            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onProgressChanged(WebView view, int newProgress) {
                    progressBar.setProgress(newProgress);
                    progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
                }

                @Override
                public boolean onShowFileChooser(
                        WebView webView,
                        ValueCallback<Uri[]> callback,
                        FileChooserParams fileChooserParams
                ) {
                    if (filePathCallback != null) {
                        filePathCallback.onReceiveValue(null);
                    }
                    filePathCallback = callback;

                    Intent intent;
                    try {
                        intent = fileChooserParams.createIntent();
                    } catch (Exception error) {
                        filePathCallback = null;
                        Toast.makeText(MainActivity.this, "File picker is not available.", Toast.LENGTH_SHORT).show();
                        return false;
                    }

                    try {
                        startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                        return true;
                    } catch (ActivityNotFoundException error) {
                        filePathCallback = null;
                        Toast.makeText(MainActivity.this, "No file picker found.", Toast.LENGTH_SHORT).show();
                        return false;
                    }
                }
            });

            webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (Exception error) {
                    Toast.makeText(this, "Unable to open download.", Toast.LENGTH_SHORT).show();
                }
            });

            if (savedInstanceState == null) {
                webView.loadUrl(HOME_URL);
            } else {
                webView.restoreState(savedInstanceState);
            }
        }

        private boolean handleUrl(Uri uri) {
            String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
            String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase();

            if ((scheme.equals("https") || scheme.equals("http"))
                    && host.equals("team-website-sand.vercel.app")) {
                return false;
            }

            try {
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (Exception error) {
                Toast.makeText(this, "No app found for this link.", Toast.LENGTH_SHORT).show();
            }
            return true;
        }

        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);

            if (requestCode == FILE_CHOOSER_REQUEST && filePathCallback != null) {
                Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
        }

        @Override
        protected void onSaveInstanceState(Bundle outState) {
            webView.saveState(outState);
            super.onSaveInstanceState(outState);
        }

        @Override
        public boolean onKeyDown(int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                webView.goBack();
                return true;
            }
            return super.onKeyDown(keyCode, event);
        }

        @Override
        protected void onDestroy() {
            if (webView != null) {
                webView.stopLoading();
                webView.destroy();
            }
            super.onDestroy();
        }
    }
