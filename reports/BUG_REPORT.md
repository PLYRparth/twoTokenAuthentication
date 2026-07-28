# Shotkut QA Bug Report

**Website:** https://www.shotkut.com\

## Summary

As part of the technical assessment, I performed a manual QA audit of
the Shotkut website using Chrome DevTools, Network inspection, and
normal user interaction.

------------------------------------------------------------------------

# Bug 1 --- Direct Preview Media URLs Are Publicly Accessible (High Severity)

**Category:** Security / Content Protection

### Description

During testing, the Network tab exposed direct preview media URLs hosted
on Amazon S3. The API response also returns a publicly accessible
`previewURL` field. Anyone with this URL can open the preview asset
directly in the browser and access it outside the application.

If these preview assets are intended to be protected or restricted to
authenticated users, exposing direct media URLs may weaken content
protection.

### Steps to Reproduce

1.  Open any stock video.
2.  Open Chrome DevTools → Network.
3.  Filter by **Media** or inspect the video API request.
4.  Copy the `previewURL` returned in the API response or open the
    `preview.mp4` request.
5.  Paste the URL into a new browser tab.

### Expected Result

Preview media should be served using signed URLs or authenticated
requests if access control is intended.

### Actual Result

The preview asset is directly accessible through a public URL.

### Evidence

**Network request exposing preview asset**

![](https://chatgpt.com/backend-api/estuary/content?id=file_00000000ef38822f86927a2d7caea7aa&ts=495899&p=fs&cid=1&sig=36e362422350a13c0f57cf6a6bbb57b5f87b86791da843ac69239288340c6c30&v=0)

**Direct preview URL opened in browser**

![](https://chatgpt.com/backend-api/estuary/content?id=file_00000000f770822f9792e15c0214aa25&ts=495899&p=fs&cid=1&sig=4b28603e25ea1bbe95e4712c046684e54b115f2591fd9e987e1b579447d253cc&v=0)

**API response exposing `previewURL`**

![](https://chatgpt.com/backend-api/estuary/content?id=file_0000000043c4822fb41508a2547a24d4&ts=495899&p=fs&cid=1&sig=4ad3334749bb7f9e73d7c2bd43a01c8da7093d43cfa5f93b84ff094911c9dd43&v=0)

------------------------------------------------------------------------

# Bug 2 --- User Session Is Not Persisted (Medium Severity)

**Category:** Authentication / UX

### Description

Refreshing the page logs the user out, and no authentication/session
cookie was observed during testing.

### Steps to Reproduce

1.  Login.
2.  Refresh the page.
3.  Observe that the user is logged out.

### Evidence

![](https://chatgpt.com/backend-api/estuary/content?id=file_000000008348822fa810d753dcac4a87&ts=495899&p=fs&cid=1&sig=68a79ba8b23f5d48cef82ba298b47987fcc2d525d56348a95a5bc9b7e3f03611&v=0)

------------------------------------------------------------------------

# Bug 3 --- "Start Free Now" Button Is Non-functional (Medium Severity)

**Category:** Functional

### Description

The **Start free now** button on the search/filter page does not perform
any action.

### Steps to Reproduce

1.  Open the search page.
2.  Click **Start free now**.

### Expected Result

Navigate to signup or free plan onboarding.

### Actual Result

No action occurs.

### Evidence

![](https://chatgpt.com/backend-api/estuary/content?id=file_000000009e10822f9742a1a592394d62&ts=495899&p=fs&cid=1&sig=05b6df5e4d4f0c778fb7108dd4b78e4849b22b9231149cb429b3de4300316d5d&v=0)

------------------------------------------------------------------------

# Bug 4 --- Slow Search Experience (Low--Medium Severity)

**Category:** Performance

### Description

Search results take noticeable time to load and display skeleton
placeholders for an extended period before rendering content.

### Evidence

![](https://chatgpt.com/backend-api/estuary/content?id=file_00000000dc00822f90b2c8640f3c95ea&ts=495899&p=fs&cid=1&sig=09403d45cadab59b8f6162d5d8247b30491a187851b88cd76879d5a4456ad605&v=0)

------------------------------------------------------------------------

# Recommendations

-   Protect preview media using signed URLs or authenticated streaming.
-   Persist user sessions using secure HttpOnly refresh-token cookies or
    server-side sessions.
-   Fix the "Start free now" CTA.
-   Optimize search using indexing, caching, pagination, and request
    debouncing.

------------------------------------------------------------------------

**Note:** Findings are based on manual testing using browser developer
tools.
